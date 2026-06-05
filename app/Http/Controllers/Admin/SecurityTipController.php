<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ArticleStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSecurityTipRequest;
use App\Http\Requests\UpdateSecurityTipRequest;
use App\Models\SecurityTip;
use App\Support\SecurityTipStatusTransition;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class SecurityTipController extends Controller
{
    private const MAX_FEATURED = 5;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', SecurityTip::class);

        $tab = $request->string('tab', 'all')->toString();
        if (! in_array($tab, ['all', 'pending'], true)) {
            $tab = 'all';
        }

        $query = SecurityTip::query()->with(['createdBy', 'approvedBy', 'rejectedBy']);

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

        return Inertia::render('conseils/index', [
            'securityTips' => $query
                ->paginate(15)
                ->withQueryString()
                ->through(fn (SecurityTip $securityTip) => $this->formatSecurityTip($securityTip)),
            'filters' => $request->only(['search', 'category', 'status', 'sort_by', 'sort_direction', 'tab']),
            'tab' => $tab,
            'pendingCount' => SecurityTip::query()
                ->where('status', ArticleStatus::PendingApproval)
                ->count(),
            'categories' => SecurityTip::query()
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
        $this->authorize('create', SecurityTip::class);

        return Inertia::render('conseils/create');
    }

    public function store(StoreSecurityTipRequest $request, SecurityTipStatusTransition $statusTransition): RedirectResponse
    {
        $validated = $request->validated();
        $status = ArticleStatus::PendingApproval;
        $featured = (bool) ($validated['featured'] ?? false);

        $this->ensureFeaturedLimit($featured, status: $status);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('security-tips/images', 'public');
        } else {
            unset($validated['image']);
        }

        unset($validated['status']);

        $validated['featured'] = $featured;
        $validated['tags'] = $validated['tags'] ?? [];
        $validated['created_by_id'] = $request->user()->id;

        $securityTip = new SecurityTip($validated);
        $statusTransition->apply($securityTip, $status, $request->user());
        $securityTip->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Conseil créé avec succès.']);

        return to_route('conseils.index');
    }

    public function edit(SecurityTip $conseil): Response
    {
        $this->authorize('update', $conseil);

        return Inertia::render('conseils/edit', [
            'securityTip' => $this->formatSecurityTip($conseil, includeContent: true),
            'statusOptions' => ArticleStatus::options(),
        ]);
    }

    public function update(UpdateSecurityTipRequest $request, SecurityTip $conseil, SecurityTipStatusTransition $statusTransition): RedirectResponse
    {
        $validated = $request->validated();
        $status = ArticleStatus::from($validated['status']);
        $featured = (bool) ($validated['featured'] ?? false);

        $this->ensureFeaturedLimit($featured, $conseil, $status);

        if ($request->hasFile('image')) {
            if ($conseil->image !== null) {
                Storage::disk('public')->delete($conseil->image);
            }

            $validated['image'] = $request->file('image')->store('security-tips/images', 'public');
        } else {
            unset($validated['image']);
        }

        unset($validated['status']);

        $validated['featured'] = $featured;
        $validated['tags'] = $validated['tags'] ?? [];

        $conseil->fill($validated);

        if ($conseil->status !== $status) {
            $statusTransition->apply($conseil, $status, $request->user());
        }

        $conseil->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Conseil mis à jour avec succès.']);

        return to_route('conseils.index');
    }

    public function destroy(SecurityTip $conseil): RedirectResponse
    {
        $this->authorize('delete', $conseil);

        $conseil->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Conseil archivé avec succès.']);

        return to_route('conseils.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function formatSecurityTip(SecurityTip $securityTip, bool $includeContent = false): array
    {
        return $securityTip->toAdminArray($includeContent);
    }

    private function ensureFeaturedLimit(bool $featured, ?SecurityTip $except = null, ?ArticleStatus $status = null): void
    {
        if (! $featured) {
            return;
        }

        if ($status !== null && $status !== ArticleStatus::Published) {
            throw ValidationException::withMessages([
                'featured' => 'Seuls les conseils publiés peuvent être mis à la une.',
            ]);
        }

        $count = SecurityTip::query()
            ->where('featured', true)
            ->where('status', ArticleStatus::Published)
            ->when($except !== null, fn ($query) => $query->where('id', '!=', $except->id))
            ->count();

        if ($count >= self::MAX_FEATURED) {
            throw ValidationException::withMessages([
                'featured' => 'Vous ne pouvez pas avoir plus de '.self::MAX_FEATURED.' conseils à la une.',
            ]);
        }
    }
}
