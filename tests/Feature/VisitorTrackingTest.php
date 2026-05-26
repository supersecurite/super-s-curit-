<?php

use App\Models\User;
use App\Models\Visit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('home page visit is recorded', function () {
    $this->get('/');

    expect(Visit::query()->where('path', '/')->count())->toBe(1);
});

test('bots are flagged but still recorded', function () {
    $this->withHeaders([
        'User-Agent' => 'Googlebot/2.1 (+http://www.google.com/bot.html)',
    ])->get('/');

    expect(Visit::query()->where('is_bot', true)->count())->toBeGreaterThan(0);
});

test('sitemap and robots are not tracked', function () {
    $this->get('/sitemap.xml');
    $this->get('/robots.txt');

    expect(Visit::query()->count())->toBe(0);
});

test('guest cannot access analytics', function () {
    $this->get(route('analytics.index'))->assertRedirect(route('login'));
});

test('regular user cannot access analytics', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('analytics.index'))
        ->assertForbidden();
});

test('admin can access analytics dashboard', function () {
    $admin = User::factory()->admin()->create();

    Visit::factory()->count(5)->create(['is_bot' => false]);

    $this->actingAs($admin)
        ->get(route('analytics.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('analytics/index')
            ->has('kpis')
            ->has('chartData')
            ->has('topPages')
            ->has('countries')
        );
});

test('analytics includes country breakdown', function () {
    $admin = User::factory()->admin()->create();

    Visit::factory()->create([
        'is_bot' => false,
        'country_code' => 'GN',
        'country' => 'Guinée',
    ]);
    Visit::factory()->count(2)->create([
        'is_bot' => false,
        'country_code' => 'FR',
        'country' => 'France',
    ]);

    $this->actingAs($admin)
        ->get(route('analytics.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('countries.0.country_code', 'FR')
            ->where('countries.0.views', 2)
            ->where('countries.1.country_code', 'GN')
        );
});

test('login page is not tracked', function () {
    $this->get('/login');

    expect(Visit::query()->count())->toBe(0);
});

test('geoip resolves country from cloudflare header', function () {
    $this->withHeaders(['CF-IPCountry' => 'GN'])->get('/');

    $visit = Visit::query()->first();

    expect($visit)->not->toBeNull()
        ->and($visit->country_code)->toBe('GN')
        ->and($visit->country)->not->toBeEmpty();
});

test('duration endpoint updates visit', function () {
    $visit = Visit::factory()->create([
        'path' => '/test',
        'is_bounce' => true,
        'duration_seconds' => null,
    ]);

    $this->postJson(route('analytics.duration'), [
        'session_id' => $visit->session_id,
        'path' => '/test',
        'duration' => 120,
    ])->assertOk()->assertJson(['ok' => true]);

    expect($visit->fresh()->duration_seconds)->toBe(120)
        ->and($visit->fresh()->is_bounce)->toBeFalse();
});
