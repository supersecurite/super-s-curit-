<?php

use App\Enums\AccessLogKind;
use App\Models\AccessLog;
use App\Models\User;
use Database\Seeders\RoleUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin can view access logs index', function () {
    $this->seed(RoleUserSeeder::class);

    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();

    AccessLog::factory()->create([
        'user_id' => $admin->id,
        'description' => 'Admin a consulté le tableau de bord.',
    ]);

    $this->actingAs($admin)
        ->get(route('access-logs.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('access-logs/index')
            ->has('logs.data', 1)
            ->where('logs.data.0.description', 'Admin a consulté le tableau de bord.'));
});

test('dashboard visit is logged in french', function () {
    $this->seed(RoleUserSeeder::class);

    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();
    $admin->update(['name' => 'Aristide']);

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertOk();

    $this->assertDatabaseHas('access_logs', [
        'user_id' => $admin->id,
        'kind' => AccessLogKind::Visit->value,
        'description' => 'Aristide a consulté le tableau de bord.',
    ]);
});

test('prefetch visit is not logged', function () {
    $this->seed(RoleUserSeeder::class);

    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();

    $this->actingAs($admin)
        ->withHeaders(['Purpose' => 'prefetch'])
        ->get(route('dashboard'))
        ->assertOk();

    expect(AccessLog::query()->count())->toBe(0);
});

test('contributor without access_logs permission cannot view journal', function () {
    $this->seed(RoleUserSeeder::class);

    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();

    $this->actingAs($user)
        ->get(route('access-logs.index'))
        ->assertForbidden();
});

test('admin can fetch activity feed json', function () {
    $this->seed(RoleUserSeeder::class);

    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();

    AccessLog::factory()->count(3)->create(['user_id' => $admin->id]);

    $response = $this->actingAs($admin)
        ->getJson(route('access-logs.feed', ['scope' => 'all']));

    $response->assertOk()
        ->assertJsonCount(3, 'logs.data')
        ->assertJsonStructure([
            'logs' => ['data', 'current_page', 'last_page', 'total', 'links'],
            'users',
            'filters',
        ]);
});

test('activity feed supports search and pagination filters', function () {
    $this->seed(RoleUserSeeder::class);

    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();

    AccessLog::factory()->create([
        'user_id' => $admin->id,
        'description' => 'Aristide a modifié le contact Jean Dupont.',
    ]);

    AccessLog::factory()->create([
        'user_id' => $admin->id,
        'description' => 'Aristide a consulté le tableau de bord.',
    ]);

    $this->actingAs($admin)
        ->getJson(route('access-logs.feed', [
            'scope' => 'all',
            'search' => 'contact Jean',
        ]))
        ->assertOk()
        ->assertJsonCount(1, 'logs.data')
        ->assertJsonPath('logs.data.0.description', 'Aristide a modifié le contact Jean Dupont.');
});

test('activity feed supports dedicated ip country browser and method filters', function () {
    $this->seed(RoleUserSeeder::class);

    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();

    AccessLog::factory()->create([
        'user_id' => $admin->id,
        'ip' => '203.0.113.10',
        'browser' => 'Firefox',
        'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
        'country_code' => 'GN',
        'country' => 'Guinée',
        'http_method' => 'POST',
        'description' => 'Action Firefox Guinée.',
    ]);

    AccessLog::factory()->create([
        'user_id' => $admin->id,
        'ip' => '198.51.100.4',
        'browser' => 'Chrome',
        'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'country_code' => 'FR',
        'country' => 'France',
        'http_method' => 'GET',
        'description' => 'Consultation Chrome France.',
    ]);

    $this->actingAs($admin)
        ->getJson(route('access-logs.feed', [
            'scope' => 'all',
            'ip' => '203.0.113',
            'country' => 'GN',
            'browser' => 'Firefox',
            'method' => 'POST',
        ]))
        ->assertOk()
        ->assertJsonCount(1, 'logs.data')
        ->assertJsonPath('logs.data.0.description', 'Action Firefox Guinée.');

    $this->actingAs($admin)
        ->getJson(route('access-logs.feed', [
            'scope' => 'all',
            'search' => 'Chrome',
        ]))
        ->assertOk()
        ->assertJsonCount(1, 'logs.data')
        ->assertJsonPath('logs.data.0.description', 'Consultation Chrome France.');
});

test('dashboard visit stores browser and country', function () {
    $this->seed(RoleUserSeeder::class);

    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();

    $this->actingAs($admin)
        ->withHeaders([
            'CF-IPCountry' => 'GN',
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ])
        ->get(route('dashboard'))
        ->assertOk();

    $log = AccessLog::query()->first();

    expect($log)->not->toBeNull()
        ->and($log->country_code)->toBe('GN')
        ->and($log->country)->not->toBeEmpty()
        ->and($log->browser)->toBe('Chrome')
        ->and($log->platform)->toBe('Windows');
});

test('public marketing page visit is not logged when authenticated', function () {
    $this->seed(RoleUserSeeder::class);

    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();

    $this->actingAs($admin)
        ->get(route('home'))
        ->assertOk();

    $this->actingAs($admin)
        ->get(route('actualites.index'))
        ->assertOk();

    expect(AccessLog::query()->count())->toBe(0);
});

test('authenticated admin receives access log filter users in shared props', function () {
    $this->seed(RoleUserSeeder::class);

    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('accessLogFilterUsers', 4));
});

test('contributor without access_logs permission gets empty filter users', function () {
    $this->seed(RoleUserSeeder::class);

    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('accessLogFilterUsers', []));
});

test('access logs index page is not logged', function () {
    $this->seed(RoleUserSeeder::class);

    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();

    $this->actingAs($admin)
        ->get(route('access-logs.index'))
        ->assertOk();

    expect(AccessLog::query()->count())->toBe(0);
});

test('activity feed supports sorting by user name', function () {
    $this->seed(RoleUserSeeder::class);

    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();
    $admin->update(['name' => 'Zoe Admin']);

    $other = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();
    $other->update(['name' => 'Alice User']);

    AccessLog::factory()->create([
        'user_id' => $admin->id,
        'description' => 'Log Zoe.',
    ]);

    AccessLog::factory()->create([
        'user_id' => $other->id,
        'description' => 'Log Alice.',
    ]);

    $this->actingAs($admin)
        ->getJson(route('access-logs.feed', [
            'scope' => 'all',
            'sort_by' => 'user',
            'sort_direction' => 'asc',
        ]))
        ->assertOk()
        ->assertJsonPath('filters.sort_by', 'user')
        ->assertJsonPath('filters.sort_direction', 'asc')
        ->assertJsonPath('logs.data.0.user_name', 'Alice User')
        ->assertJsonPath('logs.data.1.user_name', 'Zoe Admin');
});
