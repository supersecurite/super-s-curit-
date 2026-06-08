<?php

use App\Models\Article;
use App\Models\SecurityTip;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('homepage shares featured articles and security tips', function () {
    Article::factory()->count(2)->featured()->published()->create();
    Article::factory()->featured()->pendingApproval()->create();

    SecurityTip::factory()->count(2)->featured()->published()->create();
    SecurityTip::factory()->featured()->pendingApproval()->create();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/home')
            ->has('featuredArticles', 2)
            ->has('featuredSecurityTips', 2)
        );
});
