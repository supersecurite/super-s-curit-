<?php

use App\Models\User;
use App\Models\Visit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
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

test('admin and app pages are not tracked', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $this->actingAs($admin)->get('/dashboard');
    $this->actingAs($admin)->get(route('analytics.index'));
    $this->actingAs($admin)->get(route('users.index'));
    $this->actingAs($admin)->get(route('articles.index'));
    $this->actingAs($admin)->get(route('conseils.index'));
    $this->actingAs($admin)->get(route('gallery-images.index'));
    $this->actingAs($admin)->get(route('gallery-videos.index'));
    $this->actingAs($admin)->get(route('partners.index'));
    $this->actingAs($admin)->get(route('candidatures-agents.index'));
    $this->actingAs($user)->get(route('profile.edit'));

    expect(Visit::query()->count())->toBe(0);
});

test('duration endpoint ignores backoffice paths', function (string $path) {
    $visit = Visit::factory()->create([
        'path' => $path,
        'is_bounce' => true,
        'duration_seconds' => null,
    ]);

    $this->postJson(route('analytics.duration'), [
        'visitor_uuid' => $visit->visitor_uuid,
        'path' => $path,
        'duration' => 120,
    ])->assertOk();

    expect($visit->fresh()->duration_seconds)->toBeNull();
})->with([
    '/dashboard',
    '/articles',
    '/conseils',
    '/gallery-images',
    '/partners',
    '/candidatures-agents',
]);

test('geoip resolves country from cloudflare header', function () {
    $this->withHeaders(['CF-IPCountry' => 'GN'])->get('/');

    $visit = Visit::query()->first();

    expect($visit)->not->toBeNull()
        ->and($visit->country_code)->toBe('GN')
        ->and($visit->country)->not->toBeEmpty();
});

test('geoip resolves city from cloudflare header', function () {
    $this->withHeaders([
        'CF-IPCountry' => 'GN',
        'CF-IPCity' => 'Conakry',
    ])->get('/');

    $visit = Visit::query()->first();

    expect($visit)->not->toBeNull()
        ->and($visit->city)->toBe('Conakry');
});

test('analytics filters by city', function () {
    $admin = User::factory()->admin()->create();

    Visit::factory()->count(3)->create([
        'is_bot' => false,
        'city' => 'Conakry',
        'country_code' => 'GN',
        'country' => 'Guinée',
    ]);
    Visit::factory()->count(2)->create([
        'is_bot' => false,
        'city' => 'Paris',
        'country_code' => 'FR',
        'country' => 'France',
    ]);

    $this->actingAs($admin)
        ->get(route('analytics.index', ['cities' => ['GN:Conakry']]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('kpis.total_views', 3)
            ->where('filters.cities', ['GN:Conakry'])
            ->has('cities')
        );
});

test('analytics includes city breakdown', function () {
    $admin = User::factory()->admin()->create();

    Visit::factory()->count(4)->create([
        'is_bot' => false,
        'city' => 'Conakry',
        'country_code' => 'GN',
        'country' => 'Guinée',
    ]);

    $this->actingAs($admin)
        ->get(route('analytics.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('cities.0.city', 'Conakry')
            ->where('cities.0.views', 4)
            ->has('filterOptions.cities')
        );
});

test('analytics average duration divides by all page views', function () {
    $admin = User::factory()->admin()->create();

    Visit::factory()->create([
        'is_bot' => false,
        'duration_seconds' => 120,
    ]);
    Visit::factory()->create([
        'is_bot' => false,
        'duration_seconds' => null,
    ]);
    Visit::factory()->create([
        'is_bot' => false,
        'duration_seconds' => 60,
    ]);

    $this->actingAs($admin)
        ->get(route('analytics.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('kpis.avg_duration_seconds', 60)
            ->where('kpis.duration_measured_views', 2)
            ->where('kpis.duration_coverage', 66.7)
        );
});

test('duration endpoint keeps the highest reported value', function () {
    $visit = Visit::factory()->create([
        'path' => '/test',
        'duration_seconds' => 30,
    ]);

    $this->postJson(route('analytics.duration'), [
        'visitor_uuid' => $visit->visitor_uuid,
        'path' => '/test',
        'duration' => 20,
    ])->assertOk();

    expect($visit->fresh()->duration_seconds)->toBe(30);

    $this->postJson(route('analytics.duration'), [
        'visitor_uuid' => $visit->visitor_uuid,
        'path' => '/test',
        'duration' => 90,
    ])->assertOk();

    expect($visit->fresh()->duration_seconds)->toBe(90)
        ->and($visit->fresh()->is_bounce)->toBeFalse();
});

test('duration endpoint normalizes path', function () {
    $visit = Visit::factory()->create([
        'path' => '/contact',
        'duration_seconds' => null,
    ]);

    $this->postJson(route('analytics.duration'), [
        'visitor_uuid' => $visit->visitor_uuid,
        'path' => 'contact',
        'duration' => 45,
    ])->assertOk();

    expect($visit->fresh()->duration_seconds)->toBe(45);
});

test('duration endpoint updates visit by visitor uuid', function () {
    $visit = Visit::factory()->create([
        'path' => '/test',
        'is_bounce' => true,
        'duration_seconds' => null,
    ]);

    $this->postJson(route('analytics.duration'), [
        'visitor_uuid' => $visit->visitor_uuid,
        'path' => '/test',
        'duration' => 120,
    ])->assertOk()->assertJson(['ok' => true]);

    expect($visit->fresh()->duration_seconds)->toBe(120)
        ->and($visit->fresh()->is_bounce)->toBeFalse();
});

test('duration endpoint falls back to session id', function () {
    $visit = Visit::factory()->create([
        'path' => '/test',
        'duration_seconds' => null,
    ]);

    $this->postJson(route('analytics.duration'), [
        'session_id' => $visit->session_id,
        'path' => '/test',
        'duration' => 45,
    ])->assertOk();

    expect($visit->fresh()->duration_seconds)->toBe(45);
});

test('duration endpoint targets latest visit when visitor returns to same page', function () {
    $uuid = (string) Str::uuid();

    $first = Visit::factory()->create([
        'visitor_uuid' => $uuid,
        'path' => '/contact',
        'duration_seconds' => 10,
        'created_at' => now()->subMinutes(10),
    ]);

    $second = Visit::factory()->create([
        'visitor_uuid' => $uuid,
        'path' => '/contact',
        'duration_seconds' => null,
        'created_at' => now(),
    ]);

    $this->postJson(route('analytics.duration'), [
        'visitor_uuid' => $uuid,
        'path' => '/contact',
        'duration' => 200,
    ])->assertOk();

    expect($first->fresh()->duration_seconds)->toBe(10)
        ->and($second->fresh()->duration_seconds)->toBe(200);
});

test('analytics filters by page', function () {
    $admin = User::factory()->admin()->create();

    Visit::factory()->count(3)->create(['is_bot' => false, 'path' => '/contact']);
    Visit::factory()->count(5)->create(['is_bot' => false, 'path' => '/a-propos']);

    $this->actingAs($admin)
        ->get(route('analytics.index', ['pages' => ['/contact']]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('kpis.total_views', 3)
            ->where('filters.pages', ['/contact'])
        );
});

test('analytics filters by country', function () {
    $admin = User::factory()->admin()->create();

    Visit::factory()->count(2)->create(['is_bot' => false, 'country_code' => 'FR']);
    Visit::factory()->count(4)->create(['is_bot' => false, 'country_code' => 'GN']);

    $this->actingAs($admin)
        ->get(route('analytics.index', ['countries' => ['FR']]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('kpis.total_views', 2)
            ->where('filters.countries', ['FR'])
        );
});

test('analytics filters by browser and device combined', function () {
    $admin = User::factory()->admin()->create();

    Visit::factory()->create([
        'is_bot' => false,
        'browser' => 'Chrome',
        'device' => 'mobile',
    ]);
    Visit::factory()->count(3)->create([
        'is_bot' => false,
        'browser' => 'Chrome',
        'device' => 'desktop',
    ]);
    Visit::factory()->create([
        'is_bot' => false,
        'browser' => 'Firefox',
        'device' => 'mobile',
    ]);

    $this->actingAs($admin)
        ->get(route('analytics.index', [
            'browsers' => ['Chrome'],
            'devices' => ['desktop'],
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('kpis.total_views', 3)
        );
});

test('analytics includes weekday and hourly distribution', function () {
    $admin = User::factory()->admin()->create();

    Visit::factory()->create([
        'is_bot' => false,
        'created_at' => now()->startOfWeek()->setHour(14),
    ]);
    Visit::factory()->count(3)->create([
        'is_bot' => false,
        'created_at' => now()->startOfWeek()->addDay()->setHour(10),
    ]);

    $this->actingAs($admin)
        ->get(route('analytics.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('weekdayStats', 7)
            ->has('hourlyStats', 24)
            ->where('weekdayStats', fn ($days) => collect($days)->contains('is_peak', true))
            ->where('hourlyStats', fn ($hours) => collect($hours)->contains('is_peak', true))
        );
});

test('weekday stats mark the busiest day as peak', function () {
    $admin = User::factory()->admin()->create();
    $monday = now()->startOfWeek();

    Visit::factory()->count(5)->create([
        'is_bot' => false,
        'created_at' => $monday->copy()->setHour(9),
    ]);
    Visit::factory()->create([
        'is_bot' => false,
        'created_at' => $monday->copy()->addDays(2)->setHour(9),
    ]);

    $this->actingAs($admin)
        ->get(route('analytics.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('weekdayStats.0.label', 'Lundi')
            ->where('weekdayStats.0.views', 5)
            ->where('weekdayStats.0.is_peak', true)
        );
});

test('hourly stats mark the busiest hour as peak', function () {
    $admin = User::factory()->admin()->create();
    $at = now()->startOfWeek()->setHour(15);

    Visit::factory()->count(4)->create([
        'is_bot' => false,
        'created_at' => $at,
    ]);
    Visit::factory()->create([
        'is_bot' => false,
        'created_at' => $at->copy()->setHour(8),
    ]);

    $this->actingAs($admin)
        ->get(route('analytics.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('hourlyStats.15.hour', 15)
            ->where('hourlyStats.15.views', 4)
            ->where('hourlyStats.15.is_peak', true)
        );
});

test('analytics filters by single date', function () {
    $admin = User::factory()->admin()->create();
    $target = now()->subDays(5)->startOfDay()->addHours(12);

    Visit::factory()->count(4)->create([
        'is_bot' => false,
        'created_at' => $target,
    ]);
    Visit::factory()->count(2)->create([
        'is_bot' => false,
        'created_at' => now()->subDays(20),
    ]);

    $this->actingAs($admin)
        ->get(route('analytics.index', ['date' => $target->toDateString()]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('dateFilter.mode', 'single')
            ->where('dateFilter.date', $target->toDateString())
            ->where('kpis.total_views', 4)
        );
});

test('analytics filters by date range', function () {
    $admin = User::factory()->admin()->create();
    $from = now()->subDays(10)->startOfDay();
    $to = now()->subDays(3)->endOfDay();

    Visit::factory()->count(3)->create([
        'is_bot' => false,
        'created_at' => $from->copy()->addDays(2),
    ]);
    Visit::factory()->count(5)->create([
        'is_bot' => false,
        'created_at' => now()->subDay(),
    ]);

    $this->actingAs($admin)
        ->get(route('analytics.index', [
            'date_from' => $from->toDateString(),
            'date_to' => $to->toDateString(),
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('dateFilter.mode', 'range')
            ->where('kpis.total_views', 3)
            ->where('dateRange.from', $from->toDateString())
            ->where('dateRange.to', $to->toDateString())
        );
});

test('analytics exposes filter options', function () {
    $admin = User::factory()->admin()->create();

    Visit::factory()->create([
        'is_bot' => false,
        'path' => '/contact',
        'country_code' => 'FR',
        'country' => 'France',
        'browser' => 'Chrome',
    ]);

    $this->actingAs($admin)
        ->get(route('analytics.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('filterOptions.pages')
            ->has('filterOptions.countries')
            ->has('filterOptions.browsers')
            ->where('filterOptions.pages', fn ($pages) => collect($pages)->contains('/contact'))
            ->where('filterOptions.browsers', fn ($browsers) => collect($browsers)->contains('Chrome'))
        );
});
