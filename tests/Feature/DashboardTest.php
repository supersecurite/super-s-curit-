<?php

use App\Models\Article;
use App\Models\SecurityTip;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('regular users receive personal content statistics', function () {
    $user = User::factory()->create();
    Article::factory()->count(2)->pendingApproval()->create([
        'created_by_id' => $user->id,
    ]);
    Article::factory()->published()->create([
        'created_by_id' => $user->id,
        'views' => 42,
    ]);
    SecurityTip::factory()->rejected()->create([
        'created_by_id' => $user->id,
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('overview.is_admin', false)
            ->where('stats.articles.total', 3)
            ->where('stats.articles.published', 1)
            ->where('stats.articles.pending', 2)
            ->where('stats.tips.rejected', 1)
            ->has('recentArticles', 3)
            ->has('recentTips', 1)
            ->missing('trafficChart')
            ->missing('recentApplications')
        );
});

test('admin users receive dashboard statistics', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('overview.is_admin', true)
            ->has('stats.visits.views')
            ->has('stats.content.articles_published')
            ->has('stats.applications.pending')
            ->has('trafficChart', 7)
            ->has('recentApplications'));
});
