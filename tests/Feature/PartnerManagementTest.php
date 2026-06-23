<?php

use App\Models\Partner;
use App\Models\User;
use Database\Seeders\PartnerSeeder;
use Database\Seeders\RoleUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;

uses(RefreshDatabase::class);

test('admin can create partner', function () {
    $this->seed(RoleUserSeeder::class);

    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();

    $response = $this->actingAs($admin)->post(route('partners.store'), [
        'name' => 'Test Partner',
        'logo' => UploadedFile::fake()->create('logo.jpg', 100, 'image/jpeg'),
        'sort_order' => 5,
        'is_published' => '1',
    ]);

    $response->assertRedirect(route('partners.index'));

    $partner = Partner::query()->where('name', 'Test Partner')->first();

    expect($partner)->not->toBeNull()
        ->and($partner->is_published)->toBeTrue()
        ->and($partner->logo_url)->toStartWith('/storage/partners/logos/');
});

test('non admin cannot create partner', function () {
    $this->seed(RoleUserSeeder::class);

    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();

    $this->actingAs($user)
        ->post(route('partners.store'), [
            'name' => 'Refused Partner',
            'logo' => UploadedFile::fake()->create('logo.jpg', 100, 'image/jpeg'),
        ])
        ->assertForbidden();
});

test('partner seeder creates default partners', function () {
    $this->seed(PartnerSeeder::class);

    expect(Partner::query()->count())->toBe(7)
        ->and(Partner::query()->published()->count())->toBe(7);
});
