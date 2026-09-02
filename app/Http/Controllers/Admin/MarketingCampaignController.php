<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Marketing\CreateMarketingCampaign;
use App\Actions\Marketing\DeleteMarketingCampaign;
use App\Actions\Marketing\LaunchMarketingCampaign;
use App\Actions\Marketing\UpdateMarketingCampaign;
use App\Enums\MarketingCampaignChannel;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMarketingCampaignRequest;
use App\Http\Requests\UpdateMarketingCampaignRequest;
use App\Models\MarketingCampaign;
use App\Models\MarketingContact;
use App\Models\MarketingEmailAccount;
use App\Models\MarketingList;
use App\Models\MarketingMessageTemplate;
use App\Models\WhatsAppAccount;
use App\Support\IndexTableSort;
use App\Support\Marketing\RenderMarketingMessageTemplate;
use App\Support\Marketing\ResolveMarketingCampaignRecipient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MarketingCampaignController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', MarketingCampaign::class);

        $channel = $this->resolveChannelFilter($request) ?? MarketingCampaignChannel::Email;

        $sort = IndexTableSort::resolve(
            $request,
            ['name', 'status', 'subject', 'created_at', 'launched_at'],
            'created_at',
            'desc',
        );

        $query = MarketingCampaign::query()
            ->with([
                'lists:id,uuid,name',
                'audienceContacts:id,uuid,first_name,last_name',
                'template:id,uuid,name',
            ])
            ->withCount('sends')
            ->where('channel', $channel)
            ->search($request->string('search')->toString() ?: null);

        match ($sort['column']) {
            'status' => $query->orderBy('status', $sort['direction']),
            default => $query->orderBy($sort['column'], $sort['direction']),
        };

        $campaigns = $query
            ->paginate(20)
            ->withQueryString()
            ->through(fn (MarketingCampaign $campaign) => [
                ...$campaign->toAdminArray(),
                'sends_count' => $campaign->sends_count,
                'can_update' => $request->user()?->can('update', $campaign) ?? false,
                'can_delete' => $request->user()?->can('delete', $campaign) ?? false,
                'can_send' => $request->user()?->can('send', $campaign) ?? false,
            ]);

        return Inertia::render('marketing-campaigns/index', [
            'campaigns' => $campaigns,
            'channel' => $channel->value,
            'filters' => [
                ...$request->only(['search']),
                'channel' => $channel->value,
                ...IndexTableSort::filters($request),
            ],
            'canCreate' => $request->user()?->can('create', MarketingCampaign::class) ?? false,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', MarketingCampaign::class);

        $channel = MarketingCampaignChannel::tryFrom($request->string('channel')->toString())
            ?? MarketingCampaignChannel::Email;

        return Inertia::render('marketing-campaigns/create', [
            'lockedChannel' => $channel->value,
            'lists' => $this->listOptions(),
            'contacts' => $this->contactOptions(),
            'templates' => $this->templateOptions($channel),
            'emailAccounts' => $channel === MarketingCampaignChannel::Email
                ? $this->emailAccountOptions()
                : [],
            'defaultEmailAccountId' => $channel === MarketingCampaignChannel::Email
                ? MarketingEmailAccount::query()
                    ->where('is_active', true)
                    ->where('is_default', true)
                    ->value('id')
                : null,
            'whatsappAccounts' => $channel === MarketingCampaignChannel::WhatsApp
                ? $this->whatsappAccountOptions()
                : [],
            'defaultWhatsappAccountId' => $channel === MarketingCampaignChannel::WhatsApp
                ? WhatsAppAccount::query()
                    ->where('is_active', true)
                    ->where('is_default', true)
                    ->value('id')
                : null,
            'variables' => RenderMarketingMessageTemplate::VARIABLES,
        ]);
    }

    public function store(
        StoreMarketingCampaignRequest $request,
        CreateMarketingCampaign $action,
    ): RedirectResponse {
        $campaign = $action->handle($request->validated(), $request->user());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Campagne créée avec succès.']);

        return to_route('marketing-campaigns.show', $campaign);
    }

    public function show(Request $request, MarketingCampaign $marketingCampaign): Response
    {
        $this->authorize('view', $marketingCampaign);

        $marketingCampaign->load([
            'lists:id,uuid,name',
            'audienceContacts:id,uuid,first_name,last_name,email,phone',
            'template:id,uuid,name,meta_template_name,meta_template_language',
            'whatsappAccount:id,uuid,name',
            'emailAccount:id,uuid,name,from_address,from_name,daily_send_limit',
        ]);
        $marketingCampaign->loadCount('sends');

        $sends = $marketingCampaign->sends()
            ->with('contact:id,uuid,first_name,last_name')
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString()
            ->through(fn ($send) => $send->toAdminArray());

        return Inertia::render('marketing-campaigns/show', [
            'campaign' => [
                ...$marketingCampaign->toAdminArray(),
                'stats' => $marketingCampaign->sendStats(),
            ],
            'sends' => $sends,
            'canUpdate' => $request->user()?->can('update', $marketingCampaign) ?? false,
            'canDelete' => $request->user()?->can('delete', $marketingCampaign) ?? false,
            'canSend' => $request->user()?->can('send', $marketingCampaign) ?? false,
        ]);
    }

    public function edit(MarketingCampaign $marketingCampaign): Response
    {
        $this->authorize('update', $marketingCampaign);

        $marketingCampaign->load([
            'lists:id,uuid,name',
            'audienceContacts:id,uuid,first_name,last_name,email,phone',
            'template:id,uuid,name,meta_template_name,meta_template_language',
            'whatsappAccount:id,uuid,name',
            'emailAccount:id,uuid,name,from_address,from_name,daily_send_limit',
        ]);

        return Inertia::render('marketing-campaigns/edit', [
            'campaign' => $marketingCampaign->toAdminArray(),
            'lockedChannel' => $marketingCampaign->channel->value,
            'lists' => $this->listOptions(),
            'contacts' => $this->contactOptions(),
            'templates' => $this->templateOptions($marketingCampaign->channel),
            'emailAccounts' => $marketingCampaign->channel === MarketingCampaignChannel::Email
                ? $this->emailAccountOptions()
                : [],
            'whatsappAccounts' => $marketingCampaign->channel === MarketingCampaignChannel::WhatsApp
                ? $this->whatsappAccountOptions()
                : [],
            'variables' => RenderMarketingMessageTemplate::VARIABLES,
        ]);
    }

    public function update(
        UpdateMarketingCampaignRequest $request,
        MarketingCampaign $marketingCampaign,
        UpdateMarketingCampaign $action,
    ): RedirectResponse {
        $action->handle($marketingCampaign, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Campagne mise à jour avec succès.']);

        return to_route('marketing-campaigns.show', $marketingCampaign);
    }

    public function destroy(
        MarketingCampaign $marketingCampaign,
        DeleteMarketingCampaign $action,
    ): RedirectResponse {
        $this->authorize('delete', $marketingCampaign);

        $channel = $marketingCampaign->channel->value;
        $action->handle($marketingCampaign);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Campagne supprimée avec succès.']);

        return to_route('marketing-campaigns.index', ['channel' => $channel]);
    }

    public function launch(
        MarketingCampaign $marketingCampaign,
        LaunchMarketingCampaign $action,
    ): RedirectResponse {
        $this->authorize('send', $marketingCampaign);

        $action->handle($marketingCampaign);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Campagne lancée — les envois sont en cours.',
            'sound' => 'success',
        ]);

        return to_route('marketing-campaigns.show', $marketingCampaign);
    }

    /**
     * Aperçu audience (groupes + contacts) pour le formulaire campagne.
     */
    public function audiencePreview(Request $request): JsonResponse
    {
        $this->authorize('create', MarketingCampaign::class);

        $validated = $request->validate([
            'channel' => ['required', 'string', Rule::enum(MarketingCampaignChannel::class)],
            'list_uuids' => ['nullable', 'array'],
            'list_uuids.*' => ['uuid'],
            'contact_uuids' => ['nullable', 'array'],
            'contact_uuids.*' => ['uuid'],
        ]);

        $channel = MarketingCampaignChannel::from($validated['channel']);
        $listUuids = $validated['list_uuids'] ?? [];
        $contactUuids = $validated['contact_uuids'] ?? [];

        $fromLists = MarketingList::query()
            ->whereIn('uuid', $listUuids)
            ->with('contacts')
            ->get()
            ->flatMap(fn (MarketingList $list) => $list->contacts);

        $direct = MarketingContact::query()
            ->whereIn('uuid', $contactUuids)
            ->get();

        $contacts = $fromLists
            ->concat($direct)
            ->unique('id')
            ->sortBy([['last_name', 'asc'], ['first_name', 'asc']])
            ->values()
            ->map(fn (MarketingContact $contact) => [
                'uuid' => $contact->uuid,
                'full_name' => $contact->full_name,
                'email' => $contact->email,
                'phone' => $contact->phone,
                'marketing_consent' => $contact->marketing_consent,
                'is_eligible' => ResolveMarketingCampaignRecipient::isEligibleFor($contact, $channel),
            ])
            ->all();

        $eligibleCount = collect($contacts)->where('is_eligible', true)->count();

        return response()->json([
            'contacts' => $contacts,
            'stats' => [
                'total' => count($contacts),
                'eligible' => $eligibleCount,
                'ineligible' => count($contacts) - $eligibleCount,
                'lists_count' => count($listUuids),
                'direct_contacts_count' => count($contactUuids),
            ],
        ]);
    }

    /**
     * @deprecated Conservé pour compat — préférer audiencePreview.
     */
    public function listAudience(Request $request, MarketingList $marketingList): JsonResponse
    {
        $this->authorize('create', MarketingCampaign::class);

        $channel = MarketingCampaignChannel::tryFrom($request->string('channel')->toString())
            ?? MarketingCampaignChannel::Email;

        $contacts = $marketingList->contacts()
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get()
            ->map(fn ($contact) => [
                'uuid' => $contact->uuid,
                'full_name' => $contact->full_name,
                'email' => $contact->email,
                'phone' => $contact->phone,
                'marketing_consent' => $contact->marketing_consent,
                'is_eligible' => ResolveMarketingCampaignRecipient::isEligibleFor($contact, $channel),
            ])
            ->values()
            ->all();

        $eligibleCount = collect($contacts)->where('is_eligible', true)->count();

        return response()->json([
            'list' => [
                'uuid' => $marketingList->uuid,
                'name' => $marketingList->name,
                'contacts_count' => count($contacts),
            ],
            'contacts' => $contacts,
            'stats' => [
                'total' => count($contacts),
                'eligible' => $eligibleCount,
                'ineligible' => count($contacts) - $eligibleCount,
            ],
        ]);
    }

    private function resolveChannelFilter(Request $request): ?MarketingCampaignChannel
    {
        $value = $request->string('channel')->toString();

        if ($value === '' || $value === 'all') {
            return null;
        }

        return MarketingCampaignChannel::tryFrom($value);
    }

    /**
     * @return list<array{id: int, uuid: string, name: string, contacts_count: int}>
     */
    private function listOptions(): array
    {
        return MarketingList::query()
            ->withCount('contacts')
            ->orderBy('name')
            ->get(['id', 'uuid', 'name'])
            ->map(fn (MarketingList $list) => [
                'id' => $list->id,
                'uuid' => $list->uuid,
                'name' => $list->name,
                'contacts_count' => $list->contacts_count,
            ])
            ->all();
    }

    /**
     * @return list<array{uuid: string, full_name: string, email: string|null, phone: string|null}>
     */
    private function contactOptions(): array
    {
        return MarketingContact::query()
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->limit(500)
            ->get(['id', 'uuid', 'first_name', 'last_name', 'email', 'phone'])
            ->map(fn (MarketingContact $contact) => [
                'uuid' => $contact->uuid,
                'full_name' => $contact->full_name,
                'email' => $contact->email,
                'phone' => $contact->phone,
            ])
            ->all();
    }

    /**
     * @return list<array{id: int, uuid: string, name: string, channel: string, subject: string|null, body: string, meta_template_name: string|null, meta_template_language: string|null}>
     */
    private function templateOptions(?MarketingCampaignChannel $channel = null): array
    {
        $query = MarketingMessageTemplate::query()->orderBy('name');

        if ($channel !== null) {
            $query->where('channel', $channel);
        }

        return $query
            ->get(['id', 'uuid', 'name', 'channel', 'subject', 'body', 'meta_template_name', 'meta_template_language'])
            ->map(fn (MarketingMessageTemplate $template) => [
                'id' => $template->id,
                'uuid' => $template->uuid,
                'name' => $template->name,
                'channel' => $template->channel->value,
                'subject' => $template->subject,
                'body' => $template->body,
                'meta_template_name' => $template->meta_template_name,
                'meta_template_language' => $template->meta_template_language,
            ])
            ->all();
    }

    /**
     * @return list<array{id: int, uuid: string, name: string, from_address: string, remaining_today: int|null, daily_send_limit: int|null}>
     */
    private function emailAccountOptions(): array
    {
        return MarketingEmailAccount::query()
            ->where('is_active', true)
            ->orderByDesc('is_default')
            ->orderBy('name')
            ->get()
            ->map(fn (MarketingEmailAccount $account) => [
                'id' => $account->id,
                'uuid' => $account->uuid,
                'name' => $account->name,
                'from_address' => $account->from_address,
                'daily_send_limit' => $account->daily_send_limit,
                'remaining_today' => $account->remainingDailyQuota(),
            ])
            ->all();
    }

    /**
     * @return list<array{id: int, uuid: string, name: string}>
     */
    private function whatsappAccountOptions(): array
    {
        return WhatsAppAccount::query()
            ->where('is_active', true)
            ->orderByDesc('is_default')
            ->orderBy('name')
            ->get(['id', 'uuid', 'name'])
            ->map(fn (WhatsAppAccount $account) => [
                'id' => $account->id,
                'uuid' => $account->uuid,
                'name' => $account->name,
            ])
            ->all();
    }
}
