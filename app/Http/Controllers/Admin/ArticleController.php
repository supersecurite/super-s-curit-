<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Articles\CreateArticle;
use App\Actions\Articles\UpdateArticle;
use App\Enums\ArticleStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Models\Article;
use App\Models\User;
use App\Support\ArticleStatusTransition;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    private const MAX_FEATURED = 5;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Article::class);

        /** @var User $user */
        $user = $request->user();
        $canApprove = $user->canApproveArticles();

        $tab = $request->string('tab', 'all')->toString();
        if (! $canApprove || ! in_array($tab, ['all', 'pending'], true)) {
            $tab = 'all';
        }

        $query = Article::query()->with(['createdBy', 'approvedBy', 'rejectedBy']);

        if ($tab === 'pending') {
            $query->where('status', ArticleStatus::PendingApproval);
        } elseif ($request->filled('status') && $request->string('status')->toString() !== 'all') {
            $query->where('status', $request->string('status')->toString());
        }

        if ($request->filled('category') && $request->string('category')->toString() !== 'all') {
            $query->where('category', $request->string('category')->toString());
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where('title', 'like', '%'.$search.'%');
        }

        $sortBy = $request->string('sort_by', 'created_at')->toString();
        $sortDirection = $request->string('sort_direction', 'desc')->toString();

        if (! in_array($sortBy, ['published_at', 'title', 'views', 'created_at', 'submitted_at', 'approved_at'], true)) {
            $sortBy = 'created_at';
        }

        if (! in_array($sortDirection, ['asc', 'desc'], true)) {
            $sortDirection = 'desc';
        }

        $query->orderBy($sortBy, $sortDirection);

        return Inertia::render('articles/index', [
            'articles' => $query
                ->paginate(15)
                ->withQueryString()
                ->through(fn (Article $article) => $this->formatArticle($article, $user)),
            'filters' => $request->only(['search', 'category', 'status', 'sort_by', 'sort_direction', 'tab']),
            'tab' => $tab,
            'canApprove' => $canApprove,
            'pendingCount' => $canApprove
                ? Article::query()->where('status', ArticleStatus::PendingApproval)->count()
                : 0,
            'canCreate' => $user->can('create', Article::class),
            'categories' => Article::query()
                ->whereNotNull('category')
                ->distinct()
                ->orderBy('category')
                ->pluck('category')
                ->values()
                ->all(),
            'statuses' => ArticleStatus::options(),
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Article::class);

        return Inertia::render('articles/create', [
            'canApprove' => $request->user()?->canApproveArticles() ?? false,
            'canFeature' => $request->user()?->canFeatureArticles() ?? false,
        ]);
    }

    public function store(
        StoreArticleRequest $request,
        ArticleStatusTransition $statusTransition,
        CreateArticle $createArticle,
    ): RedirectResponse {
        $validated = $request->validated();
        $status = ArticleStatus::PendingApproval;
        $canApprove = $request->user()->canApproveArticles();
        $canFeature = $request->user()->canFeatureArticles();
        $featured = $canFeature && (bool) ($validated['featured'] ?? false);

        $this->ensureFeaturedLimit($featured, status: $status);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('articles/images', 'public');
        } else {
            unset($validated['image']);
        }

        unset($validated['status']);

        $validated['featured'] = $featured;
        $validated['tags'] = $validated['tags'] ?? [];

        if (! $canApprove) {
            unset($validated['published_at']);
        }

        $createArticle->handle($validated, $request->user(), $statusTransition, $status);

        Inertia::flash('toast', ['type' => 'success', 'message' => bt('toasts.article_created')]);

        return to_route('articles.index');
    }

    public function show(Request $request, Article $article): Response
    {
        $this->authorize('view', $article);

        $article->load(['createdBy', 'approvedBy', 'rejectedBy']);

        /** @var User $user */
        $user = $request->user();

        return Inertia::render('articles/show', [
            'article' => $this->formatArticle($article, $user, includeContent: true),
            'canApprove' => $user->canApproveArticles(),
            'publicUrl' => $article->isPublished()
                ? route('actualites.show', $article)
                : null,
        ]);
    }

    public function edit(Request $request, Article $article): Response
    {
        $this->authorize('update', $article);

        $user = $request->user();
        $canApprove = $user->canApproveArticles();

        return Inertia::render('articles/edit', [
            'article' => $this->formatArticle($article, $user, includeContent: true),
            'statusOptions' => $this->statusOptionsFor($article, $canApprove),
            'canApprove' => $canApprove,
            'canFeature' => $user->canFeatureArticles(),
            'publicUrl' => $article->isPublished()
                ? route('actualites.show', $article)
                : null,
        ]);
    }

    public function update(
        UpdateArticleRequest $request,
        Article $article,
        ArticleStatusTransition $statusTransition,
        UpdateArticle $updateArticle,
    ): RedirectResponse {
        $validated = $request->validated();
        $user = $request->user();
        $canApprove = $user->canApproveArticles();
        $canFeature = $user->canFeatureArticles();
        $status = $this->resolveStatusForUpdate($article, ArticleStatus::from($validated['status']), $canApprove);
        $featured = $canFeature && (bool) ($validated['featured'] ?? false);

        if ($article->status !== $status && in_array($status, [ArticleStatus::Published, ArticleStatus::Rejected], true)) {
            $this->authorize('approve', $article);
        }

        $this->ensureFeaturedLimit($featured, $article, $status);

        if ($request->hasFile('image')) {
            if ($article->image !== null) {
                Storage::disk('public')->delete($article->image);
            }

            $validated['image'] = $request->file('image')->store('articles/images', 'public');
        } else {
            unset($validated['image']);
        }

        unset($validated['status']);

        $validated['featured'] = $featured;
        $validated['tags'] = $validated['tags'] ?? [];

        if (! $canApprove) {
            unset($validated['published_at']);
        }

        $updateArticle->handle($article, $validated, $user, $status, $statusTransition);

        Inertia::flash('toast', ['type' => 'success', 'message' => bt('toasts.article_updated')]);

        return to_route('articles.index');
    }

    public function destroy(Article $article): RedirectResponse
    {
        $this->authorize('delete', $article);

        $article->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => bt('toasts.article_archived')]);

        return to_route('articles.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function formatArticle(Article $article, User $viewer, bool $includeContent = false): array
    {
        return [
            ...$article->toAdminArray($includeContent),
            'can_update' => $viewer->can('update', $article),
            'can_delete' => $viewer->can('delete', $article),
            'is_own' => $article->created_by_id === $viewer->id,
        ];
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function statusOptionsFor(Article $article, bool $canApprove): array
    {
        if ($canApprove) {
            return ArticleStatus::options();
        }

        if ($article->status === ArticleStatus::Published) {
            return [
                [
                    'value' => ArticleStatus::Published->value,
                    'label' => ArticleStatus::Published->label(),
                ],
            ];
        }

        if ($article->status === ArticleStatus::Rejected) {
            return [
                [
                    'value' => ArticleStatus::Rejected->value,
                    'label' => ArticleStatus::Rejected->label(),
                ],
                ...ArticleStatus::authorOptions(),
            ];
        }

        return ArticleStatus::authorOptions();
    }

    private function resolveStatusForUpdate(Article $article, ArticleStatus $requested, bool $canApprove): ArticleStatus
    {
        if ($canApprove) {
            return $requested;
        }

        if (in_array($requested, [ArticleStatus::Published, ArticleStatus::Rejected], true)) {
            throw ValidationException::withMessages([
                'status' => 'Vous ne pouvez pas valider ou refuser un article.',
            ]);
        }

        if ($article->status === ArticleStatus::Published) {
            return ArticleStatus::Published;
        }

        if ($article->status === ArticleStatus::Rejected && $requested === ArticleStatus::Draft) {
            return ArticleStatus::Draft;
        }

        if (in_array($requested, [ArticleStatus::Draft, ArticleStatus::PendingApproval], true)) {
            return $requested;
        }

        return $article->status;
    }

    private function ensureFeaturedLimit(bool $featured, ?Article $except = null, ?ArticleStatus $status = null): void
    {
        if (! $featured) {
            return;
        }

        if ($status !== null && $status !== ArticleStatus::Published) {
            throw ValidationException::withMessages([
                'featured' => 'Seuls les articles publiés peuvent être mis à la une.',
            ]);
        }

        $count = Article::query()
            ->where('featured', true)
            ->where('status', ArticleStatus::Published)
            ->when($except !== null, fn ($query) => $query->where('id', '!=', $except->id))
            ->count();

        if ($count >= self::MAX_FEATURED) {
            throw ValidationException::withMessages([
                'featured' => 'Vous ne pouvez pas avoir plus de '.self::MAX_FEATURED.' articles à la une.',
            ]);
        }
    }
}
