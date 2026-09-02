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
use App\Models\MarketingList;
use App\Models\MarketingMessageTemplate;
use App\Models\WhatsAppAccount;
use App\Support\IndexTableSort;
use App\Support\Marketing\RenderMarketingMessageTemplate;
use App\Support\Marketing\ResolveMarketingCampaignRecipient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarketingCampaignController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', MarketingCampaign::class);

        $sort = IndexTableSort::resolve(
            $request,
            ['name', 'status', 'subject', 'created_at', 'launched_at'],
            'created_at',
            'desc',
        );

        $query = MarketingCampaign::query()
            ->with(['list:id,uuid,name', 'template:id,uuid,name'])
            ->withCount('sends')
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
            'filters' => [
                ...$request->only(['search']),
                ...IndexTableSort::filters($request),
            ],
            'canCreate' => $request->user()?->can('create', MarketingCampaign::class) ?? false,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', MarketingCampaign::class);

        return Inertia::render('marketing-campaigns/create', [
            'lists' => $this->listOptions(),
            'templates' => $this->templateOptions(),
            'whatsappAccounts' => $this->whatsappAccountOptions(),
            'defaultWhatsappAccountId' => WhatsAppAccount::query()
                ->where('is_active', true)
                ->where('is_default', true)
                ->value('id'),
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

        $marketingCampaign->load(['list:id,uuid,name', 'template:id,uuid,name', 'whatsappAccount:id,uuid,name']);
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

        $marketingCampaign->load(['list:id,uuid,name', 'template:id,uuid,name', 'whatsappAccount:id,uuid,name']);

        return Inertia::render('marketing-campaigns/edit', [
            'campaign' => $marketingCampaign->toAdminArray(),
            'lists' => $this->listOptions(),
            'templates' => $this->templateOptions(),
            'whatsappAccounts' => $this->whatsappAccountOptions(),
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

        $action->handle($marketingCampaign);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Campagne supprimée avec succès.']);

        return to_route('marketing-campaigns.index');
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
     * Aperçu audience d'une liste pour le formulaire campagne (contacts + éligibilité envoi).
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
     * @return list<array{id: int, uuid: string, name: string, channel: string, subject: string|null, body: string, meta_template_name: string|null, meta_template_language: string|null}>
     */
    private function templateOptions(): array
    {
        return MarketingMessageTemplate::query()
            ->orderBy('name')
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
