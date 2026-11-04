<?php

use App\Models\JobOffer;
use App\Models\SecurityAgentApplication;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('public can view careers apply form for an active offer', function () {
    $offer = JobOffer::factory()->create(['slug' => 'agent-de-securite']);

    $this->get(route('carrieres.postuler', $offer))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/carrieres/postuler')
            ->has('availabilityOptions', 4)
            ->where('jobOffer.slug', 'agent-de-securite')
        );
});

test('public can submit a valid application linked to a job offer', function () {
    Mail::fake();

    $offer = JobOffer::factory()->create();

    $payload = [
        'first_name' => 'Mamadou',
        'last_name' => 'Diallo',
        'phone' => '+224612131314',
        'email' => 'agent@example.com',
        'experience_years' => 3,
        'availability' => 'nuit',
        'certifications' => 'Formation gardiennage',
        'motivation' => 'Je souhaite rejoindre Super Sécurité.',
        'commune_id' => '104',
        'address_detail' => 'Face Cis Media',
        'consent' => '1',
    ];

    $this->post(route('carrieres.store', $offer), $payload)
        ->assertRedirect(route('carrieres.merci'));

    $application = SecurityAgentApplication::query()->first();

    expect($application)->not->toBeNull()
        ->and($application->first_name)->toBe('Mamadou')
        ->and($application->job_offer_id)->toBe($offer->id)
        ->and($application->region_id)->toBe('1')
        ->and($application->prefecture_id)->toBe('10')
        ->and($application->prefecture_name)->toBe('Conakry')
        ->and($application->commune_name)->toBe('Lambanyi')
        ->and($application->post)->toBeNull()
        ->and($application->quartier_name)->toBeNull()
        ->and($application->status->value)->toBe('pending');
});

test('agent application requires commune', function () {
    $offer = JobOffer::factory()->create();

    $this->post(route('carrieres.store', $offer), [
        'first_name' => 'Test',
        'last_name' => 'Agent',
        'phone' => '+224600000000',
        'consent' => '1',
    ])->assertSessionHasErrors('commune_id');
});

test('public can submit agent application with boké mining town commune', function () {
    Mail::fake();

    $offer = JobOffer::factory()->create();

    $this->post(route('carrieres.store', $offer), [
        'first_name' => 'Ibrahima',
        'last_name' => 'Camara',
        'phone' => '+224612131315',
        'commune_id' => '221',
        'consent' => '1',
    ])->assertRedirect(route('carrieres.merci'));

    expect(SecurityAgentApplication::query()->first())
        ->commune_name->toBe('Kamsar')
        ->prefecture_name->toBe('Boké')
        ->region_id->toBe('2')
        ->job_offer_id->toBe($offer->id);
});

test('agent application rejects invalid commune', function () {
    $offer = JobOffer::factory()->create();

    $this->post(route('carrieres.store', $offer), [
        'first_name' => 'Test',
        'last_name' => 'Agent',
        'phone' => '+224600000000',
        'commune_id' => '99999',
        'consent' => '1',
    ])->assertSessionHasErrors('commune_id');
});

test('thank you page is accessible', function () {
    $this->get(route('carrieres.merci'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/carrieres/merci')
        );
});

test('careers page has seo metadata configured', function () {
    $this->get(route('carrieres.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('pageMeta.path', '/carrieres')
            ->where('pageMeta.title', fn ($title) => str_contains(mb_strtolower($title), 'carrière') || str_contains(mb_strtolower($title), 'carrieres'))
        );
});

test('public can view apply form in english with translated options', function () {
    $offer = JobOffer::factory()->create(['slug' => 'security-guard']);

    $this->get(route('en.carrieres.postuler', $offer))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/carrieres/postuler')
            ->where('pageMeta.path', '/en/carrieres/security-guard/postuler')
            ->where('availabilityOptions.0.label', 'Day')
        );
});

test('submitting application in english redirects to english thank you page', function () {
    Mail::fake();

    $offer = JobOffer::factory()->create();

    $this->post(route('en.carrieres.store', $offer), [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'phone' => '+224612000000',
        'commune_id' => '104',
        'consent' => '1',
    ])->assertRedirect(route('en.carrieres.merci'));
});
