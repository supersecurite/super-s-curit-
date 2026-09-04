<?php

use App\Enums\MarketingCampaignStatus;
use App\Jobs\SendMarketingCampaignEmailJob;
use App\Models\MarketingCampaign;
use App\Models\MarketingContact;
use App\Models\MarketingEmailAccount;
use App\Models\MarketingList;
use App\Models\MarketingMessageTemplate;
use App\Models\User;
use Database\Seeders\RoleUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Queue;

uses(RefreshDatabase::class);

test('commercial can schedule a campaign launch', function () {
    Queue::fake();
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $list = MarketingList::factory()->create();
    $contact = MarketingContact::factory()->create([
        'email' => 'scheduled@example.com',
        'marketing_consent' => true,
    ]);
    $list->contacts()->attach($contact);

    $campaign = MarketingCampaign::factory()->create([
        'marketing_list_id' => $list->id,
        'status' => MarketingCampaignStatus::Draft,
    ]);

    $scheduledAt = now()->addHours(2)->seconds(0);

    $this->actingAs($commercial)
        ->post(route('marketing-campaigns.launch', $campaign), [
            'scheduled_at' => $scheduledAt->toIso8601String(),
        ])
        ->assertRedirect(route('marketing-campaigns.show', $campaign));

    $campaign->refresh();

    expect($campaign->status)->toBe(MarketingCampaignStatus::Scheduled)
        ->and($campaign->scheduled_at)->not->toBeNull()
        ->and($campaign->scheduled_at?->timestamp)->toBe($scheduledAt->timestamp)
        ->and($campaign->launched_at)->toBeNull();

    Queue::assertNothingPushed();
});

test('scheduled campaigns are dispatched when due', function () {
    Queue::fake();
    $this->seed(RoleUserSeeder::class);

    $list = MarketingList::factory()->create();
    $contact = MarketingContact::factory()->create([
        'email' => 'due@example.com',
        'marketing_consent' => true,
    ]);
    $list->contacts()->attach($contact);

    $campaign = MarketingCampaign::factory()->create([
        'marketing_list_id' => $list->id,
        'status' => MarketingCampaignStatus::Scheduled,
        'scheduled_at' => now()->subMinute(),
    ]);

    Artisan::call('marketing:dispatch-scheduled-campaigns');

    $campaign->refresh();

    expect($campaign->status)->toBe(MarketingCampaignStatus::Sending)
        ->and($campaign->launched_at)->not->toBeNull()
        ->and($campaign->scheduled_at)->toBeNull();

    Queue::assertPushed(SendMarketingCampaignEmailJob::class, 1);
});

test('email campaign requires a template', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $list = MarketingList::factory()->create();
    $emailAccount = MarketingEmailAccount::factory()->default()->create();

    $this->actingAs($commercial)
        ->post(route('marketing-campaigns.store'), [
            'name' => 'Sans template',
            'channel' => 'email',
            'list_uuids' => [$list->uuid],
            'contact_uuids' => [],
            'marketing_email_account_id' => $emailAccount->id,
            'subject' => 'Objet',
            'body' => 'Corps',
        ])
        ->assertSessionHasErrors('marketing_message_template_id');
});

test('email campaign can be created from an existing template', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $list = MarketingList::factory()->create();
    $emailAccount = MarketingEmailAccount::factory()->default()->create();
    $template = MarketingMessageTemplate::factory()->create([
        'subject' => 'Bonjour {{prenom}}',
        'body' => 'Message template.',
    ]);

    $this->actingAs($commercial)
        ->post(route('marketing-campaigns.store'), [
            'name' => 'Avec template',
            'channel' => 'email',
            'list_uuids' => [$list->uuid],
            'contact_uuids' => [],
            'marketing_email_account_id' => $emailAccount->id,
            'marketing_message_template_id' => $template->id,
            'subject' => 'Objet modifié',
            'body' => 'Corps modifié avant validation.',
        ])
        ->assertRedirect();

    $campaign = MarketingCampaign::query()->where('name', 'Avec template')->firstOrFail();

    expect($campaign->marketing_message_template_id)->toBe($template->id)
        ->and($campaign->subject)->toBe('Objet modifié')
        ->and($campaign->body)->toBe('Corps modifié avant validation.');
});
