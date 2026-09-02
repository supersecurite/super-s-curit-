<?php

use App\Models\MarketingCampaign;
use App\Models\MarketingCampaignSend;
use App\Models\MarketingContact;
use App\Models\MarketingEmailAccount;
use App\Models\MarketingList;
use App\Models\MarketingMessageTemplate;
use App\Models\User;
use App\Models\WhatsAppAccount;
use Database\Seeders\RoleUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleUserSeeder::class);
});

test('marketing purge is refused outside local environment', function () {
    expect(app()->isLocal())->toBeFalse();

    $this->artisan('marketing:purge', [
        'email' => 'super_admin@supersecurite.com',
        '--force' => true,
    ])->assertFailed();
});

test('marketing purge is refused for non super admin even in local', function () {
    $this->app['env'] = 'local';

    $this->artisan('marketing:purge', [
        'email' => 'commercial@supersecurite.com',
        '--force' => true,
    ])->assertFailed();
});

test('super admin can purge marketing data but keep accounts in local', function () {
    $this->app['env'] = 'local';

    $emailAccount = MarketingEmailAccount::factory()->create();
    $whatsappAccount = WhatsAppAccount::factory()->create();
    $list = MarketingList::factory()->create();
    $contact = MarketingContact::factory()->create();
    $list->contacts()->attach($contact);
    $template = MarketingMessageTemplate::factory()->create();
    $campaign = MarketingCampaign::factory()->create([
        'marketing_list_id' => $list->id,
        'marketing_message_template_id' => $template->id,
        'marketing_email_account_id' => $emailAccount->id,
    ]);
    MarketingCampaignSend::factory()->create([
        'marketing_campaign_id' => $campaign->id,
        'marketing_contact_id' => $contact->id,
    ]);

    $this->artisan('marketing:purge', [
        'email' => 'super_admin@supersecurite.com',
        '--force' => true,
    ])->assertSuccessful();

    expect(MarketingCampaignSend::query()->count())->toBe(0)
        ->and(MarketingCampaign::withTrashed()->count())->toBe(0)
        ->and(MarketingContact::withTrashed()->count())->toBe(0)
        ->and(MarketingList::withTrashed()->count())->toBe(0)
        ->and(MarketingMessageTemplate::withTrashed()->count())->toBe(0)
        ->and(MarketingEmailAccount::query()->whereKey($emailAccount->id)->exists())->toBeTrue()
        ->and(WhatsAppAccount::query()->whereKey($whatsappAccount->id)->exists())->toBeTrue()
        ->and(User::query()->count())->toBeGreaterThan(0);
});
