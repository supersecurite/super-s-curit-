<?php

use App\Enums\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

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

test('admins can create users without super admin role', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('users.store'), [
            'name' => 'Nouveau Admin',
            'email' => 'nouveau-admin@example.com',
            'phone' => '+224 600 00 00 00',
            'role' => UserRole::Admin->value,
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ])
        ->assertRedirect(route('users.index'));

    $created = User::query()->where('email', 'nouveau-admin@example.com')->first();

    expect($created)->not->toBeNull()
        ->and($created->role)->toBe(UserRole::Admin)
        ->and($created->uuid)->not->toBeEmpty();
});

test('admins cannot assign super admin role', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('users.store'), [
            'name' => 'Tentative Super Admin',
            'email' => 'tentative-super@example.com',
            'role' => UserRole::SuperAdmin->value,
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ])
        ->assertSessionHasErrors('role');
});

test('super admin can create another super admin', function () {
    $superAdmin = User::factory()->superAdmin()->create();

    $this->actingAs($superAdmin)
        ->post(route('users.store'), [
            'name' => 'Autre Super Admin',
            'email' => 'autre-super@example.com',
            'role' => UserRole::SuperAdmin->value,
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
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
            'password' => '',
            'password_confirmation' => '',
        ])
        ->assertForbidden();
});

test('admin cannot delete themselves', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->delete(route('users.destroy', $admin))
        ->assertForbidden();

    expect(User::query()->find($admin->id))->not->toBeNull();
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
