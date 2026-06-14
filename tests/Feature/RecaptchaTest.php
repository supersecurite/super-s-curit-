<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

test('contact form rejects missing recaptcha when enabled', function () {
    config([
        'recaptcha.enabled' => true,
        'recaptcha.secret_key' => 'test-secret',
    ]);

    $response = $this->post(route('contact.store'), [
        'name' => 'Client Test',
        'email' => 'client@example.com',
        'phone' => '+224621630916',
        'message' => 'Message de test.',
    ]);

    $response->assertSessionHasErrors(['g-recaptcha-response']);
});

test('contact form rejects invalid recaptcha token when enabled', function () {
    config([
        'recaptcha.enabled' => true,
        'recaptcha.secret_key' => 'test-secret',
    ]);

    Http::fake([
        'www.google.com/recaptcha/api/siteverify' => Http::response([
            'success' => false,
        ]),
    ]);

    $response = $this->post(route('contact.store'), [
        'name' => 'Client Test',
        'email' => 'client@example.com',
        'phone' => '+224621630916',
        'message' => 'Message de test.',
        'g-recaptcha-response' => 'invalid-token',
    ]);

    $response->assertSessionHasErrors(['g-recaptcha-response']);
});

test('agent application rejects missing recaptcha when enabled', function () {
    config([
        'recaptcha.enabled' => true,
        'recaptcha.secret_key' => 'test-secret',
    ]);

    $response = $this->post(route('devenir-agent.store'), [
        'first_name' => 'Test',
        'last_name' => 'Agent',
        'phone' => '+224600000000',
        'post' => 'agent',
        'commune_id' => '104',
        'consent' => '1',
    ]);

    $response->assertSessionHasErrors(['g-recaptcha-response']);
});

test('contact form accepts valid recaptcha token when enabled', function () {
    Mail::fake();

    config([
        'recaptcha.enabled' => true,
        'recaptcha.secret_key' => 'test-secret',
    ]);

    Http::fake([
        'www.google.com/recaptcha/api/siteverify' => Http::response([
            'success' => true,
        ]),
    ]);

    $response = $this->post(route('contact.store'), [
        'name' => 'Client Test',
        'email' => 'client@example.com',
        'phone' => '+224621630916',
        'message' => 'Message de test.',
        'g-recaptcha-response' => 'valid-token',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');
});
