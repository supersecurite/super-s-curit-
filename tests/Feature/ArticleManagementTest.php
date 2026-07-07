<?php

use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests cannot access article management', function () {
    $this->get(route('articles.index'))->assertRedirect(route('login'));
});

test('regular users without articles permission cannot access article management', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('articles.index'))
        ->assertForbidden();
});

test('contributors can access article management', function () {
    $user = User::factory()->contributor()->create();

    $this->actingAs($user)
        ->get(route('articles.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('articles/index')
            ->where('canApprove', false)
            ->where('pendingCount', 0)
        );
});

test('regular users see all articles but only manage their own', function () {
    $user = User::factory()->contributor()->create();
    $other = User::factory()->contributor()->create();
    Article::factory()->create(['created_by_id' => $other->id, 'title' => 'Article tiers']);
    Article::factory()->pendingApproval()->create([
        'created_by_id' => $user->id,
        'title' => 'Mon article',
    ]);

    $response = $this->actingAs($user)
        ->get(route('articles.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('articles/index')
            ->has('articles.data', 2)
        );

    $articles = collect($response->original->getData()['page']['props']['articles']['data']);

    expect($articles->firstWhere('title', 'Mon article')['can_update'])->toBeTrue()
        ->and($articles->firstWhere('title', 'Mon article')['can_delete'])->toBeTrue()
        ->and($articles->firstWhere('title', 'Mon article')['is_own'])->toBeTrue()
        ->and($articles->firstWhere('title', 'Article tiers')['can_update'])->toBeFalse()
        ->and($articles->firstWhere('title', 'Article tiers')['can_delete'])->toBeFalse()
        ->and($articles->firstWhere('title', 'Article tiers')['is_own'])->toBeFalse();
});

test('regular users can create articles pending approval', function () {
    $user = User::factory()->contributor()->create();

    $this->actingAs($user)
        ->post(route('articles.store'), [
            'title' => 'Actualité utilisateur',
            'excerpt' => 'Résumé',
            'content' => json_encode([
                'root' => [
                    'type' => 'root',
                    'children' => [
                        [
                            'type' => 'paragraph',
                            'children' => [
                                ['type' => 'text', 'text' => 'Contenu'],
                            ],
                        ],
                    ],
                ],
            ]),
            'featured' => true,
            'published_at' => now()->toDateString(),
        ])
        ->assertRedirect(route('articles.index'));

    $article = Article::query()->where('title', 'Actualité utilisateur')->first();

    expect($article)->not->toBeNull()
        ->and($article->status)->toBe(ArticleStatus::PendingApproval)
        ->and($article->created_by_id)->toBe($user->id)
        ->and($article->featured)->toBeFalse()
        ->and($article->approved_by_id)->toBeNull();
});

test('regular users cannot edit another users article', function () {
    $user = User::factory()->contributor()->create();
    $article = Article::factory()->pendingApproval()->create([
        'created_by_id' => User::factory()->contributor()->create()->id,
    ]);

    $this->actingAs($user)
        ->get(route('articles.edit', $article))
        ->assertForbidden();
});

test('authenticated users can view article details by slug', function () {
    $user = User::factory()->contributor()->create();
    $article = Article::factory()->pendingApproval()->create([
        'title' => 'Article détail',
        'created_by_id' => User::factory()->contributor()->create()->id,
    ]);

    $this->actingAs($user)
        ->get(route('articles.show', $article->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('articles/show')
            ->where('article.title', 'Article détail')
            ->where('article.slug', $article->slug)
            ->where('article.can_update', false)
            ->where('publicUrl', null)
        );
});

test('published articles expose public preview url on detail page', function () {
    $user = User::factory()->contributor()->create();
    $article = Article::factory()->published()->create();

    $this->actingAs($user)
        ->get(route('articles.show', $article->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('publicUrl', route('actualites.show', $article))
        );
});

test('published articles expose public url on edit page', function () {
    $user = User::factory()->contributor()->create();
    $article = Article::factory()->published()->create([
        'created_by_id' => $user->id,
    ]);

    $this->actingAs($user)
        ->get(route('articles.edit', $article->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('articles/edit')
            ->where('publicUrl', route('actualites.show', $article))
        );
});

test('draft articles do not expose public url on edit page', function () {
    $user = User::factory()->contributor()->create();
    $article = Article::factory()->pendingApproval()->create([
        'created_by_id' => $user->id,
    ]);

    $this->actingAs($user)
        ->get(route('articles.edit', $article->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('publicUrl', null)
        );
});

test('guests cannot view back-office article details', function () {
    $article = Article::factory()->create();

    $this->get(route('articles.show', $article->slug))
        ->assertRedirect(route('login'));
});

test('regular users cannot publish articles by forging status', function () {
    $user = User::factory()->contributor()->create();
    $article = Article::factory()->pendingApproval()->create([
        'created_by_id' => $user->id,
    ]);

    $this->actingAs($user)
        ->put(route('articles.update', $article), [
            'title' => $article->title,
            'status' => ArticleStatus::Published->value,
            'content' => $article->content,
        ])
        ->assertSessionHasErrors('status');

    $article->refresh();

    expect($article->status)->toBe(ArticleStatus::PendingApproval);
});

test('regular users can resubmit rejected articles for approval', function () {
    $user = User::factory()->contributor()->create();
    $article = Article::factory()->rejected()->create([
        'created_by_id' => $user->id,
    ]);

    $this->actingAs($user)
        ->put(route('articles.update', $article), [
            'title' => 'Article corrigé',
            'status' => ArticleStatus::PendingApproval->value,
            'content' => $article->content,
        ])
        ->assertRedirect(route('articles.index'));

    $article->refresh();

    expect($article->status)->toBe(ArticleStatus::PendingApproval)
        ->and($article->title)->toBe('Article corrigé')
        ->and($article->submitted_at)->not->toBeNull();
});

test('regular users cannot delete published articles', function () {
    $user = User::factory()->contributor()->create();
    $article = Article::factory()->published()->create([
        'created_by_id' => $user->id,
    ]);

    $this->actingAs($user)
        ->delete(route('articles.destroy', $article))
        ->assertForbidden();
});

test('regular users cannot access pending approval tab', function () {
    $user = User::factory()->contributor()->create();
    Article::factory()->pendingApproval()->create(['created_by_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('articles.index', ['tab' => 'pending']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('tab', 'all')
        );
});

test('admins can list articles', function () {
    $admin = User::factory()->admin()->create();
    Article::factory()->count(2)->create();

    $this->actingAs($admin)
        ->get(route('articles.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('articles/index')
            ->has('articles.data', 2)
            ->has('statuses', 4)
            ->where('canApprove', true)
            ->where('tab', 'all')
            ->where('pendingCount', 0)
        );
});

test('admins can filter pending approval tab with badge count', function () {
    $admin = User::factory()->admin()->create();
    Article::factory()->count(2)->create();
    Article::factory()->pendingApproval()->count(3)->create();

    $this->actingAs($admin)
        ->get(route('articles.index', ['tab' => 'pending']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('articles/index')
            ->where('tab', 'pending')
            ->where('pendingCount', 3)
            ->has('articles.data', 3)
            ->where('articles.data.0.status', ArticleStatus::PendingApproval->value)
        );
});

test('admins can create articles pending approval with author tracking', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('articles.store'), [
            'title' => 'Nouvelle actualité sécurité',
            'excerpt' => 'Résumé de test',
            'content' => json_encode([
                'root' => [
                    'type' => 'root',
                    'children' => [
                        [
                            'type' => 'paragraph',
                            'children' => [
                                ['type' => 'text', 'text' => 'Contenu de test'],
                            ],
                        ],
                    ],
                ],
            ]),
            'category' => 'Sécurité',
            'tags' => ['gardiennage', 'conakry'],
            'featured' => false,
        ])
        ->assertRedirect(route('articles.index'));

    $article = Article::query()->where('title', 'Nouvelle actualité sécurité')->first();

    expect($article)->not->toBeNull()
        ->and($article->slug)->toBe('nouvelle-actualite-securite')
        ->and($article->status)->toBe(ArticleStatus::PendingApproval)
        ->and($article->created_by_id)->toBe($admin->id)
        ->and($article->submitted_at)->not->toBeNull()
        ->and($article->approved_by_id)->toBeNull();
});

test('admins can approve articles by changing status to published', function () {
    $author = User::factory()->admin()->create(['name' => 'Auteur Admin']);
    $validator = User::factory()->admin()->create(['name' => 'Validateur Admin']);
    $article = Article::factory()->pendingApproval()->create([
        'title' => 'Article à valider',
        'created_by_id' => $author->id,
    ]);

    $this->actingAs($validator)
        ->put(route('articles.update', $article), [
            'title' => $article->title,
            'status' => ArticleStatus::Published->value,
            'excerpt' => $article->excerpt,
            'content' => $article->content,
            'category' => $article->category,
            'tags' => $article->tags,
            'featured' => false,
            'published_at' => now()->toDateString(),
        ])
        ->assertRedirect(route('articles.index'));

    $article->refresh();

    expect($article->status)->toBe(ArticleStatus::Published)
        ->and($article->approved_by_id)->toBe($validator->id)
        ->and($article->approved_at)->not->toBeNull()
        ->and($article->created_by_id)->toBe($author->id);
});

test('admins can reject articles with rejection tracking', function () {
    $validator = User::factory()->admin()->create();
    $article = Article::factory()->pendingApproval()->create();

    $this->actingAs($validator)
        ->put(route('articles.update', $article), [
            'title' => $article->title,
            'status' => ArticleStatus::Rejected->value,
            'content' => $article->content,
            'featured' => false,
        ])
        ->assertRedirect(route('articles.index'));

    $article->refresh();

    expect($article->status)->toBe(ArticleStatus::Rejected)
        ->and($article->rejected_by_id)->toBe($validator->id)
        ->and($article->rejected_at)->not->toBeNull();
});

test('admins can update articles', function () {
    $admin = User::factory()->admin()->create();
    $article = Article::factory()->create(['title' => 'Titre initial']);

    $this->actingAs($admin)
        ->put(route('articles.update', $article), [
            'title' => 'Titre mis à jour',
            'status' => ArticleStatus::Published->value,
            'excerpt' => 'Nouveau résumé',
            'content' => $article->content,
            'category' => 'Événements',
            'tags' => ['surveillance'],
            'featured' => true,
            'published_at' => now()->toDateString(),
        ])
        ->assertRedirect(route('articles.index'));

    $article->refresh();

    expect($article->title)->toBe('Titre mis à jour')
        ->and($article->slug)->toBe('titre-mis-a-jour')
        ->and($article->featured)->toBeTrue();
});

test('admins soft delete articles', function () {
    Storage::fake('public');
    $admin = User::factory()->admin()->create();
    $article = Article::factory()->create([
        'image' => 'articles/images/test.jpg',
    ]);

    Storage::disk('public')->put('articles/images/test.jpg', 'fake');

    $this->actingAs($admin)
        ->delete(route('articles.destroy', $article))
        ->assertRedirect(route('articles.index'));

    expect(Article::query()->find($article->id))->toBeNull()
        ->and(Article::withTrashed()->find($article->id))->not->toBeNull();
});

test('created articles always start as pending approval even if status is forged', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('articles.store'), [
            'title' => 'Tentative publication directe',
            'status' => ArticleStatus::Published->value,
        ])
        ->assertRedirect(route('articles.index'));

    $article = Article::query()->where('title', 'Tentative publication directe')->first();

    expect($article)->not->toBeNull()
        ->and($article->status)->toBe(ArticleStatus::PendingApproval)
        ->and($article->submitted_at)->not->toBeNull();
});

test('featured articles are limited to five published articles', function () {
    $admin = User::factory()->admin()->create();
    Article::factory()->count(5)->featured()->published()->create();
    $article = Article::factory()->pendingApproval()->create(['title' => 'Sixième à la une']);

    $this->actingAs($admin)
        ->put(route('articles.update', $article), [
            'title' => $article->title,
            'status' => ArticleStatus::Published->value,
            'featured' => true,
            'published_at' => now()->toDateString(),
        ])
        ->assertSessionHasErrors('featured');
});

test('non published articles cannot be featured on create', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('articles.store'), [
            'title' => 'Article à la une à la création',
            'featured' => true,
        ])
        ->assertSessionHasErrors('featured');
});
