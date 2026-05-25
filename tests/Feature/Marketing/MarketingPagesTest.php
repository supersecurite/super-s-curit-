<?php

use Inertia\Testing\AssertableInertia as Assert;

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
