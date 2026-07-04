<?php

use App\Enums\ServiceId;
use App\Models\GalleryImage;
use App\Models\GalleryVideo;
use Database\Seeders\GalleryImageSeeder;
use Database\Seeders\SyncGalleryVideosSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('public can view gallery page with all published images', function () {
    $this->seed(GalleryImageSeeder::class);

    $this->get(route('galerie.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/gallery/index')
            ->has('images', 36)
            ->has('services', 4)
            ->where('countsByService.general', 9)
        );
});

test('gallery page can filter general images only', function () {
    $this->seed(GalleryImageSeeder::class);

    $this->get(route('galerie.index', ['service' => 'general']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('images', 9)
            ->where('filters.service', 'general')
            ->where('images.0.service_label', 'Galerie générale')
            ->where('images.0.service_path', null)
        );
});

test('gallery page can filter images by service', function () {
    $this->seed(GalleryImageSeeder::class);

    $this->get(route('galerie.index', ['service' => ServiceId::Chantiers->value]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('images', 6)
            ->where('filters.service', ServiceId::Chantiers->value)
        );
});

test('service page receives gallery images from database', function () {
    GalleryImage::factory()->count(2)->create([
        'service_id' => ServiceId::Entreprise,
        'is_published' => true,
    ]);

    GalleryImage::factory()->unpublished()->create([
        'service_id' => ServiceId::Entreprise,
    ]);

    GalleryImage::factory()->create([
        'service_id' => ServiceId::Residence,
        'is_published' => true,
    ]);

    GalleryImage::factory()->general()->create([
        'is_published' => true,
    ]);

    GalleryVideo::factory()->count(2)->create([
        'service_id' => ServiceId::Entreprise,
        'is_published' => true,
    ]);

    GalleryVideo::factory()->general()->count(2)->create([
        'is_published' => true,
    ]);

    $this->get(route('services.entreprise'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/service-page')
            ->where('serviceId', 'entreprise')
            ->has('galleryImages', 2)
            ->has('galleryVideos', 4)
        );
});

test('service page includes general gallery videos for all services', function () {
    $this->seed(SyncGalleryVideosSeeder::class);

    $this->get(route('services.chantiers'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/service-page')
            ->where('serviceId', 'chantiers')
            ->has('galleryVideos', 4)
            ->where('galleryVideos.0.youtube_id', 'gQp4od9l7U8')
        );
});

test('service page receives at most 12 gallery images from database', function () {
    GalleryImage::factory()->count(15)->create([
        'service_id' => ServiceId::Entreprise,
        'is_published' => true,
    ]);

    $this->get(route('services.entreprise'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/service-page')
            ->where('serviceId', 'entreprise')
            ->has('galleryImages', 12)
        );
});

test('gallery page seo metadata is configured', function () {
    $this->get(route('galerie.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('pageMeta.path', '/galerie')
            ->where('pageMeta.title', fn ($title) => str_contains($title, 'Galerie'))
        );
});
