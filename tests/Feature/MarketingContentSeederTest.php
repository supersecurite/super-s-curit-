<?php

use App\Models\Article;
use App\Models\SecurityTip;
use Database\Seeders\ArticleSeeder;
use Database\Seeders\RoleUserSeeder;
use Database\Seeders\SecurityTipSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('article seeder creates published french articles without faker', function () {
    $this->seed(RoleUserSeeder::class);
    $this->seed(ArticleSeeder::class);

    expect(Article::query()->count())->toBe(6)
        ->and(Article::query()->published()->count())->toBe(6);

    $article = Article::query()
        ->where('title', 'Super Sécurité lance son application mobile de suivi des prestations')
        ->first();

    expect($article)->not->toBeNull()
        ->and($article->status->value)->toBe('published')
        ->and($article->excerpt)->toContain('smartphone')
        ->and($article->content)->toContain('application mobile')
        ->and($article->category)->toBe('Innovation')
        ->and($article->featured)->toBeTrue();
});

test('security tip seeder creates published french tips without faker', function () {
    $this->seed(RoleUserSeeder::class);
    $this->seed(SecurityTipSeeder::class);

    expect(SecurityTip::query()->count())->toBe(6)
        ->and(SecurityTip::query()->published()->count())->toBe(6);

    $tip = SecurityTip::query()
        ->where('title', 'Comment vérifier l\'agrément d\'une société de sécurité en Guinée')
        ->first();

    expect($tip)->not->toBeNull()
        ->and($tip->status->value)->toBe('published')
        ->and($tip->excerpt)->toContain('légalement')
        ->and($tip->content)->toContain('réglementaire')
        ->and($tip->category)->toBe('Prévention')
        ->and($tip->featured)->toBeTrue();
});

test('marketing content seeders are idempotent', function () {
    $this->seed(RoleUserSeeder::class);
    $this->seed(ArticleSeeder::class);
    $this->seed(SecurityTipSeeder::class);
    $this->seed(ArticleSeeder::class);
    $this->seed(SecurityTipSeeder::class);

    expect(Article::query()->count())->toBe(6)
        ->and(SecurityTip::query()->count())->toBe(6);
});
