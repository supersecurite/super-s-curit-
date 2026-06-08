<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('home page can be rendered', function () {
    $response = $this->get(route('home'));

    $response->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('marketing/home'),
    );
});

test('about page can be rendered', function () {
    $response = $this->get(route('about'));

    $response->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('marketing/about'),
    );
});

test('contact page can be rendered', function () {
    $response = $this->get(route('contact'));

    $response->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('marketing/contact'),
    );
});

test('service pages can be rendered', function (string $routeName) {
    $this->get(route($routeName))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('marketing/service-page'));
})->with([
    'services.entreprise',
    'services.residence',
    'services.chantiers',
    'services.zones-minieres',
]);
