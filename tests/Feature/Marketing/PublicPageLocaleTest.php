<?php

use App\Mail\ContactMessageMailable;
use App\Support\LocaleTranslations;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
    config(['recaptcha.enabled' => false]);
});

test('public pages preserve their requested language and translated controls', function (string $locale) {
    $prefix = $locale === 'fr' ? '' : '/'.$locale;
    foreach (['actualites', 'conseils-securite', 'galerie', 'contact'] as $path) {
        $this->get($prefix.'/'.$path)->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('locale', $locale)
                ->where('translations.share.copy_link', LocaleTranslations::forLocale($locale)['share']['copy_link'])
                ->where('translations.public_content.read', LocaleTranslations::forLocale($locale)['public_content']['read'])
            );
    }
})->with(['fr', 'en', 'zh']);

test('contact validation and confirmation follow the form language', function (string $locale) {
    Mail::fake();
    config(['super-securite.mail_to' => 'contact@example.com']);
    $path = ($locale === 'fr' ? '' : '/'.$locale).'/contact';
    $this->from($path)->post($path, [])->assertSessionHasErrors(['name', 'email', 'phone', 'message', 'site_location', 'privacy_consent']);
    expect(session('errors')->first('name'))->toBe(LocaleTranslations::forLocale($locale)['public_content']['name_required']);

    $this->from($path)->post($path, [
        'name' => 'Test Contact',
        'email' => 'visitor@example.com',
        'phone' => '+224620000000',
        'site_location' => 'Lambanyi',
        'privacy_consent' => '1',
        'message' => 'Request for site security.',
    ])->assertRedirect($path)
        ->assertSessionHas('success', LocaleTranslations::forLocale($locale)['public_content']['contact_success']);
    Mail::assertSent(ContactMessageMailable::class);
})->with(['fr', 'en', 'zh']);
