<?php

use App\Models\Article;
use App\Models\SecurityTip;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('article public array exposes correct image url for public assets', function () {
    $article = Article::factory()->create([
        'image' => '/images/super-securite/pages/actualites.jpg',
    ]);

    $payload = $article->toPublicArray();

    expect($payload['image_url'])->toBe('/images/super-securite/pages/actualites.jpg')
        ->and($payload['image_source'])->toBe('public');
});

test('security tip public array exposes correct image url for storage uploads', function () {
    $securityTip = SecurityTip::factory()->create([
        'image' => 'security-tips/images/conseil.jpg',
    ]);

    $payload = $securityTip->toPublicArray();

    expect($payload['image_url'])->toBe('/storage/security-tips/images/conseil.jpg')
        ->and($payload['image_source'])->toBe('storage');
});

test('public article page receives resolved public asset image url', function () {
    $article = Article::factory()->create([
        'title' => 'Article image publique',
        'image' => '/images/super-securite/pages/actualites.jpg',
    ]);

    $this->get(route('actualites.show', $article->slug))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('article.image_url', '/images/super-securite/pages/actualites.jpg')
            ->where('article.image_source', 'public')
        );
});

test('public security tip page receives resolved storage image url', function () {
    $securityTip = SecurityTip::factory()->create([
        'title' => 'Conseil image storage',
        'image' => 'security-tips/images/conseil.jpg',
    ]);

    $this->get(route('conseils-securite.show', $securityTip->slug))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('securityTip.image_url', '/storage/security-tips/images/conseil.jpg')
            ->where('securityTip.image_source', 'storage')
        );
});
