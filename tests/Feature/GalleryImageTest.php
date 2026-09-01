<?php

use App\Enums\ServiceId;
use App\Models\GalleryImage;
use App\Models\User;
use Database\Seeders\GalleryImageSeeder;
use Database\Seeders\RoleUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;

uses(RefreshDatabase::class);

test('admin can create gallery image', function () {
    $this->seed(RoleUserSeeder::class);

    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();

    $response = $this->actingAs($admin)->post(route('gallery-images.store'), [
        'service_id' => ServiceId::Entreprise->value,
        'alt' => 'Test galerie entreprise',
        'caption' => 'Photo de test',
        'sort_order' => 5,
        'is_published' => '1',
        'image' => UploadedFile::fake()->create('gallery.jpg', 100, 'image/jpeg'),
    ]);

    $response->assertRedirect(route('gallery-images.index'));

    $image = GalleryImage::query()->where('alt', 'Test galerie entreprise')->first();

    expect($image)->not->toBeNull()
        ->and($image->service_id)->toBe(ServiceId::Entreprise)
        ->and($image->is_published)->toBeTrue()
        ->and($image->image_url)->toStartWith('/storage/gallery/images/');
});

test('non admin cannot create gallery image', function () {
    $this->seed(RoleUserSeeder::class);

    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();

    $this->actingAs($user)
        ->post(route('gallery-images.store'), [
            'service_id' => ServiceId::Entreprise->value,
            'alt' => 'Refusée',
            'image' => UploadedFile::fake()->create('gallery.jpg', 100, 'image/jpeg'),
        ])
        ->assertForbidden();
});

test('admin can create general gallery image', function () {
    $this->seed(RoleUserSeeder::class);

    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();

    $response = $this->actingAs($admin)->post(route('gallery-images.store'), [
        'service_id' => 'general',
        'alt' => 'Test galerie générale',
        'caption' => 'Photo générale',
        'sort_order' => 1,
        'is_published' => '1',
        'image' => UploadedFile::fake()->create('gallery.jpg', 100, 'image/jpeg'),
    ]);

    $response->assertRedirect(route('gallery-images.index'));

    $image = GalleryImage::query()->where('alt', 'Test galerie générale')->first();

    expect($image)->not->toBeNull()
        ->and($image->service_id)->toBeNull()
        ->and($image->is_published)->toBeTrue();
});

test('gallery image seeder creates published images for all services', function () {
    $this->seed(GalleryImageSeeder::class);

    /** @var list<array<string, mixed>> $expected */
    $expected = require database_path('seeders/data/gallery-images.php');

    expect(GalleryImage::query()->count())->toBe(count($expected))
        ->and(GalleryImage::query()->published()->count())->toBe(count($expected))
        ->and(GalleryImage::query()->published()->general()->count())->toBe(
            count(array_filter($expected, fn (array $image): bool => $image['service_id'] === null)),
        );

    foreach (ServiceId::cases() as $service) {
        expect(
            GalleryImage::query()->published()->forService($service)->count(),
        )->toBe(
            count(array_filter(
                $expected,
                fn (array $image): bool => $image['service_id'] === $service->value,
            )),
        );
    }
});
