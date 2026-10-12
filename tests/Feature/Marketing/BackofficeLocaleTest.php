<?php

use App\Models\User;
use App\Support\BackofficeLocale;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('authenticated user can switch backoffice locale via put', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->put(route('backoffice.locale.update'), ['locale' => 'en'])
        ->assertRedirect();

    expect(session(BackofficeLocale::SESSION_KEY))->toBe('en');

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'en')
            ->where('translations.nav.articles', 'News')
            ->where('translations.dashboard.title', 'Dashboard')
        );
});

test('public en contact stays url-driven and ignores backoffice session locale', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->withSession([BackofficeLocale::SESSION_KEY => 'fr'])
        ->get('/en/contact')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/contact')
            ->where('locale', 'en')
            ->where('translations.contact.form_heading', 'Describe your security needs')
        );
});

test('dashboard ignores url en prefix and uses backoffice session', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->withSession([BackofficeLocale::SESSION_KEY => 'en'])
        ->get('/dashboard')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'en')
            ->has('translations.nav')
            ->missing('translations.contact')
        );
});

test('login page uses backoffice translations from cookie', function () {
    $this->withUnencryptedCookie(BackofficeLocale::COOKIE_NAME, 'en')
        ->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
            ->where('locale', 'en')
            ->where('translations.auth.submit', 'Sign in')
        );
});
