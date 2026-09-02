<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Marketing\CreateMarketingMessageTemplate;
use App\Actions\Marketing\DeleteMarketingMessageTemplate;
use App\Actions\Marketing\UpdateMarketingMessageTemplate;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMarketingMessageTemplateRequest;
use App\Http\Requests\UpdateMarketingMessageTemplateRequest;
use App\Models\MarketingMessageTemplate;
use App\Support\IndexTableSort;
use App\Support\Marketing\RenderMarketingMessageTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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

        $query = MarketingMessageTemplate::query()
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
            'filters' => [
                ...$request->only(['search']),
                ...IndexTableSort::filters($request),
            ],
            'canCreate' => $request->user()?->can('create', MarketingMessageTemplate::class) ?? false,
            'variables' => RenderMarketingMessageTemplate::VARIABLES,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', MarketingMessageTemplate::class);

        return Inertia::render('marketing-templates/create', [
            'variables' => RenderMarketingMessageTemplate::VARIABLES,
        ]);
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
        MarketingMessageTemplate $marketingTemplate,
        DeleteMarketingMessageTemplate $action,
    ): RedirectResponse {
        $this->authorize('delete', $marketingTemplate);

        $action->handle($marketingTemplate);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Template supprimé avec succès.']);

        return to_route('marketing-templates.index');
    }
}
