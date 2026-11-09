<?php

use App\Models\JobOffer;
use App\Models\User;
use Database\Seeders\JobOfferSeeder;
use Database\Seeders\RoleUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    $this->seed(RoleUserSeeder::class);
});

test('admin can create a job offer', function () {
    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();

    $response = $this->actingAs($admin)->post(route('offres-emploi.store'), [
        'title' => 'Agent de sécurité',
        'title_en' => 'Security officer',
        'title_zh' => '保安员',
        'location' => 'Conakry',
        'location_en' => 'Conakry',
        'location_zh' => '科纳克里',
        'contract_type' => 'Temps plein',
        'contract_type_en' => 'Full time',
        'contract_type_zh' => '全职',
        'description' => 'Surveillance de sites.',
        'description_en' => 'Site surveillance.',
        'description_zh' => '现场监视。',
        'is_active' => '1',
    ]);

    $response->assertRedirect(route('offres-emploi.index'));

    $offer = JobOffer::query()->where('title', 'Agent de sécurité')->first();

    expect($offer)->not->toBeNull()
        ->and($offer->is_active)->toBeTrue()
        ->and($offer->slug)->toBe('agent-de-securite')
        ->and($offer->location)->toBe('Conakry')
        ->and($offer->title_en)->toBe('Security officer')
        ->and($offer->title_zh)->toBe('保安员')
        ->and($offer->contract_type_en)->toBe('Full time')
        ->and($offer->contract_type_zh)->toBe('全职')
        ->and($offer->description_en)->toBe('Site surveillance.')
        ->and($offer->description_zh)->toBe('现场监视。')
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
            'title_en' => 'New title',
            'title_zh' => '新标题',
            'location' => 'Conakry',
            'location_en' => 'Conakry',
            'location_zh' => '科纳克里',
            'contract_type' => 'Temps plein',
            'contract_type_en' => 'Full time',
            'contract_type_zh' => '全职',
            'description' => 'Mise à jour',
            'description_en' => 'Updated description',
            'description_zh' => '更新说明',
            'is_active' => '1',
        ])
        ->assertRedirect(route('offres-emploi.index'));

    $offer->refresh();

    expect($offer->title)->toBe('Nouveau titre')
        ->and($offer->title_en)->toBe('New title')
        ->and($offer->title_zh)->toBe('新标题')
        ->and($offer->location)->toBe('Conakry')
        ->and($offer->description_en)->toBe('Updated description')
        ->and($offer->description_zh)->toBe('更新说明')
        ->and($offer->slug)->toBe('nouveau-titre');
});

test('edit form exposes english and chinese translation fields', function () {
    $admin = User::query()->where('email', 'admin@supersecurite.com')->firstOrFail();
    $offer = JobOffer::factory()->create([
        'title' => 'Agent FR',
        'title_en' => 'Agent EN',
        'title_zh' => '特工',
        'description_en' => 'English body',
        'description_zh' => '中文内容',
    ]);

    $this->actingAs($admin)
        ->get(route('offres-emploi.edit', $offer))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('offres-emploi/edit')
            ->where('offer.title_en', 'Agent EN')
            ->where('offer.title_zh', '特工')
            ->where('offer.description_en', 'English body')
            ->where('offer.description_zh', '中文内容')
        );
});
