<?php

use App\Enums\MarketingCampaignChannel;
use App\Enums\MarketingCampaignSendStatus;
use App\Enums\MarketingCampaignStatus;
use App\Enums\MarketingMessageTemplateChannel;
use App\Enums\WhatsAppAccountDriver;
use App\Jobs\SendMarketingCampaignWhatsAppJob;
use App\Models\MarketingCampaign;
use App\Models\MarketingCampaignSend;
use App\Models\MarketingContact;
use App\Models\MarketingList;
use App\Models\MarketingMessageTemplate;
use App\Models\User;
use App\Models\WhatsAppAccount;
use App\Services\Marketing\WhatsAppCloudApiService;
use Database\Seeders\RoleUserSeeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->seed(RoleUserSeeder::class);
});

test('commercial can create whatsapp account without leaking secrets in inertia', function () {
    $user = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    actingAs($user)
        ->post(route('marketing-whatsapp-accounts.store'), [
            'name' => 'Compte démo',
            'phone_number_id' => '1234567890',
            'business_account_id' => '9876543210',
            'access_token' => 'secret-token-value',
            'app_secret' => 'secret-app-value',
            'verify_token' => 'verify-demo',
            'driver' => WhatsAppAccountDriver::Log->value,
            'is_active' => true,
            'is_default' => true,
        ])
        ->assertRedirect();

    $account = WhatsAppAccount::query()->where('name', 'Compte démo')->firstOrFail();

    actingAs($user)
        ->get(route('marketing-whatsapp-accounts.edit', $account))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('marketing-whatsapp-accounts/edit')
            ->where('account.has_access_token', true)
            ->where('account.has_app_secret', true)
            ->missing('account.access_token')
            ->missing('account.app_secret'));
});

test('contributor without marketing campaigns permission cannot manage whatsapp accounts', function () {
    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();

    actingAs($user)
        ->get(route('marketing-whatsapp-accounts.index'))
        ->assertForbidden();
});

test('commercial can launch whatsapp campaign with log driver', function () {
    Queue::fake();

    $user = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $account = WhatsAppAccount::factory()->default()->create([
        'driver' => WhatsAppAccountDriver::Log,
    ]);
    $list = MarketingList::factory()->create();
    $contact = MarketingContact::factory()->create([
        'marketing_consent' => true,
        'phone' => '+224622999888',
        'email' => 'wa-contact@example.com',
    ]);
    $list->contacts()->attach($contact);
    $template = MarketingMessageTemplate::factory()->create([
        'channel' => MarketingMessageTemplateChannel::WhatsApp,
        'subject' => null,
        'meta_template_name' => 'hello_world',
        'meta_template_language' => 'fr',
    ]);
    $campaign = MarketingCampaign::factory()->create([
        'channel' => MarketingCampaignChannel::WhatsApp,
        'status' => MarketingCampaignStatus::Draft,
        'marketing_list_id' => $list->id,
        'marketing_message_template_id' => $template->id,
        'whatsapp_account_id' => $account->id,
        'created_by' => $user->id,
        'subject' => 'hello_world',
    ]);

    actingAs($user)
        ->post(route('marketing-campaigns.launch', $campaign))
        ->assertRedirect(route('marketing-campaigns.show', $campaign));

    expect($campaign->fresh()->status)->toBe(MarketingCampaignStatus::Sending)
        ->and(MarketingCampaignSend::query()->where('marketing_campaign_id', $campaign->id)->count())->toBe(1);

    Queue::assertPushed(SendMarketingCampaignWhatsAppJob::class);
});

test('whatsapp job stores provider message id via meta http fake', function () {
    Http::fake([
        'graph.facebook.com/*' => Http::response([
            'messages' => [['id' => 'wamid.TEST123']],
        ], 200),
    ]);

    $account = WhatsAppAccount::factory()->meta()->create();
    $campaign = MarketingCampaign::factory()->launched()->create([
        'channel' => MarketingCampaignChannel::WhatsApp,
        'whatsapp_account_id' => $account->id,
        'marketing_message_template_id' => MarketingMessageTemplate::factory()->create([
            'channel' => MarketingMessageTemplateChannel::WhatsApp,
            'meta_template_name' => 'promo',
            'meta_template_language' => 'fr',
        ])->id,
    ]);
    $send = MarketingCampaignSend::factory()->create([
        'marketing_campaign_id' => $campaign->id,
        'status' => MarketingCampaignSendStatus::Queued,
        'recipient_phone' => '+224622111222',
        'recipient_email' => null,
    ]);

    (new SendMarketingCampaignWhatsAppJob($send))->handle(app(WhatsAppCloudApiService::class));

    expect($send->fresh()->status)->toBe(MarketingCampaignSendStatus::Sent)
        ->and($send->fresh()->provider_message_id)->toBe('wamid.TEST123');
});

test('whatsapp webhook verifies challenge and updates delivery status', function () {
    $account = WhatsAppAccount::factory()->create([
        'verify_token' => 'verify-token-test',
        'app_secret' => 'app-secret-test',
    ]);

    $this->get(route('webhooks.marketing.whatsapp', $account).'?'.http_build_query([
        'hub_mode' => 'subscribe',
        'hub_verify_token' => 'verify-token-test',
        'hub_challenge' => '12345',
    ]))->assertOk()->assertSee('12345');

    $send = MarketingCampaignSend::factory()->create([
        'provider_message_id' => 'wamid.ABC',
        'status' => MarketingCampaignSendStatus::Sent,
        'recipient_phone' => '+224622000111',
    ]);

    $payload = [
        'entry' => [[
            'changes' => [[
                'value' => [
                    'statuses' => [[
                        'id' => 'wamid.ABC',
                        'status' => 'delivered',
                    ]],
                ],
            ]],
        ]],
    ];

    $body = json_encode($payload, JSON_THROW_ON_ERROR);
    $signature = 'sha256='.hash_hmac('sha256', $body, 'app-secret-test');

    $this->call(
        'POST',
        route('webhooks.marketing.whatsapp', $account),
        [],
        [],
        [],
        [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X-Hub-Signature-256' => $signature,
        ],
        $body,
    )->assertOk();

    expect($send->fresh()->status)->toBe(MarketingCampaignSendStatus::Received);
});

test('whatsapp webhook rejects invalid signature', function () {
    $account = WhatsAppAccount::factory()->create([
        'app_secret' => 'app-secret-test',
    ]);

    $this->call(
        'POST',
        route('webhooks.marketing.whatsapp', $account),
        [],
        [],
        [],
        [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X-Hub-Signature-256' => 'sha256=invalid',
        ],
        '{"entry":[]}',
    )->assertForbidden();
});
