<?php

namespace App\Http\Controllers;

use App\Actions\Marketing\RecordWhatsAppMessageStatus;
use App\Models\WhatsAppAccount;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class MarketingWhatsAppWebhookController extends Controller
{
    /**
     * Challenge de vérification Meta (GET) ou réception des statuts (POST).
     */
    public function __invoke(
        Request $request,
        WhatsAppAccount $whatsapp_account,
        RecordWhatsAppMessageStatus $recordStatus,
    ): Response|SymfonyResponse {
        if ($request->isMethod('GET')) {
            $mode = $request->query('hub_mode');
            $token = $request->query('hub_verify_token');
            $challenge = $request->query('hub_challenge');

            if ($mode === 'subscribe' && is_string($token) && hash_equals($whatsapp_account->verify_token, $token)) {
                return response((string) $challenge, 200)->header('Content-Type', 'text/plain');
            }

            return response('Forbidden', 403);
        }

        if (! $this->signatureIsValid($request, $whatsapp_account)) {
            return response()->json(['message' => 'Signature invalide.'], 403);
        }

        $entries = $request->input('entry', []);

        if (! is_array($entries)) {
            return response()->json(['accepted' => true]);
        }

        foreach ($entries as $entry) {
            $changes = data_get($entry, 'changes', []);

            if (! is_array($changes)) {
                continue;
            }

            foreach ($changes as $change) {
                $statuses = data_get($change, 'value.statuses', []);

                if (! is_array($statuses)) {
                    continue;
                }

                foreach ($statuses as $statusPayload) {
                    $messageId = data_get($statusPayload, 'id');
                    $status = data_get($statusPayload, 'status');
                    $errorMessage = data_get($statusPayload, 'errors.0.title')
                        ?? data_get($statusPayload, 'errors.0.message');

                    if (! is_string($messageId) || ! is_string($status)) {
                        continue;
                    }

                    $recordStatus->handle(
                        $messageId,
                        $status,
                        is_string($errorMessage) ? $errorMessage : null,
                    );
                }
            }
        }

        return response()->json(['accepted' => true]);
    }

    private function signatureIsValid(Request $request, WhatsAppAccount $account): bool
    {
        $header = $request->header('X-Hub-Signature-256');

        if (! is_string($header) || ! str_starts_with($header, 'sha256=')) {
            return false;
        }

        $expected = 'sha256='.hash_hmac('sha256', $request->getContent(), $account->app_secret);

        return hash_equals($expected, $header);
    }
}
