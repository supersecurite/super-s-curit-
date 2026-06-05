<?php

use App\Enums\ArticleStatus;
use App\Models\SecurityTip;
use App\Seo\SitemapEntries;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('public can view published security tips index', function () {
    SecurityTip::factory()->count(2)->create();
    SecurityTip::factory()->draft()->create();
    SecurityTip::factory()->pendingApproval()->create();

    $this->get(route('conseils-securite.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/conseils-securite/index')
            ->has('securityTips.data', 2)
        );
});

test('public can view a published security tip', function () {
    $securityTip = SecurityTip::factory()->create([
        'title' => 'Conseil public test',
        'views' => 0,
    ]);

    $this->get(route('conseils-securite.show', $securityTip->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/conseils-securite/show')
            ->where('securityTip.slug', $securityTip->slug)
            ->has('securityTipContent')
        );

    expect($securityTip->fresh()->views)->toBe(1);
});

test('draft security tips are not accessible publicly', function () {
    $securityTip = SecurityTip::factory()->draft()->create();

    $this->get(route('conseils-securite.show', $securityTip->slug))
        ->assertNotFound();
});

test('pending approval security tips are not accessible publicly', function () {
    $securityTip = SecurityTip::factory()->pendingApproval()->create();

    $this->get(route('conseils-securite.show', $securityTip->slug))
        ->assertNotFound();
});

test('rejected security tips are not accessible publicly', function () {
    $securityTip = SecurityTip::factory()->rejected()->create();

    $this->get(route('conseils-securite.show', $securityTip->slug))
        ->assertNotFound();
});

test('conseils securite page has seo metadata configured', function () {
    $this->get(route('conseils-securite.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('pageMeta.path', '/conseils-securite')
            ->where('pageMeta.title', fn ($title) => str_contains($title, 'Conseils'))
        );
});

test('only published security tips appear in sitemap entries', function () {
    $published = SecurityTip::factory()->create([
        'title' => 'Conseil pour sitemap',
        'status' => ArticleStatus::Published,
    ]);
    SecurityTip::factory()->pendingApproval()->create();

    $entries = SitemapEntries::all();
    $paths = collect($entries)->pluck('path')->all();

    expect($paths)->toContain('/conseils-securite/'.$published->slug);
});

test('homepage shares featured security tips', function () {
    SecurityTip::factory()->count(2)->featured()->published()->create();
    SecurityTip::factory()->featured()->pendingApproval()->create();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('featuredSecurityTips', 2)
        );
});
