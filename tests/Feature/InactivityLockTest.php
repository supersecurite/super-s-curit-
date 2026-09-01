<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

test('la configuration de verrouillage est partagée aux utilisateurs connectés', function () {
    config([
        'super-securite.inactivity_lock.enabled' => true,
        'super-securite.inactivity_lock.timeout_minutes' => 20,
    ]);

    $user = User::factory()->contributor()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('inactivityLock.enabled', true)
            ->where('inactivityLock.timeoutMs', 1_200_000));
});

test('la configuration de verrouillage est désactivée pour les invités', function () {
    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('inactivityLock.enabled', false));
});

test('le mot de passe peut déverrouiller la session', function () {
    $user = User::factory()->create([
        'password' => Hash::make('secret-password'),
    ]);

    $this->actingAs($user)
        ->post(route('password.confirm.store'), [
            'password' => 'secret-password',
        ])
        ->assertRedirect(route('dashboard'));

    expect(session('auth.password_confirmed_at'))->not->toBeNull();
});

test('le déverrouillage inactivité reste sur la page courante', function () {
    $user = User::factory()->create([
        'password' => Hash::make('secret-password'),
    ]);

    $this->actingAs($user)
        ->from(route('profile.edit'))
        ->withHeaders(['X-Super-Securite-Lock-Unlock' => '1'])
        ->post(route('password.confirm.store'), [
            'password' => 'secret-password',
            'return_to' => route('profile.edit', absolute: false),
        ])
        ->assertRedirect(route('profile.edit'));
});

test('le déverrouillage refuse un return_to externe', function () {
    $user = User::factory()->create([
        'password' => Hash::make('secret-password'),
    ]);

    $this->actingAs($user)
        ->from(route('profile.edit'))
        ->withHeaders(['X-Super-Securite-Lock-Unlock' => '1'])
        ->post(route('password.confirm.store'), [
            'password' => 'secret-password',
            'return_to' => 'https://evil.example/phish',
        ])
        ->assertRedirect(route('profile.edit'));
});

test('un mauvais mot de passe refuse le déverrouillage', function () {
    $user = User::factory()->create([
        'password' => Hash::make('secret-password'),
    ]);

    $this->actingAs($user)
        ->from(route('dashboard'))
        ->post(route('password.confirm.store'), [
            'password' => 'wrong-password',
        ])
        ->assertSessionHasErrors('password');
});
