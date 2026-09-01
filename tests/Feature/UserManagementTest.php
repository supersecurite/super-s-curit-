<?php

use App\Enums\BackofficePermission;
use App\Enums\UserRole;
use App\Models\User;
use App\Notifications\AdminPasswordResetNotification;
use App\Notifications\WelcomeSetPasswordNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests cannot access user management', function () {
    $this->get(route('users.index'))->assertRedirect(route('login'));
});

test('regular users cannot access user management', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('users.index'))
        ->assertForbidden();
});

test('admins can list users', function () {
    $admin = User::factory()->admin()->create();
    User::factory()->count(2)->create();

    $this->actingAs($admin)
        ->get(route('users.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/index')
            ->has('users.data', 3)
        );
});

test('users index supports column sorting', function () {
    $admin = User::factory()->admin()->create(['name' => 'Zzz Admin']);

    User::factory()->create(['name' => 'Zoe Zulu', 'email' => 'zoe@example.com']);
    User::factory()->create(['name' => 'Alice Alpha', 'email' => 'alice@example.com']);

    $this->actingAs($admin)
        ->get(route('users.index', ['sort_by' => 'name', 'sort_direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.sort_by', 'name')
            ->where('filters.sort_direction', 'asc')
            ->where('users.data.0.name', 'Alice Alpha')
        );
});

test('admins can create users without password and welcome email is sent', function () {
    Notification::fake();

    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('users.store'), [
            'name' => 'Nouveau Admin',
            'email' => 'nouveau-admin@example.com',
            'phone' => '+224 600 00 00 00',
            'role' => UserRole::Admin->value,
        ])
        ->assertRedirect(route('users.index'));

    $created = User::query()->where('email', 'nouveau-admin@example.com')->first();

    expect($created)->not->toBeNull()
        ->and($created->role)->toBe(UserRole::Admin)
        ->and($created->uuid)->not->toBeEmpty();

    Notification::assertSentTo($created, WelcomeSetPasswordNotification::class);
});

test('admins cannot assign super admin role', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('users.store'), [
            'name' => 'Tentative Super Admin',
            'email' => 'tentative-super@example.com',
            'role' => UserRole::SuperAdmin->value,
        ])
        ->assertSessionHasErrors('role');
});

test('super admin can create another super admin', function () {
    Notification::fake();

    $superAdmin = User::factory()->superAdmin()->create();

    $this->actingAs($superAdmin)
        ->post(route('users.store'), [
            'name' => 'Autre Super Admin',
            'email' => 'autre-super@example.com',
            'role' => UserRole::SuperAdmin->value,
        ])
        ->assertRedirect(route('users.index'));

    expect(User::query()->where('email', 'autre-super@example.com')->value('role'))
        ->toBe(UserRole::SuperAdmin);
});

test('admin cannot update a super admin', function () {
    $admin = User::factory()->admin()->create();
    $superAdmin = User::factory()->superAdmin()->create();

    $this->actingAs($admin)
        ->put(route('users.update', $superAdmin), [
            'name' => 'Nom modifié',
            'email' => $superAdmin->email,
            'role' => UserRole::SuperAdmin->value,
        ])
        ->assertForbidden();
});

test('admin can resend welcome email to a user', function () {
    Notification::fake();

    $admin = User::factory()->admin()->create();
    $target = User::factory()->create();

    $this->actingAs($admin)
        ->post(route('users.send-welcome', $target))
        ->assertRedirect();

    Notification::assertSentTo($target, WelcomeSetPasswordNotification::class);
});

test('admin can send password reset link to a user', function () {
    Notification::fake();

    $admin = User::factory()->admin()->create();
    $target = User::factory()->create();

    $this->actingAs($admin)
        ->post(route('users.send-password-reset', $target))
        ->assertRedirect();

    Notification::assertSentTo($target, AdminPasswordResetNotification::class);
});

test('password reset tokens expire after fifteen minutes', function () {
    expect((int) config('auth.passwords.users.expire'))->toBe(15);
});

test('admin cannot delete themselves', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->delete(route('users.destroy', $admin))
        ->assertForbidden();

    expect(User::query()->find($admin->id))->not->toBeNull();
});

test('user edit page supports tab query parameter', function () {
    $admin = User::factory()->admin()->create();
    $target = User::factory()->create();

    $this->actingAs($admin)
        ->get(route('users.edit', ['user' => $target, 'tab' => 'permissions']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/edit')
            ->where('tab', 'permissions')
        );

    $this->actingAs($admin)
        ->get(route('users.edit', ['user' => $target, 'tab' => 'invalid']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('tab', 'profile')
        );
});

test('user routes use uuid instead of numeric id', function () {
    $admin = User::factory()->admin()->create();
    $target = User::factory()->create();

    $this->actingAs($admin)
        ->get(route('users.edit', $target))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/edit')
            ->where('user.uuid', $target->uuid)
        );

    $editUrl = route('users.edit', $target);

    expect($editUrl)->toEndWith("/{$target->uuid}/edit")
        ->and($editUrl)->not->toMatch('#/users/\d+/edit#');
});

test('super admin can delete another user', function () {
    $superAdmin = User::factory()->superAdmin()->create();
    $target = User::factory()->create();

    $this->actingAs($superAdmin)
        ->delete(route('users.destroy', $target))
        ->assertRedirect(route('users.index'));

    expect(User::query()->find($target->id))->toBeNull();
});

test('admins can create a commercial user with marketing defaults', function () {
    Notification::fake();

    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('users.store'), [
            'name' => 'Commercial Demo',
            'email' => 'commercial-demo@example.com',
            'role' => UserRole::Commercial->value,
        ])
        ->assertRedirect(route('users.index'));

    $created = User::query()->where('email', 'commercial-demo@example.com')->firstOrFail();

    expect($created->role)->toBe(UserRole::Commercial)
        ->and($created->isCommercial())->toBeTrue()
        ->and($created->isAdmin())->toBeFalse()
        ->and($created->hasBackofficePermission(BackofficePermission::DashboardView))->toBeTrue()
        ->and($created->hasBackofficePermission(BackofficePermission::MarketingClientsView))->toBeTrue()
        ->and($created->hasBackofficePermission(BackofficePermission::MarketingCampaignsSend))->toBeTrue()
        ->and($created->hasBackofficePermission(BackofficePermission::ArticlesView))->toBeFalse()
        ->and($created->hasBackofficePermission(BackofficePermission::UsersView))->toBeFalse();
});

test('commercial role appears in admin role options on create', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('users.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/create')
            ->where('roles', fn ($roles) => collect($roles)->contains('value', UserRole::Commercial->value)
                && ! collect($roles)->contains('value', UserRole::SuperAdmin->value))
        );
});

test('commercial user cannot access user management', function () {
    $commercial = User::factory()->commercial()->create();

    $this->actingAs($commercial)
        ->get(route('users.index'))
        ->assertForbidden();
});

test('commercial user can access dashboard', function () {
    $commercial = User::factory()->commercial()->create();

    $this->actingAs($commercial)
        ->get(route('dashboard'))
        ->assertOk();
});
