<?php

use App\Enums\BackofficePermission;
use App\Enums\UserRole;
use App\Models\User;
use Database\Seeders\RoleUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('user without permission cannot access protected backoffice routes', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('articles.index'))
        ->assertForbidden();
});

test('user with articles view permission can access articles backoffice', function () {
    $user = User::factory()
        ->withBackofficePermissions([
            BackofficePermission::DashboardView,
            BackofficePermission::ArticlesView,
        ])
        ->create();

    $this->actingAs($user)
        ->get(route('articles.index'))
        ->assertOk();
});

test('user with only articles view cannot create articles', function () {
    $user = User::factory()
        ->withBackofficePermissions([
            BackofficePermission::DashboardView,
            BackofficePermission::ArticlesView,
        ])
        ->create();

    $this->actingAs($user)
        ->get(route('articles.create'))
        ->assertForbidden();
});

test('admin can assign granular permissions when creating a user', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('users.store'), [
            'name' => 'Rédacteur limité',
            'email' => 'redacteur@example.com',
            'role' => UserRole::User->value,
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'permissions' => [
                BackofficePermission::DashboardView->value,
                BackofficePermission::ArticlesView->value,
                BackofficePermission::ArticlesCreate->value,
            ],
        ])
        ->assertRedirect(route('users.index'));

    $created = User::query()->where('email', 'redacteur@example.com')->firstOrFail();

    expect($created->hasBackofficePermission(BackofficePermission::ArticlesCreate))->toBeTrue()
        ->and($created->hasBackofficePermission(BackofficePermission::ArticlesDelete))->toBeFalse();
});

test('admin can update user permissions', function () {
    $admin = User::factory()->admin()->create();
    $target = User::factory()->contributor()->create();

    $this->actingAs($admin)
        ->put(route('users.update', $target), [
            'name' => $target->name,
            'email' => $target->email,
            'role' => UserRole::User->value,
            'permissions' => [BackofficePermission::PartnersView->value],
        ])
        ->assertRedirect(route('users.index'));

    expect($target->fresh()->hasBackofficePermission(BackofficePermission::PartnersView))->toBeTrue()
        ->and($target->fresh()->hasBackofficePermission(BackofficePermission::ArticlesView))->toBeFalse();
});

test('super admin always has all permissions', function () {
    $superAdmin = User::factory()->superAdmin()->create();

    expect($superAdmin->hasBackofficePermission(BackofficePermission::UsersDelete))->toBeTrue()
        ->and($superAdmin->hasBackofficePermission(BackofficePermission::AnalyticsView))->toBeTrue();
});

test('auth user shares permissions in inertia props', function () {
    $this->seed(RoleUserSeeder::class);

    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('auth.user.permissions', 9)
            ->where('auth.user.can_approve_content', false)
        );
});

test('articles approve permission enables moderation actions', function () {
    $moderator = User::factory()
        ->withBackofficePermissions([
            BackofficePermission::DashboardView,
            BackofficePermission::ArticlesView,
            BackofficePermission::ArticlesApprove,
        ])
        ->create();

    expect($moderator->canApproveArticles())->toBeTrue()
        ->and($moderator->canApproveConseils())->toBeFalse();
});

test('legacy stored permissions are resolved without enum errors', function () {
    $user = User::factory()->create();

    $user->backofficePermissionRecords()->create(['permission' => 'analytics']);
    $user->backofficePermissionRecords()->create(['permission' => 'articles']);

    expect(fn () => $user->fresh()->canAccessFeature('analytics'))->not->toThrow(\ValueError::class)
        ->and($user->fresh()->canAccessFeature('analytics'))->toBeTrue()
        ->and($user->fresh()->hasBackofficePermission(BackofficePermission::AnalyticsView))->toBeTrue();

    $stored = $user->fresh()->backofficePermissionRecords()->pluck('permission')->all();

    expect($stored)->toContain('analytics.view')
        ->and($stored)->not->toContain('analytics');
});

test('legacy permissions expand to granular permissions', function () {
    $expanded = collect(BackofficePermission::expandLegacy('articles'))
        ->map(fn (BackofficePermission $permission) => $permission->value)
        ->all();

    $approval = collect(BackofficePermission::expandLegacy('content_approval'))
        ->map(fn (BackofficePermission $permission) => $permission->feature())
        ->unique()
        ->values()
        ->all();

    expect($expanded)->toContain('articles.view', 'articles.create', 'articles.approve')
        ->and($approval)->toBe(['articles', 'conseils']);
});
