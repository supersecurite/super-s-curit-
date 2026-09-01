<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Marketing\CreateMarketingContact;
use App\Actions\Marketing\DeleteMarketingContact;
use App\Actions\Marketing\ImportMarketingContacts;
use App\Actions\Marketing\UpdateMarketingContact;
use App\Http\Controllers\Controller;
use App\Http\Requests\ImportMarketingContactsRequest;
use App\Http\Requests\StoreMarketingContactRequest;
use App\Http\Requests\UpdateMarketingContactRequest;
use App\Models\MarketingContact;
use App\Models\MarketingList;
use App\Support\IndexTableSort;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarketingContactController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', MarketingContact::class);

        $sort = IndexTableSort::resolve(
            $request,
            ['full_name', 'email', 'phone', 'marketing_consent', 'lists_count', 'created_at'],
            'created_at',
            'desc',
        );

        $query = MarketingContact::query()->withCount('lists')->search($request->string('search')->toString() ?: null);

        match ($sort['column']) {
            'full_name' => $query
                ->orderBy('last_name', $sort['direction'])
                ->orderBy('first_name', $sort['direction']),
            'lists_count' => $query->orderBy('lists_count', $sort['direction']),
            default => $query->orderBy($sort['column'], $sort['direction']),
        };

        $contacts = $query
            ->paginate(20)
            ->withQueryString()
            ->through(fn (MarketingContact $contact) => [
                ...$contact->toAdminArray(),
                'can_update' => $request->user()?->can('update', $contact) ?? false,
                'can_delete' => $request->user()?->can('delete', $contact) ?? false,
            ]);

        return Inertia::render('marketing-clients/index', [
            'contacts' => $contacts,
            'filters' => [
                ...$request->only(['search']),
                ...IndexTableSort::filters($request),
            ],
            'canCreate' => $request->user()?->can('create', MarketingContact::class) ?? false,
            'canImport' => $request->user()?->can('import', MarketingContact::class) ?? false,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', MarketingContact::class);

        return Inertia::render('marketing-clients/create');
    }

    public function store(StoreMarketingContactRequest $request, CreateMarketingContact $action): RedirectResponse
    {
        $validated = $request->validated();
        $validated['marketing_consent'] = $request->boolean('marketing_consent');
        $validated['tags'] = $validated['tags'] ?? [];

        $action->handle($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Contact ajouté avec succès.']);

        return to_route('marketing-clients.index');
    }

    public function show(Request $request, MarketingContact $marketingClient): Response
    {
        $this->authorize('view', $marketingClient);

        $marketingClient->load([
            'lists' => fn ($query) => $query->orderBy('name'),
        ]);

        return Inertia::render('marketing-clients/show', [
            'contact' => $marketingClient->toAdminArray(),
            'lists' => $marketingClient->lists
                ->map(fn (MarketingList $list) => $list->toAdminArray())
                ->values()
                ->all(),
            'canUpdate' => $request->user()?->can('update', $marketingClient) ?? false,
            'canDelete' => $request->user()?->can('delete', $marketingClient) ?? false,
        ]);
    }

    public function edit(MarketingContact $marketingClient): Response
    {
        $this->authorize('update', $marketingClient);

        return Inertia::render('marketing-clients/edit', [
            'contact' => $marketingClient->toAdminArray(),
        ]);
    }

    public function update(
        UpdateMarketingContactRequest $request,
        MarketingContact $marketingClient,
        UpdateMarketingContact $action,
    ): RedirectResponse {
        $validated = $request->validated();
        $validated['marketing_consent'] = $request->boolean('marketing_consent');
        $validated['tags'] = $validated['tags'] ?? [];

        $action->handle($marketingClient, $validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Contact mis à jour avec succès.']);

        return to_route('marketing-clients.show', $marketingClient);
    }

    public function destroy(MarketingContact $marketingClient, DeleteMarketingContact $action): RedirectResponse
    {
        $this->authorize('delete', $marketingClient);

        $action->handle($marketingClient);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Contact supprimé avec succès.']);

        return to_route('marketing-clients.index');
    }

    public function importForm(Request $request): Response
    {
        $this->authorize('import', MarketingContact::class);

        return Inertia::render('marketing-clients/import', [
            'importReport' => session('importReport'),
        ]);
    }

    public function import(
        ImportMarketingContactsRequest $request,
        ImportMarketingContacts $action,
    ): RedirectResponse {
        $result = $action->handle($request->file('file'));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => sprintf(
                'Import terminé : %d ajout(s), %d ignoré(s), %d erreur(s).',
                $result->added,
                $result->skipped,
                count($result->errors),
            ),
        ]);

        return redirect()
            ->route('marketing-clients.import')
            ->with('importReport', $result->toArray());
    }
}
