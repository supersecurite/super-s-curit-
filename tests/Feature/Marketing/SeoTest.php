<?php

use Inertia\Testing\AssertableInertia as Assert;

test('robots.txt is served dynamically with sitemap reference', function () {
    $response = $this->get(route('robots'));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'text/plain; charset=UTF-8');
    $response->assertSeeText('User-agent: *');
    $response->assertSeeText('Sitemap: '.url('/sitemap.xml'));
    $response->assertSeeText('Disallow: /dashboard');
    $response->assertSeeText('Disallow: /analytics');
});

test('robots.txt allows ai crawlers for aeo', function () {
    $response = $this->get(route('robots'));

    $response->assertOk()
        ->assertSeeText('User-agent: GPTBot')
        ->assertSeeText('User-agent: PerplexityBot');
});

test('sitemap.xml lists public marketing pages', function () {
    $response = $this->get(route('sitemap'));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'text/xml; charset=utf-8');

    $content = $response->getContent();

    expect($content)
        ->toContain('<urlset')
        ->toContain(url('/'))
        ->toContain(url('/a-propos'))
        ->toContain(url('/contact'))
        ->toContain(url('/politique-de-confidentialite'))
        ->toContain(url('/mentions-legales'));
});

test('legacy agency urls redirect to home', function (string $path) {
    $this->get($path)->assertRedirect('/');
})->with([
    '/site-wordpress',
    '/creation-site',
    '/integrateur-solutions',
    '/woocommerce',
    '/application-web',
    '/seo',
    '/realisations',
]);

test('pourquoi-nous redirects to about page', function () {
    $this->get('/pourquoi-nous')->assertRedirect('/a-propos');
});

test('marketing pages include server rendered title and description', function () {
    $response = $this->get(route('home'));

    $response->assertOk();

    expect($response->getContent())
        ->toContain('Super Sécurité')
        ->toContain('sécurité privée')
        ->toContain('rel="canonical"')
        ->toContain('property="og:title"')
        ->toContain('application/ld+json');
});

test('legal pages are available', function () {
    $this->get(route('privacy'))->assertOk();
    $this->get(route('legal'))->assertOk();
});

test('shared page meta is provided to inertia on marketing pages', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('pageMeta.title')
            ->has('pageMeta.canonical')
            ->where('pageMeta.title', collect(config('seo.pages'))->firstWhere('path', '/')['meta_title'])
        );
});

test('marketing pages include server rendered structured data for contact and services', function () {
    $response = $this->get(route('home'));

    $response->assertOk();

    expect($response->getContent())
        ->toContain('application/ld+json')
        ->toContain('ContactPoint')
        ->toContain('ItemList')
        ->toContain(config('super-securite.email'))
        ->toContain(config('super-securite.phone'));
});

test('contact page structured data includes faq and contact page type', function () {
    $response = $this->get(route('contact'));

    expect($response->getContent())
        ->toContain('ContactPage')
        ->toContain('FAQPage')
        ->toContain('Place')
        ->toContain('hasMap')
        ->toContain(config('seo.faqs.0.question'));
});

test('contact page includes map section and local seo meta', function () {
    $contactPage = collect(config('seo.pages'))->firstWhere('path', '/contact');

    $this->get(route('contact'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/contact')
            ->has('superSecurite.map.embedUrl')
            ->has('superSecurite.map.directionsUrl')
            ->where('pageMeta.title', $contactPage['meta_title'])
        );

    expect($this->get(route('contact'))->getContent())
        ->toContain('maps.google.com')
        ->toContain('plan-acces')
        ->toContain('Lambanyi');
});

test('home seo meta includes local search terms', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('seo.organization.addressLocality', 'Conakry')
            ->has('seo.knowsAbout')
            ->where('seo.knowsAbout', fn ($terms): bool => $terms->contains('sécurité privée Conakry')
                && $terms->contains('gardiennage Guinée'))
            ->where('seo.services.0.name', 'Gardiennage et surveillance')
        );
});

test('marketing pages share seo defaults', function () {
    $response = $this->get(route('home'));

    $response->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('marketing/home')
        ->has('seo.siteName')
        ->has('seo.siteUrl')
        ->has('seo.ogImage')
        ->has('seo.geo')
        ->has('seo.sameAs')
        ->has('seo.services')
        ->where('seo.siteName', config('seo.site_name'))
        ->where('seo.organization.addressLocality', config('seo.organization.address_locality'))
    );
});

test('home page renders super securite marketing content', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('marketing/home'));
});
