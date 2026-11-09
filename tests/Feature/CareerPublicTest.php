<?php

use App\Models\JobOffer;
use App\Models\SecurityAgentApplication;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
});

test('careers page lists only active offers', function () {
    JobOffer::factory()->create(['title' => 'Agent actif', 'is_active' => true]);
    JobOffer::factory()->inactive()->create(['title' => 'Agent inactif']);

    $this->get(route('carrieres.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/carrieres/index')
            ->has('offers', 1)
            ->where('offers.0.title', 'Agent actif')
        );
});

test('careers page exposes a plain-text excerpt instead of lexical json', function () {
    JobOffer::factory()->create([
        'title' => 'Agent lexical',
        'description' => json_encode([
            'root' => [
                'children' => [[
                    'type' => 'paragraph',
                    'children' => [[
                        'type' => 'text',
                        'text' => 'Mission de surveillance nocturne à Conakry.',
                    ]],
                ]],
            ],
        ], JSON_THROW_ON_ERROR),
    ]);

    $this->get(route('carrieres.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/carrieres/index')
            ->where('offers.0.excerpt', 'Mission de surveillance nocturne à Conakry.')
            ->missing('offers.0.description')
        );
});

test('english careers page uses translated offer fields when available', function () {
    JobOffer::factory()->create([
        'title' => 'Agent de sécurité',
        'title_en' => 'Security officer',
        'location' => 'Conakry',
        'location_en' => 'Conakry',
        'contract_type' => 'Temps plein',
        'contract_type_en' => 'Full time',
        'description' => 'Description française.',
        'description_en' => 'English description.',
    ]);

    $this->get('/en/carrieres')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/carrieres/index')
            ->where('offers.0.title', 'Security officer')
            ->where('offers.0.contract_type', 'Full time')
            ->where('offers.0.excerpt', 'English description.')
            ->where('offers.0.has_english', true)
            ->where('offers.0.is_locale_fallback', false)
        );
});

test('inactive offer apply page returns 404', function () {
    $offer = JobOffer::factory()->inactive()->create();

    $this->get(route('carrieres.postuler', $offer))
        ->assertNotFound();
});

test('public can apply to an active offer', function () {
    Mail::fake();

    $offer = JobOffer::factory()->create([
        'title' => 'Superviseur de site',
        'slug' => 'superviseur-de-site',
    ]);

    $this->post(route('carrieres.store', $offer), [
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
    ])->assertRedirect(route('carrieres.merci'));

    $application = SecurityAgentApplication::query()->first();

    expect($application)->not->toBeNull()
        ->and($application->job_offer_id)->toBe($offer->id)
        ->and($application->first_name)->toBe('Mamadou')
        ->and($application->post)->toBeNull()
        ->and($application->status->value)->toBe('pending');
});

test('legacy devenir-agent urls redirect to carrieres', function () {
    $this->get('/devenir-agent')
        ->assertRedirect('/carrieres');

    $this->get('/devenir-agent/merci')
        ->assertRedirect('/carrieres/merci');
});

test('application requires commune even with job offer', function () {
    $offer = JobOffer::factory()->create();

    $this->post(route('carrieres.store', $offer), [
        'first_name' => 'Test',
        'last_name' => 'Agent',
        'phone' => '+224600000000',
        'consent' => '1',
    ])->assertSessionHasErrors('commune_id');
});
