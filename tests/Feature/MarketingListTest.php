<?php

use App\Models\MarketingContact;
use App\Models\MarketingList;
use App\Models\User;
use Database\Seeders\RoleUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('commercial can create marketing list and attach contact', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $contact = MarketingContact::factory()->create();

    $createResponse = $this->actingAs($commercial)->post(route('marketing-lists.store'), [
        'name' => 'Clients VIP',
        'description' => 'Audience premium',
    ]);

    $list = MarketingList::query()->where('name', 'Clients VIP')->firstOrFail();

    $createResponse->assertRedirect(route('marketing-lists.show', $list));

    $attachResponse = $this->actingAs($commercial)->post(route('marketing-lists.contacts.attach', $list), [
        'contact_uuid' => $contact->uuid,
    ]);

    $attachResponse->assertRedirect(route('marketing-lists.show', $list));

    expect($list->contacts()->count())->toBe(1)
        ->and($list->contacts()->first()?->is($contact))->toBeTrue();
});

test('commercial can detach contact from list', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $list = MarketingList::factory()->create();
    $contact = MarketingContact::factory()->create();
    $list->contacts()->attach($contact);

    $this->actingAs($commercial)
        ->delete(route('marketing-lists.contacts.detach', [$list, $contact]))
        ->assertRedirect(route('marketing-lists.show', $list));

    expect($list->fresh()->contacts()->count())->toBe(0);
});

test('contributor without marketing permission cannot manage lists', function () {
    $this->seed(RoleUserSeeder::class);

    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();

    $this->actingAs($user)
        ->get(route('marketing-lists.index'))
        ->assertForbidden();
});
