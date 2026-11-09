<?php

use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\User;
use App\Support\LocalizedCmsContent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
});

test('english article show uses title_en and hides french notice flag', function () {
    $article = Article::factory()->create([
        'title' => 'Titre français',
        'title_en' => 'English title',
        'excerpt' => 'Résumé FR',
        'excerpt_en' => 'English excerpt',
        'content' => '{"root":{"children":[]}}',
        'content_en' => '{"root":{"children":[{"type":"paragraph"}]}}',
        'status' => ArticleStatus::Published,
        'published_at' => now()->subDay(),
    ]);

    $this->get('/en/actualites/'.$article->slug)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/articles/show')
            ->where('locale', 'en')
            ->where('article.title', 'English title')
            ->where('article.excerpt', 'English excerpt')
            ->where('article.is_locale_fallback', false)
            ->where('articleContent', $article->content_en)
        );
});

test('english article without translation falls back to french', function () {
    $article = Article::factory()->create([
        'title' => 'Titre français seul',
        'title_en' => null,
        'excerpt' => 'Résumé FR',
        'status' => ArticleStatus::Published,
        'published_at' => now()->subDay(),
    ]);

    $this->get('/en/actualites/'.$article->slug)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('article.title', 'Titre français seul')
            ->where('article.is_locale_fallback', true)
        );
});

test('sitemap includes en article url only when title_en is present', function () {
    $withEn = Article::factory()->create([
        'title' => 'Avec EN',
        'title_en' => 'With EN',
        'slug' => 'avec-en',
        'status' => ArticleStatus::Published,
        'published_at' => now()->subDay(),
    ]);

    $withoutEn = Article::factory()->create([
        'title' => 'Sans EN',
        'title_en' => null,
        'slug' => 'sans-en',
        'status' => ArticleStatus::Published,
        'published_at' => now()->subDay(),
    ]);

    $xml = $this->get('/sitemap.xml')->assertOk()->getContent();

    expect($xml)
        ->toContain(url('/actualites/'.$withEn->slug))
        ->toContain(url('/en/actualites/'.$withEn->slug))
        ->toContain(url('/actualites/'.$withoutEn->slug))
        ->not->toContain(url('/en/actualites/'.$withoutEn->slug));
});

test('admin can store article with english and chinese fields', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->post(route('articles.store'), [
            'title' => 'Nouvel article',
            'title_en' => 'New article',
            'title_zh' => '新文章',
            'excerpt' => 'Résumé',
            'excerpt_en' => 'Excerpt',
            'excerpt_zh' => '摘要',
            'content' => '{"root":{"children":[]}}',
            'content_en' => '{"root":{"children":[]}}',
            'content_zh' => '{"root":{"children":[]}}',
            'tags' => [],
            'featured' => false,
        ])
        ->assertRedirect(route('articles.index'));

    $article = Article::query()->where('title', 'Nouvel article')->first();

    expect($article)->not->toBeNull()
        ->and($article->title_en)->toBe('New article')
        ->and($article->title_zh)->toBe('新文章')
        ->and($article->excerpt_en)->toBe('Excerpt')
        ->and($article->excerpt_zh)->toBe('摘要');
});

test('localized cms content helper prefers english when available', function () {
    $article = Article::factory()->make([
        'title' => 'FR',
        'title_en' => 'EN',
        'excerpt' => 'ex-fr',
        'excerpt_en' => 'ex-en',
        'content' => 'c-fr',
        'content_en' => 'c-en',
    ]);

    app()->setLocale('en');

    expect(LocalizedCmsContent::for($article))->toMatchArray([
        'title' => 'EN',
        'excerpt' => 'ex-en',
        'content' => 'c-en',
        'is_fallback' => false,
        'has_english' => true,
    ]);
});

test('chinese article show uses title_zh when available', function () {
    $article = Article::factory()->create([
        'title' => 'Titre français',
        'title_zh' => '中文标题',
        'excerpt' => 'Résumé FR',
        'excerpt_zh' => '中文摘要',
        'content' => '{"root":{"children":[]}}',
        'content_zh' => '{"root":{"children":[{"type":"paragraph"}]}}',
        'status' => ArticleStatus::Published,
        'published_at' => now()->subDay(),
    ]);

    $this->get('/zh/actualites/'.$article->slug)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketing/articles/show')
            ->where('locale', 'zh')
            ->where('article.title', '中文标题')
            ->where('article.excerpt', '中文摘要')
            ->where('article.is_locale_fallback', false)
            ->where('articleContent', $article->content_zh)
        );
});

test('sitemap includes zh article url only when title_zh is present', function () {
    $withZh = Article::factory()->create([
        'title' => 'Avec ZH',
        'title_zh' => '有中文',
        'slug' => 'avec-zh',
        'status' => ArticleStatus::Published,
        'published_at' => now()->subDay(),
    ]);

    $withoutZh = Article::factory()->create([
        'title' => 'Sans ZH',
        'title_zh' => null,
        'slug' => 'sans-zh',
        'status' => ArticleStatus::Published,
        'published_at' => now()->subDay(),
    ]);

    $xml = $this->get('/sitemap.xml')->assertOk()->getContent();

    expect($xml)
        ->toContain(url('/actualites/'.$withZh->slug))
        ->toContain(url('/zh/actualites/'.$withZh->slug))
        ->toContain(url('/actualites/'.$withoutZh->slug))
        ->not->toContain(url('/zh/actualites/'.$withoutZh->slug));
});

test('localized cms content helper prefers chinese when available', function () {
    $article = Article::factory()->make([
        'title' => 'FR',
        'title_zh' => 'ZH',
        'excerpt' => 'ex-fr',
        'excerpt_zh' => 'ex-zh',
        'content' => 'c-fr',
        'content_zh' => 'c-zh',
    ]);

    app()->setLocale('zh');

    expect(LocalizedCmsContent::for($article))->toMatchArray([
        'title' => 'ZH',
        'excerpt' => 'ex-zh',
        'content' => 'c-zh',
        'is_fallback' => false,
        'has_chinese' => true,
    ]);
});
