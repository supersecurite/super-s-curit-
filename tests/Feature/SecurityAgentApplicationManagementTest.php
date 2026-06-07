<?php

use App\Enums\SecurityAgentApplicationStatus;
use App\Enums\SecurityAgentPost;
use App\Mail\SecurityAgentApplicationReceived;
use App\Models\SecurityAgentApplication;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests cannot access agent applications admin', function () {
    $this->get(route('candidatures-agents.index'))->assertRedirect(route('login'));
});

test('regular users cannot access agent applications admin', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('candidatures-agents.index'))
        ->assertForbidden();
});

test('admins can list agent applications with pending count', function () {
    $admin = User::factory()->admin()->create();
    SecurityAgentApplication::factory()->count(2)->create();
    SecurityAgentApplication::factory()->contacted()->create();

    $this->actingAs($admin)
        ->get(route('candidatures-agents.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('candidatures-agents/index')
            ->has('applications.data', 3)
            ->where('pendingCount', 2)
            ->has('posts', 6)
        );
});

test('admins can filter applications by post', function () {
    $admin = User::factory()->admin()->create();
    SecurityAgentApplication::factory()->create(['post' => SecurityAgentPost::Agent]);
    SecurityAgentApplication::factory()->create(['post' => SecurityAgentPost::Superviseur]);

    $this->actingAs($admin)
        ->get(route('candidatures-agents.index', ['post' => 'superviseur']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('applications.data', 1)
            ->where('applications.data.0.post', 'superviseur')
            ->where('applications.data.0.post_label', 'Superviseur')
        );
});

test('admins can filter applications by prefecture', function () {
    $admin = User::factory()->admin()->create();
    SecurityAgentApplication::factory()->create(['prefecture_id' => '10']);
    SecurityAgentApplication::factory()->create([
        'prefecture_id' => '52',
        'prefecture_name' => 'Dubréka',
        'commune_id' => null,
        'commune_name' => null,
        'quartier_id' => null,
        'quartier_name' => null,
    ]);

    $this->actingAs($admin)
        ->get(route('candidatures-agents.index', ['prefecture_id' => '10']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('applications.data', 1)
            ->where('applications.data.0.prefecture_id', '10')
        );
});

test('admins can view application detail', function () {
    $admin = User::factory()->admin()->create();
    $application = SecurityAgentApplication::factory()->create([
        'first_name' => 'Alpha',
        'last_name' => 'Bah',
    ]);

    $this->actingAs($admin)
        ->get(route('candidatures-agents.show', $application))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('candidatures-agents/show')
            ->where('application.full_name', 'Alpha Bah')
            ->where('application.post_label', fn ($label) => $label !== null)
        );
});

test('admins can update application status and notes', function () {
    $admin = User::factory()->admin()->create();
    $application = SecurityAgentApplication::factory()->create();

    $this->actingAs($admin)
        ->put(route('candidatures-agents.update', $application), [
            'status' => SecurityAgentApplicationStatus::Contacted->value,
            'internal_notes' => 'Rappeler lundi matin',
        ])
        ->assertRedirect(route('candidatures-agents.show', $application));

    $application->refresh();

    expect($application->status)->toBe(SecurityAgentApplicationStatus::Contacted)
        ->and($application->internal_notes)->toBe('Rappeler lundi matin')
        ->and($application->reviewed_by_id)->toBe($admin->id)
        ->and($application->contacted_at)->not->toBeNull();
});

test('public submission sends notification mail', function () {
    Mail::fake();

    $this->post(route('devenir-agent.store'), [
        'first_name' => 'Mail',
        'last_name' => 'Test',
        'phone' => '+224612000000',
        'post' => 'coordinateur',
        'region_id' => '1',
        'prefecture_id' => '10',
        'commune_id' => '104',
        'consent' => '1',
    ])->assertRedirect(route('devenir-agent.merci'));

    Mail::assertSent(SecurityAgentApplicationReceived::class);
});
