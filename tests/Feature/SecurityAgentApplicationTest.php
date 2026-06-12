<?php

use App\Models\SecurityAgentApplication;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('public can view agent registration form', function () {
    $this->get(route('devenir-agent.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/devenir-agent/index')
            ->has('availabilityOptions', 4)
            ->has('postOptions', 6)
        );
});

test('public can submit a valid agent application in conakry', function () {
    Mail::fake();

    $payload = [
        'first_name' => 'Mamadou',
        'last_name' => 'Diallo',
        'phone' => '+224612131314',
        'email' => 'agent@example.com',
        'post' => 'agent',
        'experience_years' => 3,
        'availability' => 'nuit',
        'certifications' => 'Formation gardiennage',
        'motivation' => 'Je souhaite rejoindre Super Sécurité.',
        'commune_id' => '104',
        'address_detail' => 'Face Cis Media',
        'consent' => '1',
    ];

    $this->post(route('devenir-agent.store'), $payload)
        ->assertRedirect(route('devenir-agent.merci'));

    $application = SecurityAgentApplication::query()->first();

    expect($application)->not->toBeNull()
        ->and($application->first_name)->toBe('Mamadou')
        ->and($application->region_id)->toBe('1')
        ->and($application->prefecture_id)->toBe('10')
        ->and($application->prefecture_name)->toBe('Conakry')
        ->and($application->commune_name)->toBe('Lambanyi')
        ->and($application->post?->value)->toBe('agent')
        ->and($application->quartier_name)->toBeNull()
        ->and($application->status->value)->toBe('pending');
});

test('agent application requires post', function () {
    $this->post(route('devenir-agent.store'), [
        'first_name' => 'Test',
        'last_name' => 'Agent',
        'phone' => '+224600000000',
        'commune_id' => '104',
        'consent' => '1',
    ])->assertSessionHasErrors('post');
});

test('agent application requires commune', function () {
    $this->post(route('devenir-agent.store'), [
        'first_name' => 'Test',
        'last_name' => 'Agent',
        'phone' => '+224600000000',
        'post' => 'superviseur',
        'consent' => '1',
    ])->assertSessionHasErrors('commune_id');
});

test('public can submit agent application with boké mining town commune', function () {
    Mail::fake();

    $this->post(route('devenir-agent.store'), [
        'first_name' => 'Ibrahima',
        'last_name' => 'Camara',
        'phone' => '+224612131315',
        'post' => 'agent',
        'commune_id' => '221',
        'consent' => '1',
    ])->assertRedirect(route('devenir-agent.merci'));

    expect(SecurityAgentApplication::query()->first())
        ->commune_name->toBe('Kamsar')
        ->prefecture_name->toBe('Boké')
        ->region_id->toBe('2');
});

test('agent application rejects invalid commune', function () {
    $this->post(route('devenir-agent.store'), [
        'first_name' => 'Test',
        'last_name' => 'Agent',
        'phone' => '+224600000000',
        'post' => 'agent',
        'commune_id' => '99999',
        'consent' => '1',
    ])->assertSessionHasErrors('commune_id');
});

test('thank you page is accessible', function () {
    $this->get(route('devenir-agent.merci'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/devenir-agent/merci')
        );
});

test('devenir agent page has seo metadata configured', function () {
    $this->get(route('devenir-agent.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('pageMeta.path', '/devenir-agent')
            ->where('pageMeta.title', fn ($title) => str_contains($title, 'agent'))
        );
});
