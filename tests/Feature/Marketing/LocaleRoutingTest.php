<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('french marketing home uses default locale without prefix', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/home')
            ->where('locale', 'fr')
            ->has('translations.nav')
        );
});

test('english marketing contact sets locale en', function () {
    $this->get('/en/contact')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/contact')
            ->where('locale', 'en')
            ->where('pageMeta.hreflang.fr', url('/contact'))
            ->where('pageMeta.hreflang.en', url('/en/contact'))
            ->where('pageMeta.hreflang.x-default', url('/contact'))
            ->where('translations.contact.form_heading', 'Describe your security needs')
            ->where('translations.home.advantages_label', 'Our strengths')
            ->where('translations.home.partners_label', 'Partners')
            ->where('translations.services.zones-minieres.highlights_title', 'Why mining operators choose Super Sécurité')
        );
});

test('english named routes resolve under en prefix', function () {
    expect(route('en.contact', absolute: false))->toBe('/en/contact');
    expect(route('en.home', absolute: false))->toBe('/en');
});

test('unsupported locale prefix returns not found', function () {
    $this->get('/de/contact')->assertNotFound();
});

test('english about page is available', function () {
    $this->get(route('en.about'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/about')
            ->where('locale', 'en')
        );
});

test('pourquoi-nous redirects to localized about', function () {
    $this->get('/pourquoi-nous')->assertRedirect('/a-propos');
    $this->get('/en/pourquoi-nous')->assertRedirect('/en/a-propos');
});
