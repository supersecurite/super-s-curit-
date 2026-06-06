<?php

use App\Enums\ArticleStatus;
use App\Models\SecurityTip;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests cannot access security tip management', function () {
    $this->get(route('conseils.index'))->assertRedirect(route('login'));
});

test('regular users can access security tip management', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('conseils.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('conseils/index')
            ->where('canApprove', false)
            ->where('pendingCount', 0)
        );
});

test('regular users see all security tips but only manage their own', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    SecurityTip::factory()->create([
        'created_by_id' => $other->id,
        'title' => 'Conseil tiers',
    ]);
    SecurityTip::factory()->pendingApproval()->create([
        'created_by_id' => $user->id,
        'title' => 'Mon conseil',
    ]);

    $response = $this->actingAs($user)
        ->get(route('conseils.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('conseils/index')
            ->has('securityTips.data', 2)
        );

    $securityTips = collect($response->original->getData()['page']['props']['securityTips']['data']);

    expect($securityTips->firstWhere('title', 'Mon conseil')['can_update'])->toBeTrue()
        ->and($securityTips->firstWhere('title', 'Mon conseil')['can_delete'])->toBeTrue()
        ->and($securityTips->firstWhere('title', 'Mon conseil')['is_own'])->toBeTrue()
        ->and($securityTips->firstWhere('title', 'Conseil tiers')['can_update'])->toBeFalse()
        ->and($securityTips->firstWhere('title', 'Conseil tiers')['can_delete'])->toBeFalse()
        ->and($securityTips->firstWhere('title', 'Conseil tiers')['is_own'])->toBeFalse();
});

test('regular users can create security tips pending approval', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('conseils.store'), [
            'title' => 'Conseil utilisateur',
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
        ->assertRedirect(route('conseils.index'));

    $securityTip = SecurityTip::query()->where('title', 'Conseil utilisateur')->first();

    expect($securityTip)->not->toBeNull()
        ->and($securityTip->status)->toBe(ArticleStatus::PendingApproval)
        ->and($securityTip->created_by_id)->toBe($user->id)
        ->and($securityTip->featured)->toBeFalse()
        ->and($securityTip->approved_by_id)->toBeNull();
});

test('regular users cannot edit another users security tip', function () {
    $user = User::factory()->create();
    $securityTip = SecurityTip::factory()->pendingApproval()->create([
        'created_by_id' => User::factory()->create()->id,
    ]);

    $this->actingAs($user)
        ->get(route('conseils.edit', $securityTip->slug))
        ->assertForbidden();
});

test('authenticated users can view security tip details by slug', function () {
    $user = User::factory()->create();
    $securityTip = SecurityTip::factory()->pendingApproval()->create([
        'title' => 'Conseil détail',
        'created_by_id' => User::factory()->create()->id,
    ]);

    $this->actingAs($user)
        ->get(route('conseils.show', $securityTip->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('conseils/show')
            ->where('securityTip.title', 'Conseil détail')
            ->where('securityTip.slug', $securityTip->slug)
            ->where('securityTip.can_update', false)
            ->where('publicUrl', null)
        );
});

test('published security tips expose public preview url on detail page', function () {
    $user = User::factory()->create();
    $securityTip = SecurityTip::factory()->published()->create();

    $this->actingAs($user)
        ->get(route('conseils.show', $securityTip->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('publicUrl', route('conseils-securite.show', $securityTip))
        );
});

test('guests cannot view back-office security tip details', function () {
    $securityTip = SecurityTip::factory()->create();

    $this->get(route('conseils.show', $securityTip->slug))
        ->assertRedirect(route('login'));
});

test('regular users cannot publish security tips by forging status', function () {
    $user = User::factory()->create();
    $securityTip = SecurityTip::factory()->pendingApproval()->create([
        'created_by_id' => $user->id,
    ]);

    $this->actingAs($user)
        ->put(route('conseils.update', $securityTip), [
            'title' => $securityTip->title,
            'status' => ArticleStatus::Published->value,
            'content' => $securityTip->content,
        ])
        ->assertSessionHasErrors('status');

    $securityTip->refresh();

    expect($securityTip->status)->toBe(ArticleStatus::PendingApproval);
});

test('regular users can resubmit rejected security tips for approval', function () {
    $user = User::factory()->create();
    $securityTip = SecurityTip::factory()->rejected()->create([
        'created_by_id' => $user->id,
    ]);

    $this->actingAs($user)
        ->put(route('conseils.update', $securityTip), [
            'title' => 'Conseil corrigé',
            'status' => ArticleStatus::PendingApproval->value,
            'content' => $securityTip->content,
        ])
        ->assertRedirect(route('conseils.index'));

    $securityTip->refresh();

    expect($securityTip->status)->toBe(ArticleStatus::PendingApproval)
        ->and($securityTip->title)->toBe('Conseil corrigé')
        ->and($securityTip->submitted_at)->not->toBeNull();
});

test('regular users cannot delete published security tips', function () {
    $user = User::factory()->create();
    $securityTip = SecurityTip::factory()->published()->create([
        'created_by_id' => $user->id,
    ]);

    $this->actingAs($user)
        ->delete(route('conseils.destroy', $securityTip))
        ->assertForbidden();
});

test('regular users cannot access pending approval tab', function () {
    $user = User::factory()->create();
    SecurityTip::factory()->pendingApproval()->create(['created_by_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('conseils.index', ['tab' => 'pending']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('tab', 'all')
        );
});

test('admins can list security tips', function () {
    $admin = User::factory()->admin()->create();
    SecurityTip::factory()->count(2)->create();

    $this->actingAs($admin)
        ->get(route('conseils.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('conseils/index')
            ->has('securityTips.data', 2)
            ->has('statuses', 4)
            ->where('canApprove', true)
            ->where('tab', 'all')
            ->where('pendingCount', 0)
        );
});

test('admins can filter pending approval tab with badge count', function () {
    $admin = User::factory()->admin()->create();
    SecurityTip::factory()->count(2)->create();
    SecurityTip::factory()->pendingApproval()->count(3)->create();

    $this->actingAs($admin)
        ->get(route('conseils.index', ['tab' => 'pending']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('conseils/index')
            ->where('tab', 'pending')
            ->where('pendingCount', 3)
            ->has('securityTips.data', 3)
            ->where('securityTips.data.0.status', ArticleStatus::PendingApproval->value)
        );
});

test('admins can create security tips pending approval with author tracking', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('conseils.store'), [
            'title' => 'Nouveau conseil sécurité',
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
            'category' => 'Gardiennage',
            'tags' => ['gardiennage', 'conakry'],
            'featured' => false,
        ])
        ->assertRedirect(route('conseils.index'));

    $securityTip = SecurityTip::query()->where('title', 'Nouveau conseil sécurité')->first();

    expect($securityTip)->not->toBeNull()
        ->and($securityTip->slug)->toBe('nouveau-conseil-securite')
        ->and($securityTip->status)->toBe(ArticleStatus::PendingApproval)
        ->and($securityTip->created_by_id)->toBe($admin->id)
        ->and($securityTip->submitted_at)->not->toBeNull()
        ->and($securityTip->approved_by_id)->toBeNull();
});

test('admins can approve security tips by changing status to published', function () {
    $author = User::factory()->admin()->create(['name' => 'Auteur Admin']);
    $validator = User::factory()->admin()->create(['name' => 'Validateur Admin']);
    $securityTip = SecurityTip::factory()->pendingApproval()->create([
        'title' => 'Conseil à valider',
        'created_by_id' => $author->id,
    ]);

    $this->actingAs($validator)
        ->put(route('conseils.update', $securityTip), [
            'title' => $securityTip->title,
            'status' => ArticleStatus::Published->value,
            'excerpt' => $securityTip->excerpt,
            'content' => $securityTip->content,
            'category' => $securityTip->category,
            'tags' => $securityTip->tags,
            'featured' => false,
            'published_at' => now()->toDateString(),
        ])
        ->assertRedirect(route('conseils.index'));

    $securityTip->refresh();

    expect($securityTip->status)->toBe(ArticleStatus::Published)
        ->and($securityTip->approved_by_id)->toBe($validator->id)
        ->and($securityTip->approved_at)->not->toBeNull()
        ->and($securityTip->created_by_id)->toBe($author->id);
});

test('admins can reject security tips with rejection tracking', function () {
    $validator = User::factory()->admin()->create();
    $securityTip = SecurityTip::factory()->pendingApproval()->create();

    $this->actingAs($validator)
        ->put(route('conseils.update', $securityTip), [
            'title' => $securityTip->title,
            'status' => ArticleStatus::Rejected->value,
            'content' => $securityTip->content,
            'featured' => false,
        ])
        ->assertRedirect(route('conseils.index'));

    $securityTip->refresh();

    expect($securityTip->status)->toBe(ArticleStatus::Rejected)
        ->and($securityTip->rejected_by_id)->toBe($validator->id)
        ->and($securityTip->rejected_at)->not->toBeNull();
});

test('admins can update security tips', function () {
    $admin = User::factory()->admin()->create();
    $securityTip = SecurityTip::factory()->create(['title' => 'Titre initial']);

    $this->actingAs($admin)
        ->put(route('conseils.update', $securityTip), [
            'title' => 'Titre mis à jour',
            'status' => ArticleStatus::Published->value,
            'excerpt' => 'Nouveau résumé',
            'content' => $securityTip->content,
            'category' => 'Surveillance',
            'tags' => ['surveillance'],
            'featured' => true,
            'published_at' => now()->toDateString(),
        ])
        ->assertRedirect(route('conseils.index'));

    $securityTip->refresh();

    expect($securityTip->title)->toBe('Titre mis à jour')
        ->and($securityTip->slug)->toBe('titre-mis-a-jour')
        ->and($securityTip->featured)->toBeTrue();
});

test('admins soft delete security tips', function () {
    Storage::fake('public');
    $admin = User::factory()->admin()->create();
    $securityTip = SecurityTip::factory()->create([
        'image' => 'security-tips/images/test.jpg',
    ]);

    Storage::disk('public')->put('security-tips/images/test.jpg', 'fake');

    $this->actingAs($admin)
        ->delete(route('conseils.destroy', $securityTip))
        ->assertRedirect(route('conseils.index'));

    expect(SecurityTip::query()->find($securityTip->id))->toBeNull()
        ->and(SecurityTip::withTrashed()->find($securityTip->id))->not->toBeNull();
});

test('created security tips always start as pending approval even if status is forged', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('conseils.store'), [
            'title' => 'Tentative publication directe',
            'status' => ArticleStatus::Published->value,
        ])
        ->assertRedirect(route('conseils.index'));

    $securityTip = SecurityTip::query()->where('title', 'Tentative publication directe')->first();

    expect($securityTip)->not->toBeNull()
        ->and($securityTip->status)->toBe(ArticleStatus::PendingApproval)
        ->and($securityTip->submitted_at)->not->toBeNull();
});

test('featured security tips are limited to five published tips', function () {
    $admin = User::factory()->admin()->create();
    SecurityTip::factory()->count(5)->featured()->published()->create();
    $securityTip = SecurityTip::factory()->pendingApproval()->create(['title' => 'Sixième à la une']);

    $this->actingAs($admin)
        ->put(route('conseils.update', $securityTip), [
            'title' => $securityTip->title,
            'status' => ArticleStatus::Published->value,
            'featured' => true,
            'published_at' => now()->toDateString(),
        ])
        ->assertSessionHasErrors('featured');
});

test('non published security tips cannot be featured on create', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('conseils.store'), [
            'title' => 'Conseil à la une à la création',
            'featured' => true,
        ])
        ->assertSessionHasErrors('featured');
});

test('published security tips expose public url on edit page', function () {
    $admin = User::factory()->admin()->create();
    $securityTip = SecurityTip::factory()->published()->create();

    $this->actingAs($admin)
        ->get(route('conseils.edit', $securityTip))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('conseils/edit')
            ->where('publicUrl', route('conseils-securite.show', $securityTip))
        );
});

test('draft security tips do not expose public url on edit page', function () {
    $admin = User::factory()->admin()->create();
    $securityTip = SecurityTip::factory()->pendingApproval()->create();

    $this->actingAs($admin)
        ->get(route('conseils.edit', $securityTip))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('publicUrl', null)
        );
});
