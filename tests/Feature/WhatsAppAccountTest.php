<?php

use App\Models\User;
use App\Models\WhatsAppAccount;
use Database\Seeders\RoleUserSeeder;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->seed(RoleUserSeeder::class);
});

test('commercial can list whatsapp accounts', function () {
    WhatsAppAccount::factory()->count(2)->create();
    $user = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    actingAs($user)
        ->get(route('marketing-whatsapp-accounts.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('marketing-whatsapp-accounts/index')
            ->has('accounts', 2));
});
