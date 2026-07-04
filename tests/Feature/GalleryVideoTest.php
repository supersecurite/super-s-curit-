<?php

use App\Enums\ServiceId;
use App\Models\GalleryVideo;
use App\Models\User;
use App\Support\YoutubeUrl;
use Database\Seeders\GalleryVideoSeeder;
use Database\Seeders\RoleUserSeeder;
use Database\Seeders\SyncGalleryVideosSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('admin can create gallery video with youtube url', function () {
    $this->seed(RoleUserSeeder::class);

    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();

    $response = $this->actingAs($admin)->post(route('gallery-videos.store'), [
        'service_id' => ServiceId::Entreprise->value,
        'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'title' => 'Vidéo test entreprise',
        'description' => 'Description de test',
        'sort_order' => 3,
        'is_published' => '1',
    ]);

    $response->assertRedirect(route('gallery-videos.index'));

    $video = GalleryVideo::query()->where('title', 'Vidéo test entreprise')->first();

    expect($video)->not->toBeNull()
        ->and($video->service_id)->toBe(ServiceId::Entreprise)
        ->and($video->youtube_id)->toBe('dQw4w9WgXcQ')
        ->and($video->is_published)->toBeTrue()
        ->and($video->thumbnail_url)->toBe('https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
});

test('non admin cannot create gallery video', function () {
    $this->seed(RoleUserSeeder::class);

    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();

    $this->actingAs($user)
        ->post(route('gallery-videos.store'), [
            'service_id' => ServiceId::Entreprise->value,
            'youtube_url' => 'https://youtu.be/dQw4w9WgXcQ',
            'title' => 'Refusée',
        ])
        ->assertForbidden();
});

test('gallery video store rejects invalid youtube url', function () {
    $this->seed(RoleUserSeeder::class);

    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();

    $this->actingAs($admin)
        ->post(route('gallery-videos.store'), [
            'service_id' => 'general',
            'youtube_url' => 'https://example.com/not-youtube',
            'title' => 'Invalide',
        ])
        ->assertSessionHasErrors('youtube_url');
});

test('admin can create general gallery video', function () {
    $this->seed(RoleUserSeeder::class);

    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();

    $response = $this->actingAs($admin)->post(route('gallery-videos.store'), [
        'service_id' => 'general',
        'youtube_url' => 'https://youtu.be/jNQXAC9IVRw',
        'title' => 'Vidéo galerie générale',
        'sort_order' => 1,
        'is_published' => '1',
    ]);

    $response->assertRedirect(route('gallery-videos.index'));

    $video = GalleryVideo::query()->where('title', 'Vidéo galerie générale')->first();

    expect($video)->not->toBeNull()
        ->and($video->service_id)->toBeNull()
        ->and($video->youtube_id)->toBe('jNQXAC9IVRw');
});

test('gallery video seeder creates published videos', function () {
    $this->seed(GalleryVideoSeeder::class);

    expect(GalleryVideo::query()->count())->toBeGreaterThanOrEqual(4)
        ->and(GalleryVideo::query()->published()->count())->toBe(4)
        ->and(GalleryVideo::query()->published()->general()->count())->toBe(4);
});

test('sync gallery videos seeder updates urls without wiping database', function () {
    GalleryVideo::factory()->create([
        'sort_order' => 99,
        'title' => 'Ancienne vidéo',
        'is_published' => true,
    ]);

    $this->seed(SyncGalleryVideosSeeder::class);

    expect(GalleryVideo::query()->where('sort_order', 99)->first()?->is_published)->toBeFalse()
        ->and(GalleryVideo::query()->published()->count())->toBe(4)
        ->and(GalleryVideo::query()->published()->where('sort_order', 1)->first()?->youtube_id)->toBe('gQp4od9l7U8');
});

test('youtube url parser accepts common formats', function () {
    expect(YoutubeUrl::parseId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'))->toBe('dQw4w9WgXcQ')
        ->and(YoutubeUrl::parseId('https://youtu.be/dQw4w9WgXcQ'))->toBe('dQw4w9WgXcQ')
        ->and(YoutubeUrl::parseId('https://www.youtube.com/embed/dQw4w9WgXcQ'))->toBe('dQw4w9WgXcQ')
        ->and(YoutubeUrl::parseId('https://www.youtube.com/shorts/dQw4w9WgXcQ'))->toBe('dQw4w9WgXcQ')
        ->and(YoutubeUrl::parseId('https://youtube.com/shorts/gQp4od9l7U8?si=4ZxBhBrcS1kY1t11'))->toBe('gQp4od9l7U8')
        ->and(YoutubeUrl::parseId('https://www.youtube.com/watch?v=pHDNrHLb1P4'))->toBe('pHDNrHLb1P4');
});

test('youtube embed uses nocookie domain and detects shorts', function () {
    expect(YoutubeUrl::isShort('https://youtube.com/shorts/gQp4od9l7U8'))->toBeTrue()
        ->and(YoutubeUrl::isShort('https://www.youtube.com/watch?v=pHDNrHLb1P4'))->toBeFalse();

    $shortEmbed = YoutubeUrl::embedUrl('gQp4od9l7U8', false, true);
    $watchEmbed = YoutubeUrl::embedUrl('pHDNrHLb1P4');

    expect($shortEmbed)->toStartWith('https://www.youtube-nocookie.com/embed/gQp4od9l7U8')
        ->and($shortEmbed)->toContain('playlist=gQp4od9l7U8')
        ->and($watchEmbed)->toStartWith('https://www.youtube-nocookie.com/embed/pHDNrHLb1P4');
});

test('about page displays configured youtube video', function () {
    $this->get(route('about'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/about')
            ->where('featuredVideo.youtube_id', 'pHDNrHLb1P4')
            ->where('featuredVideo.is_short', false)
            ->where('featuredVideo.embed_url', fn ($url) => str_contains($url, 'youtube-nocookie.com/embed/pHDNrHLb1P4'))
        );
});

test('public gallery page includes published videos from database', function () {
    $this->seed(GalleryVideoSeeder::class);

    GalleryVideo::factory()->unpublished()->create([
        'title' => 'Vidéo non publiée',
    ]);

    $this->get(route('galerie.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/gallery/index')
            ->has('videos', 4)
            ->where('videos.0.youtube_id', fn ($id) => is_string($id) && strlen($id) === 11)
            ->where('countsVideosByService.general', 4)
        );
});

test('gallery page can filter videos by service', function () {
    GalleryVideo::factory()->create([
        'service_id' => ServiceId::Chantiers,
        'title' => 'Vidéo chantier',
        'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    ]);

    GalleryVideo::factory()->general()->create([
        'title' => 'Vidéo générale',
        'youtube_url' => 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    ]);

    $this->get(route('galerie.index', ['service' => ServiceId::Chantiers->value]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('videos', 1)
            ->where('videos.0.title', 'Vidéo chantier')
        );
});
