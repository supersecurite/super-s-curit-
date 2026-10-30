<?php

use App\Mail\ContactMessageMailable;
use Illuminate\Support\Facades\Mail;

test('contact form requires name email phone and message', function () {
    $response = $this->post(route('contact.store'), []);

    $response->assertSessionHasErrors(['name', 'email', 'phone', 'message', 'site_location', 'privacy_consent']);
});

test('contact form rejects invalid email', function () {
    $response = $this->post(route('contact.store'), [
        'name' => 'Aristide Gnimassou',
        'email' => 'invalid-email',
        'phone' => '+224621630916',
        'message' => 'Bonjour, je souhaite un devis.',
    ]);

    $response->assertSessionHasErrors(['email']);
});

test('contact form sends mail and redirects with success', function () {
    Mail::fake();

    $payload = [
        'name' => 'Aristide Gnimassou',
        'email' => 'client@example.com',
        'phone' => '+224621630916',
        'site_location' => 'Lambanyi, Conakry',
        'privacy_consent' => '1',
        'message' => 'Nous avons besoin d\'une application web.',
    ];

    $response = $this->post(route('contact.store'), $payload);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    Mail::assertSent(ContactMessageMailable::class, function (ContactMessageMailable $mail) use ($payload) {
        return $mail->contact['name'] === $payload['name']
            && $mail->contact['email'] === $payload['email']
            && $mail->contact['message'] === $payload['message'];
    });
});

test('contact form rejects submission without phone', function () {
    $response = $this->post(route('contact.store'), [
        'name' => 'Client Test',
        'email' => 'client@example.com',
        'message' => 'Message sans téléphone.',
    ]);

    $response->assertSessionHasErrors(['phone']);
});

test('contact form accepts optional company and project type', function () {
    Mail::fake();

    $payload = [
        'name' => 'Aristide Gnimassou',
        'email' => 'client@example.com',
        'phone' => '+224621630916',
        'company' => 'SUPER_SECURITE',
        'project_type' => 'Application web sur mesure',
        'site_location' => 'Kaloum',
        'privacy_consent' => '1',
        'message' => 'Refonte complète de notre plateforme.',
    ];

    $response = $this->post(route('contact.store'), $payload);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    Mail::assertSent(ContactMessageMailable::class, function (ContactMessageMailable $mail) use ($payload) {
        return $mail->contact['company'] === $payload['company']
            && $mail->contact['project_type'] === $payload['project_type']
            && $mail->contact['site_location'] === $payload['site_location'];
    });
});
