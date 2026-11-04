<?php

use App\Models\JobOffer;
use App\Models\User;
use Database\Seeders\JobOfferSeeder;
use Database\Seeders\RoleUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleUserSeeder::class);
});

test('admin can create a job offer', function () {
    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();

    $response = $this->actingAs($admin)->post(route('offres-emploi.store'), [
        'title' => 'Agent de sécurité',
        'location' => 'Conakry',
        'contract_type' => 'Temps plein',
        'description' => 'Surveillance de sites.',
        'is_active' => '1',
    ]);

    $response->assertRedirect(route('offres-emploi.index'));

    $offer = JobOffer::query()->where('title', 'Agent de sécurité')->first();

    expect($offer)->not->toBeNull()
        ->and($offer->is_active)->toBeTrue()
        ->and($offer->slug)->toBe('agent-de-securite')
        ->and($offer->location)->toBe('Conakry')
        ->and($offer->published_at)->not->toBeNull();
});

test('admin can toggle and delete a job offer', function () {
    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();
    $offer = JobOffer::factory()->create(['title' => 'Superviseur', 'is_active' => true]);

    $this->actingAs($admin)
        ->post(route('offres-emploi.toggle', $offer))
        ->assertRedirect();

    expect($offer->fresh()->is_active)->toBeFalse();

    $this->actingAs($admin)
        ->delete(route('offres-emploi.destroy', $offer))
        ->assertRedirect(route('offres-emploi.index'));

    expect(JobOffer::query()->find($offer->id))->toBeNull()
        ->and(JobOffer::withTrashed()->find($offer->id))->not->toBeNull();
});

test('contributor without job_offers permission is forbidden', function () {
    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();

    $this->actingAs($user)
        ->get(route('offres-emploi.index'))
        ->assertForbidden();

    $this->actingAs($user)
        ->post(route('offres-emploi.store'), [
            'title' => 'Refusé',
            'location' => 'Conakry',
            'contract_type' => 'Temps plein',
        ])
        ->assertForbidden();
});

test('job offer seeder creates default active offers', function () {
    $this->seed(JobOfferSeeder::class);

    expect(JobOffer::query()->count())->toBe(4)
        ->and(JobOffer::query()->active()->count())->toBe(4)
        ->and(JobOffer::query()->where('slug', 'agent-de-securite')->exists())->toBeTrue();
});

test('admin can update a job offer', function () {
    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();
    $offer = JobOffer::factory()->create([
        'title' => 'Ancien titre',
        'location' => 'Boké',
    ]);

    $this->actingAs($admin)
        ->put(route('offres-emploi.update', $offer), [
            'title' => 'Nouveau titre',
            'location' => 'Conakry',
            'contract_type' => 'Temps plein',
            'description' => 'Mise à jour',
            'is_active' => '1',
        ])
        ->assertRedirect(route('offres-emploi.index'));

    $offer->refresh();

    expect($offer->title)->toBe('Nouveau titre')
        ->and($offer->location)->toBe('Conakry')
        ->and($offer->slug)->toBe('nouveau-titre');
});
