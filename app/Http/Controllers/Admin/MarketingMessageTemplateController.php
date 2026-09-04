<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Marketing\CreateMarketingMessageTemplate;
use App\Actions\Marketing\DeleteMarketingMessageTemplate;
use App\Actions\Marketing\ImportWhatsAppMetaTemplates;
use App\Actions\Marketing\UpdateMarketingMessageTemplate;
use App\Enums\MarketingCampaignChannel;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMarketingMessageTemplateRequest;
use App\Http\Requests\UpdateMarketingMessageTemplateRequest;
use App\Models\MarketingMessageTemplate;
use App\Models\WhatsAppAccount;
use App\Services\Marketing\WhatsAppCloudApiService;
use App\Support\IndexTableSort;
use App\Support\Marketing\RenderMarketingMessageTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class MarketingMessageTemplateController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', MarketingMessageTemplate::class);

        $sort = IndexTableSort::resolve(
            $request,
            ['name', 'channel', 'subject', 'created_at'],
            'created_at',
            'desc',
        );

        $channel = MarketingCampaignChannel::tryFrom($request->string('channel')->toString())
            ?? MarketingCampaignChannel::Email;

        $query = MarketingMessageTemplate::query()
            ->where('channel', $channel)
            ->search($request->string('search')->toString() ?: null);

        match ($sort['column']) {
            'channel' => $query->orderBy('channel', $sort['direction']),
            default => $query->orderBy($sort['column'], $sort['direction']),
        };

        $templates = $query
            ->paginate(20)
            ->withQueryString()
            ->through(fn (MarketingMessageTemplate $template) => [
                ...$template->toAdminArray(),
                'can_update' => $request->user()?->can('update', $template) ?? false,
                'can_delete' => $request->user()?->can('delete', $template) ?? false,
            ]);

        return Inertia::render('marketing-templates/index', [
            'templates' => $templates,
            'channel' => $channel->value,
            'filters' => [
                ...$request->only(['search']),
                'channel' => $channel->value,
                ...IndexTableSort::filters($request),
            ],
            'canCreate' => $request->user()?->can('create', MarketingMessageTemplate::class) ?? false,
            'variables' => RenderMarketingMessageTemplate::VARIABLES,
            'whatsappAccounts' => $channel === MarketingCampaignChannel::WhatsApp
                ? $this->whatsappAccountOptions()
                : [],
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', MarketingMessageTemplate::class);

        $channel = MarketingCampaignChannel::tryFrom($request->string('channel')->toString())
            ?? MarketingCampaignChannel::Email;

        return Inertia::render('marketing-templates/create', [
            'lockedChannel' => $channel->value,
            'variables' => RenderMarketingMessageTemplate::VARIABLES,
            'whatsappAccounts' => $channel === MarketingCampaignChannel::WhatsApp
                ? $this->whatsappAccountOptions()
                : [],
        ]);
    }

    /**
     * Interroge l'API Meta Cloud pour récupérer les modèles disponibles du compte WhatsApp.
     */
    public function fetchMetaTemplates(Request $request, WhatsAppCloudApiService $service): JsonResponse
    {
        $this->authorize('create', MarketingMessageTemplate::class);

        $accountUuid = $request->string('account_uuid')->toString();
        $account = $accountUuid !== ''
            ? WhatsAppAccount::query()->where('uuid', $accountUuid)->where('is_active', true)->first()
            : WhatsAppAccount::query()->where('is_active', true)->orderByDesc('is_default')->first();

        if ($account === null) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun compte WhatsApp actif configuré.',
                'templates' => [],
            ], 422);
        }

        try {
            $templates = $service->fetchTemplates($account);

            return response()->json([
                'success' => true,
                'account' => [
                    'uuid' => $account->uuid,
                    'name' => $account->name,
                ],
                'templates' => $templates,
            ]);
        } catch (Throwable $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
                'templates' => [],
            ], 422);
        }
    }

    /**
     * Importe un ou plusieurs modèles Meta sélectionnés dans les templates de l'application.
     */
    public function importMetaTemplates(Request $request, ImportWhatsAppMetaTemplates $action): RedirectResponse
    {
        $this->authorize('create', MarketingMessageTemplate::class);

        $validated = $request->validate([
            'templates' => ['required', 'array', 'min:1'],
            'templates.*.name' => ['required', 'string', 'max:255'],
            'templates.*.language' => ['required', 'string', 'max:16'],
            'templates.*.body_text' => ['nullable', 'string', 'max:500000'],
            'templates.*.header_text' => ['nullable', 'string', 'max:255'],
            'templates.*.title' => ['nullable', 'string', 'max:255'],
        ]);

        /** @var list<array{name: string, language: string, body_text?: string|null, header_text?: string|null, title?: string|null}> $templatesList */
        $templatesList = $validated['templates'];

        $count = $action->handle($templatesList);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $count > 1
                ? "{$count} modèles WhatsApp importés avec succès depuis Meta."
                : 'Modèle WhatsApp importé avec succès depuis Meta.',
        ]);

        return to_route('marketing-templates.index', ['channel' => 'whatsapp']);
    }

    /**
     * @return list<array{id: int, uuid: string, name: string, is_default: bool}>
     */
    private function whatsappAccountOptions(): array
    {
        return WhatsAppAccount::query()
            ->where('is_active', true)
            ->orderByDesc('is_default')
            ->orderBy('name')
            ->get(['id', 'uuid', 'name', 'is_default'])
            ->map(fn (WhatsAppAccount $account) => [
                'id' => $account->id,
                'uuid' => $account->uuid,
                'name' => $account->name,
                'is_default' => $account->is_default,
            ])
            ->all();
    }

    public function store(
        StoreMarketingMessageTemplateRequest $request,
        CreateMarketingMessageTemplate $action,
    ): RedirectResponse {
        $template = $action->handle($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Template créé avec succès.']);

        return to_route('marketing-templates.show', $template);
    }

    public function show(Request $request, MarketingMessageTemplate $marketingTemplate): Response
    {
        $this->authorize('view', $marketingTemplate);

        return Inertia::render('marketing-templates/show', [
            'template' => $marketingTemplate->toAdminArray(),
            'variables' => RenderMarketingMessageTemplate::VARIABLES,
            'canUpdate' => $request->user()?->can('update', $marketingTemplate) ?? false,
            'canDelete' => $request->user()?->can('delete', $marketingTemplate) ?? false,
        ]);
    }

    public function edit(MarketingMessageTemplate $marketingTemplate): Response
    {
        $this->authorize('update', $marketingTemplate);

        return Inertia::render('marketing-templates/edit', [
            'template' => $marketingTemplate->toAdminArray(),
            'variables' => RenderMarketingMessageTemplate::VARIABLES,
        ]);
    }

    public function update(
        UpdateMarketingMessageTemplateRequest $request,
        MarketingMessageTemplate $marketingTemplate,
        UpdateMarketingMessageTemplate $action,
    ): RedirectResponse {
        $action->handle($marketingTemplate, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Template mis à jour avec succès.']);

        return to_route('marketing-templates.show', $marketingTemplate);
    }

    public function destroy(
        Request $request,
        MarketingMessageTemplate $marketingTemplate,
        DeleteMarketingMessageTemplate $action,
    ): RedirectResponse {
        $this->authorize('delete', $marketingTemplate);

        $channel = $marketingTemplate->channel;

        $action->handle($marketingTemplate);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Template supprimé avec succès.']);

        $previousUrl = url()->previous();
        $fallbackUrl = route('marketing-templates.index', ['channel' => $channel->value]);

        if (
            str_contains($previousUrl, $marketingTemplate->uuid) ||
            str_contains($previousUrl, (string) $marketingTemplate->id) ||
            $previousUrl === $request->fullUrl()
        ) {
            return redirect()->to($fallbackUrl);
        }

        return redirect()->back(fallback: $fallbackUrl);
    }
}
