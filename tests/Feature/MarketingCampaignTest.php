<?php

use App\Enums\MarketingCampaignSendStatus;
use App\Enums\MarketingCampaignStatus;
use App\Jobs\SendMarketingCampaignEmailJob;
use App\Jobs\SyncMarketingCampaignCompletionJob;
use App\Mail\MarketingCampaignMailable;
use App\Models\MarketingCampaign;
use App\Models\MarketingCampaignSend;
use App\Models\MarketingContact;
use App\Models\MarketingList;
use App\Models\User;
use Database\Seeders\RoleUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Queue\Attributes\DebounceFor;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;

uses(RefreshDatabase::class);

test('commercial can create email campaign', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $list = MarketingList::factory()->create();

    $response = $this->actingAs($commercial)->post(route('marketing-campaigns.store'), [
        'name' => 'Relance printemps',
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

test('send job marks campaign email as delivered', function () {
    Mail::fake();
    Queue::fake();
    $this->seed(RoleUserSeeder::class);

    $send = MarketingCampaignSend::factory()->create([
        'status' => MarketingCampaignSendStatus::Queued,
    ]);

    (new SendMarketingCampaignEmailJob($send))->handle();

    $send->refresh();

    expect($send->status)->toBe(MarketingCampaignSendStatus::Delivered)
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

test('open pixel marks delivered send as read', function () {
    $send = MarketingCampaignSend::factory()->delivered()->create();

    $this->get(route('marketing-campaigns.open', $send->open_token))
        ->assertSuccessful()
        ->assertHeader('Content-Type', 'image/gif');

    $send->refresh();

    expect($send->status)->toBe(MarketingCampaignSendStatus::Read)
        ->and($send->read_at)->not->toBeNull();
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
            ->has('campaign.stats'));
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
