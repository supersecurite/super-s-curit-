<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePartnerRequest;
use App\Http\Requests\UpdatePartnerRequest;
use App\Models\Partner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PartnerController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Partner::class);

        $query = Partner::query();

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where('name', 'like', '%'.$search.'%');
        }

        if ($request->filled('status') && $request->string('status')->toString() !== 'all') {
            $query->where('is_published', $request->string('status')->toString() === 'published');
        }

        $partners = $query
            ->ordered()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Partner $partner) => [
                ...$partner->toAdminArray(),
                'can_update' => $request->user()?->can('update', $partner) ?? false,
                'can_delete' => $request->user()?->can('delete', $partner) ?? false,
            ]);

        return Inertia::render('partners/index', [
            'partners' => $partners,
            'filters' => $request->only(['search', 'status']),
            'canCreate' => $request->user()?->can('create', Partner::class) ?? false,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Partner::class);

        return Inertia::render('partners/create');
    }

    public function store(StorePartnerRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $validated['logo'] = $request->file('logo')->store('partners/logos', 'public');
        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['is_published'] = $request->boolean('is_published', true);

        Partner::query()->create($validated);

        return redirect()
            ->route('partners.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Partenaire ajouté avec succès.',
            ]);
    }

    public function show(Partner $partner): RedirectResponse
    {
        $this->authorize('view', $partner);

        return redirect()->route('partners.edit', $partner);
    }

    public function edit(Partner $partner): Response
    {
        $this->authorize('update', $partner);

        return Inertia::render('partners/edit', [
            'partner' => $partner->toAdminArray(),
        ]);
    }

    public function update(UpdatePartnerRequest $request, Partner $partner): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('logo')) {
            if ($partner->logo !== null && ! str_starts_with($partner->logo, '/')) {
                Storage::disk('public')->delete($partner->logo);
            }

            $validated['logo'] = $request->file('logo')->store('partners/logos', 'public');
        } else {
            unset($validated['logo']);
        }

        $validated['is_published'] = $request->boolean('is_published');

        $partner->update($validated);

        return redirect()
            ->route('partners.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Partenaire mis à jour avec succès.',
            ]);
    }

    public function destroy(Partner $partner): RedirectResponse
    {
        $this->authorize('delete', $partner);

        if ($partner->logo !== null && ! str_starts_with($partner->logo, '/')) {
            Storage::disk('public')->delete($partner->logo);
        }

        $partner->delete();

        return redirect()
            ->route('partners.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Partenaire supprimé avec succès.',
            ]);
    }
}
