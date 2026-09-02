<?php

use App\Enums\MarketingCampaignSendStatus;
use App\Enums\MarketingCampaignStatus;
use App\Events\Marketing\MarketingCampaignProgressUpdated;
use App\Jobs\SendMarketingCampaignEmailJob;
use App\Jobs\SyncMarketingCampaignCompletionJob;
use App\Mail\MarketingCampaignMailable;
use App\Models\MarketingCampaign;
use App\Models\MarketingCampaignSend;
use App\Models\MarketingContact;
use App\Models\MarketingList;
use App\Models\User;
use App\Support\Marketing\BroadcastMarketingCampaignProgress;
use Database\Seeders\RoleUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Queue\Attributes\DebounceFor;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;

uses(RefreshDatabase::class);

test('commercial can create email campaign', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $list = MarketingList::factory()->create();

    $response = $this->actingAs($commercial)->post(route('marketing-campaigns.store'), [
        'name' => 'Relance printemps',
        'channel' => 'email',
        'marketing_list_id' => $list->id,
        'subject' => 'Bonjour {{prenom}}',
        'body' => 'Message de campagne pour {{nom}}.',
    ]);

    $response->assertRedirect();

    $campaign = MarketingCampaign::query()->where('name', 'Relance printemps')->firstOrFail();

    expect($campaign->status)->toBe(MarketingCampaignStatus::Draft)
        ->and($campaign->subject)->toBe('Bonjour {{prenom}}');
});

test('contributor without marketing campaigns permission cannot access campaigns', function () {
    $this->seed(RoleUserSeeder::class);

    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();

    $this->actingAs($user)
        ->get(route('marketing-campaigns.index'))
        ->assertForbidden();
});

test('launching campaign queues sends for consented contacts with email', function () {
    Queue::fake();
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $list = MarketingList::factory()->create();

    $eligible = MarketingContact::factory()->create([
        'email' => 'eligible@example.com',
        'marketing_consent' => true,
    ]);

    $noConsent = MarketingContact::factory()->create([
        'email' => 'noconsent@example.com',
        'marketing_consent' => false,
    ]);

    $list->contacts()->attach([$eligible->id, $noConsent->id]);

    $campaign = MarketingCampaign::factory()->create([
        'marketing_list_id' => $list->id,
        'status' => MarketingCampaignStatus::Draft,
    ]);

    $this->actingAs($commercial)
        ->post(route('marketing-campaigns.launch', $campaign))
        ->assertRedirect(route('marketing-campaigns.show', $campaign));

    $campaign->refresh();

    expect($campaign->status)->toBeIn([
        MarketingCampaignStatus::Sending,
        MarketingCampaignStatus::Completed,
    ])
        ->and($campaign->launched_at)->not->toBeNull()
        ->and(MarketingCampaignSend::query()->count())->toBe(1);

    Queue::assertPushed(SendMarketingCampaignEmailJob::class, 1);
});

test('launch fails when no eligible contacts in list', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $list = MarketingList::factory()->create();

    $contact = MarketingContact::factory()->create([
        'email' => null,
        'phone' => null,
        'is_company' => false,
        'company_contacts' => null,
        'marketing_consent' => true,
    ]);

    $list->contacts()->attach($contact);

    $campaign = MarketingCampaign::factory()->create([
        'marketing_list_id' => $list->id,
        'status' => MarketingCampaignStatus::Draft,
    ]);

    $this->actingAs($commercial)
        ->post(route('marketing-campaigns.launch', $campaign))
        ->assertSessionHasErrors('marketing_list_id');
});

test('send job marks campaign email as received', function () {
    Mail::fake();
    Queue::fake();
    $this->seed(RoleUserSeeder::class);

    $send = MarketingCampaignSend::factory()->create([
        'status' => MarketingCampaignSendStatus::Queued,
    ]);

    (new SendMarketingCampaignEmailJob($send))->handle();

    $send->refresh();

    expect($send->status)->toBe(MarketingCampaignSendStatus::Received)
        ->and($send->sent_at)->not->toBeNull()
        ->and($send->delivered_at)->not->toBeNull();

    Mail::assertSent(MarketingCampaignMailable::class, function (MarketingCampaignMailable $mail) use ($send) {
        return $mail->send->is($send);
    });

    Queue::assertPushed(SyncMarketingCampaignCompletionJob::class);
});

test('sync marketing campaign completion job is debounced', function () {
    $job = new SyncMarketingCampaignCompletionJob(MarketingCampaign::factory()->make(['id' => 42]));

    $reflection = new ReflectionClass($job);
    $attributes = $reflection->getAttributes(DebounceFor::class);

    expect($attributes)->not->toBeEmpty()
        ->and($job->debounceId())->toBe('42');
});

test('open pixel marks received send as read', function () {
    $send = MarketingCampaignSend::factory()->received()->create();

    $this->get(route('marketing-campaigns.open', $send->open_token))
        ->assertSuccessful()
        ->assertHeader('Content-Type', 'image/gif');

    $send->refresh();

    expect($send->status)->toBe(MarketingCampaignSendStatus::Read)
        ->and($send->read_at)->not->toBeNull();
});

test('campaign stats expose received count separately from read', function () {
    $campaign = MarketingCampaign::factory()->launched()->create();

    MarketingCampaignSend::factory()->received()->create([
        'marketing_campaign_id' => $campaign->id,
    ]);

    MarketingCampaignSend::factory()->received()->create([
        'marketing_campaign_id' => $campaign->id,
        'status' => MarketingCampaignSendStatus::Read,
        'read_at' => now(),
    ]);

    $stats = $campaign->fresh()->sendStats();

    expect($stats['received'])->toBe(1)
        ->and($stats['read'])->toBe(1);
});

test('cannot update launched campaign', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $campaign = MarketingCampaign::factory()->launched()->create();

    $this->actingAs($commercial)
        ->put(route('marketing-campaigns.update', $campaign), [
            'name' => 'Nouveau nom',
            'marketing_list_id' => $campaign->marketing_list_id,
            'subject' => $campaign->subject,
            'body' => $campaign->body,
        ])
        ->assertForbidden();
});

test('commercial can view campaign show page with stats', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $campaign = MarketingCampaign::factory()->create();

    $this->actingAs($commercial)
        ->get(route('marketing-campaigns.show', $campaign))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('campaign.name')
            ->has('campaign.stats')
            ->where('broadcasting.enabled', false));
});

test('broadcast progress is skipped when broadcasting driver is log', function () {
    config(['broadcasting.default' => 'log']);

    Event::fake([MarketingCampaignProgressUpdated::class]);

    $campaign = MarketingCampaign::factory()->create();

    BroadcastMarketingCampaignProgress::dispatch($campaign);

    Event::assertNotDispatched(MarketingCampaignProgressUpdated::class);
});

test('broadcast progress dispatches event when reverb is configured', function () {
    config(['broadcasting.default' => 'reverb']);

    Event::fake([MarketingCampaignProgressUpdated::class]);

    $campaign = MarketingCampaign::factory()->create();
    $send = MarketingCampaignSend::factory()->create([
        'marketing_campaign_id' => $campaign->id,
    ]);

    BroadcastMarketingCampaignProgress::dispatch($campaign, $send);

    Event::assertDispatched(MarketingCampaignProgressUpdated::class, function (MarketingCampaignProgressUpdated $event) use ($campaign, $send) {
        return $event->campaign->is($campaign)
            && $event->send?->is($send);
    });
});

test('broadcast progress logs warning when reverb server is unreachable', function () {
    config([
        'broadcasting.default' => 'reverb',
        'broadcasting.connections.reverb.key' => 'test-key',
        'broadcasting.connections.reverb.secret' => 'test-secret',
        'broadcasting.connections.reverb.app_id' => 'test-app',
        'broadcasting.connections.reverb.options.host' => '127.0.0.1',
        'broadcasting.connections.reverb.options.port' => 1,
        'broadcasting.connections.reverb.options.scheme' => 'http',
        'broadcasting.connections.reverb.options.useTLS' => false,
    ]);

    Log::spy();

    $campaign = MarketingCampaign::factory()->create();

    BroadcastMarketingCampaignProgress::dispatch($campaign);

    Log::shouldHaveReceived('warning')
        ->once()
        ->withArgs(function (string $message, array $context) use ($campaign): bool {
            return $message === 'Marketing campaign broadcast failed.'
                && $context['campaign_uuid'] === $campaign->uuid;
        });
});

test('send job broadcasts campaign progress when reverb is configured', function () {
    config(['broadcasting.default' => 'reverb']);

    Mail::fake();
    Queue::fake();
    Event::fake([MarketingCampaignProgressUpdated::class]);

    $send = MarketingCampaignSend::factory()->create([
        'status' => MarketingCampaignSendStatus::Queued,
    ]);

    (new SendMarketingCampaignEmailJob($send))->handle();

    Event::assertDispatched(MarketingCampaignProgressUpdated::class);
});

test('open pixel broadcasts read progress when reverb is configured', function () {
    config(['broadcasting.default' => 'reverb']);

    Event::fake([MarketingCampaignProgressUpdated::class]);

    $send = MarketingCampaignSend::factory()->received()->create();

    $this->get(route('marketing-campaigns.open', $send->open_token))
        ->assertSuccessful();

    Event::assertDispatched(MarketingCampaignProgressUpdated::class);
});

test('commercial can access marketing campaign broadcast channel via policy', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $campaign = MarketingCampaign::factory()->create();

    expect($commercial->can('view', $campaign))->toBeTrue();
});

test('contributor without marketing campaigns permission cannot access broadcast channel', function () {
    $this->seed(RoleUserSeeder::class);

    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();
    $campaign = MarketingCampaign::factory()->create();

    expect($user->can('view', $campaign))->toBeFalse();
});

test('commercial can preview list audience for campaign form', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $list = MarketingList::factory()->create();

    $eligible = MarketingContact::factory()->create([
        'email' => 'eligible@example.com',
        'marketing_consent' => true,
    ]);

    $ineligible = MarketingContact::factory()->create([
        'email' => null,
        'phone' => null,
        'is_company' => false,
        'company_contacts' => null,
        'marketing_consent' => true,
    ]);

    $list->contacts()->attach([$eligible->id, $ineligible->id]);

    $this->actingAs($commercial)
        ->getJson(route('marketing-campaigns.list-audience', $list))
        ->assertOk()
        ->assertJsonPath('stats.total', 2)
        ->assertJsonPath('stats.eligible', 1)
        ->assertJsonPath('stats.ineligible', 1)
        ->assertJsonCount(2, 'contacts');
});
