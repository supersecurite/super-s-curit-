<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ArticleStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Models\Article;
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

        $tab = $request->string('tab', 'all')->toString();
        if (! in_array($tab, ['all', 'pending'], true)) {
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
                ->through(fn (Article $article) => $this->formatArticle($article)),
            'filters' => $request->only(['search', 'category', 'status', 'sort_by', 'sort_direction', 'tab']),
            'tab' => $tab,
            'pendingCount' => Article::query()
                ->where('status', ArticleStatus::PendingApproval)
                ->count(),
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

    public function create(): Response
    {
        $this->authorize('create', Article::class);

        return Inertia::render('articles/create');
    }

    public function store(StoreArticleRequest $request, ArticleStatusTransition $statusTransition): RedirectResponse
    {
        $validated = $request->validated();
        $status = ArticleStatus::PendingApproval;
        $featured = (bool) ($validated['featured'] ?? false);

        $this->ensureFeaturedLimit($featured, status: $status);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('articles/images', 'public');
        } else {
            unset($validated['image']);
        }

        unset($validated['status']);

        $validated['featured'] = $featured;
        $validated['tags'] = $validated['tags'] ?? [];
        $validated['created_by_id'] = $request->user()->id;

        $article = new Article($validated);
        $statusTransition->apply($article, $status, $request->user());
        $article->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Actualité créée avec succès.']);

        return to_route('articles.index');
    }

    public function edit(Article $article): Response
    {
        $this->authorize('update', $article);

        return Inertia::render('articles/edit', [
            'article' => $this->formatArticle($article, includeContent: true),
            'statusOptions' => ArticleStatus::options(),
        ]);
    }

    public function update(UpdateArticleRequest $request, Article $article, ArticleStatusTransition $statusTransition): RedirectResponse
    {
        $validated = $request->validated();
        $status = ArticleStatus::from($validated['status']);
        $featured = (bool) ($validated['featured'] ?? false);

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

        $article->fill($validated);

        if ($article->status !== $status) {
            $statusTransition->apply($article, $status, $request->user());
        }

        $article->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Actualité mise à jour avec succès.']);

        return to_route('articles.index');
    }

    public function destroy(Article $article): RedirectResponse
    {
        $this->authorize('delete', $article);

        $article->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Actualité archivée avec succès.']);

        return to_route('articles.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function formatArticle(Article $article, bool $includeContent = false): array
    {
        return $article->toAdminArray($includeContent);
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
