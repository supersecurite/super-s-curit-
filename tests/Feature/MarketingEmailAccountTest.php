<?php

use App\Enums\MarketingEmailAccountDriver;
use App\Models\MarketingCampaign;
use App\Models\MarketingEmailAccount;
use App\Models\User;
use Database\Seeders\RoleUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleUserSeeder::class);
});

test('commercial can create email account without leaking smtp password', function () {
    $user = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    $this->actingAs($user)
        ->post(route('marketing-email-accounts.store'), [
            'name' => 'Boîte principale',
            'from_address' => 'marketing@example.com',
            'from_name' => 'Super Sécurité',
            'driver' => MarketingEmailAccountDriver::Smtp->value,
            'smtp_host' => 'smtp.example.com',
            'smtp_port' => 587,
            'smtp_encryption' => 'tls',
            'smtp_username' => 'marketing@example.com',
            'smtp_password' => 'secret-smtp-password',
            'daily_send_limit' => 300,
            'is_active' => true,
            'is_default' => true,
        ])
        ->assertRedirect();

    $account = MarketingEmailAccount::query()->where('name', 'Boîte principale')->firstOrFail();

    $this->actingAs($user)
        ->get(route('marketing-email-accounts.edit', $account))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('marketing-email-accounts/edit')
            ->where('account.has_smtp_password', true)
            ->where('account.daily_send_limit', 300)
            ->missing('account.smtp_password'));
});

test('contributor without marketing campaigns permission cannot manage email accounts', function () {
    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();

    $this->actingAs($user)
        ->get(route('marketing-email-accounts.index'))
        ->assertForbidden();
});

test('cannot delete email account linked to a campaign', function () {
    $user = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $account = MarketingEmailAccount::factory()->default()->create();
    MarketingCampaign::factory()->create([
        'marketing_email_account_id' => $account->id,
    ]);

    $this->actingAs($user)
        ->delete(route('marketing-email-accounts.destroy', $account))
        ->assertSessionHasErrors('account');

    expect(MarketingEmailAccount::query()->whereKey($account->id)->exists())->toBeTrue();
});

test('email account remaining quota is respected', function () {
    $account = MarketingEmailAccount::factory()->create([
        'daily_send_limit' => 2,
    ]);

    expect($account->hasRemainingQuotaFor(2))->toBeTrue()
        ->and($account->hasRemainingQuotaFor(3))->toBeFalse();
});
