<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Marketing\MarkMarketingConversationAsRead;
use App\Actions\Marketing\ResolveMarketingConversation;
use App\Actions\Marketing\SendMarketingConversationReply;
use App\Enums\BackofficePermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMarketingConversationReplyRequest;
use App\Models\MarketingContact;
use App\Models\MarketingConversation;
use App\Support\IndexTableSort;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarketingConversationController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', MarketingConversation::class);

        $sort = IndexTableSort::resolve(
            $request,
            ['last_message_at', 'unread_inbound_count', 'created_at'],
            'last_message_at',
            'desc',
        );

        $query = MarketingConversation::query()
            ->with('contact')
            ->when($request->boolean('unread_only'), fn ($builder) => $builder->where('unread_inbound_count', '>', 0))
            ->when($request->filled('search'), function ($builder) use ($request): void {
                $search = '%'.$request->string('search')->toString().'%';
                $builder->whereHas('contact', function ($contactQuery) use ($search): void {
                    $contactQuery
                        ->where('email', 'like', $search)
                        ->orWhere('first_name', 'like', $search)
                        ->orWhere('last_name', 'like', $search)
                        ->orWhere('company_name', 'like', $search);
                });
            });

        match ($sort['column']) {
            'unread_inbound_count' => $query->orderBy('unread_inbound_count', $sort['direction']),
            'created_at' => $query->orderBy('created_at', $sort['direction']),
            default => $query->orderBy('last_message_at', $sort['direction']),
        };

        $conversations = $query
            ->paginate(20)
            ->withQueryString()
            ->through(fn (MarketingConversation $conversation) => [
                ...$conversation->toAdminArray(),
                'can_reply' => $request->user()?->can('reply', $conversation) ?? false,
            ]);

        return Inertia::render('marketing-conversations/index', [
            'conversations' => $conversations,
            'filters' => [
                ...$request->only(['search', 'unread_only']),
                ...IndexTableSort::filters($request),
            ],
        ]);
    }

    public function show(
        Request $request,
        MarketingConversation $marketingConversation,
        MarkMarketingConversationAsRead $markAsRead,
    ): Response {
        $this->authorize('view', $marketingConversation);

        $markAsRead->handle($marketingConversation);

        $marketingConversation->load(['contact', 'messages.user']);

        return Inertia::render('marketing-conversations/show', [
            'conversation' => [
                ...$marketingConversation->fresh(['contact'])->toAdminArray(),
                'contact' => $marketingConversation->contact?->toAdminArray(),
            ],
            'messages' => $marketingConversation->messages
                ->map(fn ($message) => $message->toAdminArray())
                ->values()
                ->all(),
            'canReply' => $request->user()?->can('reply', $marketingConversation) ?? false,
        ]);
    }

    public function reply(
        StoreMarketingConversationReplyRequest $request,
        MarketingConversation $marketingConversation,
        SendMarketingConversationReply $action,
    ): RedirectResponse {
        $validated = $request->validated();

        $action->handle(
            $marketingConversation,
            $request->user(),
            $validated['body'],
            $validated['subject'] ?? null,
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Réponse envoyée.',
        ]);

        return to_route('marketing-conversations.show', $marketingConversation);
    }

    public function startFromContact(
        Request $request,
        MarketingContact $marketingClient,
        ResolveMarketingConversation $resolveConversation,
    ): RedirectResponse {
        $this->authorize('viewAny', MarketingConversation::class);

        abort_unless(
            $request->user()?->hasBackofficePermission(BackofficePermission::MarketingCampaignsSend) === true,
            403,
        );

        $conversation = $resolveConversation->handle($marketingClient);

        return to_route('marketing-conversations.show', $conversation);
    }
}
