<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Marketing\AttachContactsToMarketingList;
use App\Actions\Marketing\CreateMarketingList;
use App\Actions\Marketing\DeleteMarketingList;
use App\Actions\Marketing\DetachContactFromMarketingList;
use App\Actions\Marketing\UpdateMarketingList;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMarketingListRequest;
use App\Http\Requests\UpdateMarketingListRequest;
use App\Models\MarketingContact;
use App\Models\MarketingList;
use App\Support\IndexTableSort;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarketingListController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', MarketingList::class);

        $sort = IndexTableSort::resolve(
            $request,
            ['name', 'description', 'contacts_count', 'created_at'],
            'name',
        );

        $query = MarketingList::query()
            ->withCount('contacts')
            ->search($request->string('search')->toString() ?: null);

        if ($sort['column'] === 'contacts_count') {
            $query->orderBy('contacts_count', $sort['direction']);
        } else {
            $query->orderBy($sort['column'], $sort['direction']);
        }

        $lists = $query
            ->paginate(20)
            ->withQueryString()
            ->through(fn (MarketingList $list) => [
                ...$list->toAdminArray(),
                'can_update' => $request->user()?->can('update', $list) ?? false,
                'can_delete' => $request->user()?->can('delete', $list) ?? false,
            ]);

        return Inertia::render('marketing-lists/index', [
            'lists' => $lists,
            'filters' => [
                ...$request->only(['search']),
                ...IndexTableSort::filters($request),
            ],
            'canCreate' => $request->user()?->can('create', MarketingList::class) ?? false,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', MarketingList::class);

        return Inertia::render('marketing-lists/create');
    }

    public function store(StoreMarketingListRequest $request, CreateMarketingList $action): RedirectResponse
    {
        $list = $action->handle($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Groupe créé avec succès.']);

        return to_route('marketing-lists.show', $list);
    }

    public function show(Request $request, MarketingList $marketingList): Response
    {
        $this->authorize('view', $marketingList);

        $contacts = $marketingList->contacts()
            ->latest('marketing_contact_marketing_list.created_at')
            ->paginate(15, ['*'], 'contacts_page')
            ->withQueryString()
            ->through(fn (MarketingContact $contact) => $contact->toAdminArray());

        $availableContacts = MarketingContact::query()
            ->whereNotIn('id', $marketingList->contacts()->pluck('marketing_contacts.id'))
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->limit(500)
            ->get()
            ->map(fn (MarketingContact $contact) => $contact->toAdminArray())
            ->all();

        return Inertia::render('marketing-lists/show', [
            'list' => $marketingList->toAdminArray(),
            'contacts' => $contacts,
            'availableContacts' => $availableContacts,
            'canUpdate' => $request->user()?->can('update', $marketingList) ?? false,
            'canDelete' => $request->user()?->can('delete', $marketingList) ?? false,
        ]);
    }

    public function edit(Request $request, MarketingList $marketingList): Response
    {
        $this->authorize('update', $marketingList);

        return Inertia::render('marketing-lists/edit', [
            'list' => $marketingList->toAdminArray(),
            'canDelete' => $request->user()?->can('delete', $marketingList) ?? false,
        ]);
    }

    public function update(
        UpdateMarketingListRequest $request,
        MarketingList $marketingList,
        UpdateMarketingList $action,
    ): RedirectResponse {
        $action->handle($marketingList, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Groupe mis à jour avec succès.']);

        return to_route('marketing-lists.show', $marketingList);
    }

    public function destroy(MarketingList $marketingList, DeleteMarketingList $action): RedirectResponse
    {
        $this->authorize('delete', $marketingList);

        $action->handle($marketingList);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Groupe supprimé avec succès.']);

        return to_route('marketing-lists.index');
    }

    public function attachContact(
        Request $request,
        MarketingList $marketingList,
        AttachContactsToMarketingList $action,
    ): RedirectResponse {
        $this->authorize('update', $marketingList);

        $validated = $request->validate([
            'contact_uuids' => ['required', 'array', 'min:1'],
            'contact_uuids.*' => ['uuid', 'exists:marketing_contacts,uuid'],
        ], [
            'contact_uuids.required' => 'Veuillez sélectionner au moins un contact.',
            'contact_uuids.min' => 'Veuillez sélectionner au moins un contact.',
            'contact_uuids.*.exists' => 'Un des contacts sélectionnés est introuvable.',
        ]);

        $contactIds = MarketingContact::query()
            ->whereIn('uuid', $validated['contact_uuids'])
            ->pluck('id')
            ->all();

        $count = $action->handle($marketingList, $contactIds);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $count === 1
                ? 'Contact ajouté au groupe.'
                : "{$count} contacts ajoutés au groupe.",
        ]);

        return to_route('marketing-lists.show', $marketingList);
    }

    public function detachContact(
        MarketingList $marketingList,
        MarketingContact $marketingClient,
        DetachContactFromMarketingList $action,
    ): RedirectResponse {
        $this->authorize('update', $marketingList);

        $action->handle($marketingList, $marketingClient);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Contact retiré du groupe.']);

        return to_route('marketing-lists.show', $marketingList);
    }
}
