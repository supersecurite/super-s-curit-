<?php

namespace App\Http\Controllers;

use App\Actions\Marketing\RecordInboundMarketingConversationMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MarketingInboundEmailWebhookController extends Controller
{
    public function __invoke(
        Request $request,
        RecordInboundMarketingConversationMessage $recordInbound,
    ): JsonResponse {
        $expectedToken = config('marketing.inbound_webhook_token');

        if (! is_string($expectedToken) || $expectedToken === '') {
            return response()->json(['message' => 'Webhook non configuré.'], Response::HTTP_SERVICE_UNAVAILABLE);
        }

        $providedToken = $request->header('X-Marketing-Webhook-Token')
            ?? $request->query('token');

        if (! is_string($providedToken) || ! hash_equals($expectedToken, $providedToken)) {
            return response()->json(['message' => 'Non autorisé.'], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validate([
            'from_email' => ['required', 'email'],
            'to_email' => ['required'],
            'subject' => ['nullable', 'string', 'max:255'],
            'body_html' => ['nullable', 'string'],
            'body_text' => ['nullable', 'string'],
            'email_message_id' => ['nullable', 'string', 'max:255'],
            'sent_at' => ['nullable', 'date'],
        ]);

        if (($validated['body_html'] ?? null) === null && ($validated['body_text'] ?? null) === null) {
            return response()->json([
                'message' => 'Le corps du message est requis (body_html ou body_text).',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $message = $recordInbound->handle($validated);

        if ($message === null) {
            return response()->json([
                'message' => 'Aucune conversation correspondante.',
                'accepted' => false,
            ], Response::HTTP_ACCEPTED);
        }

        return response()->json([
            'message' => 'Message enregistré.',
            'accepted' => true,
            'conversation_uuid' => $message->load('conversation')->conversation?->uuid,
        ]);
    }
}
