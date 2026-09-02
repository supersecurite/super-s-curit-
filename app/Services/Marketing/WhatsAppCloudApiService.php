<?php

namespace App\Services\Marketing;

use App\Enums\WhatsAppAccountDriver;
use App\Models\WhatsAppAccount;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Envoi de templates WhatsApp via Meta Cloud API (ou driver log).
 */
class WhatsAppCloudApiService
{
    /**
     * @param  list<string>  $bodyParameters
     * @return array{provider_message_id: string}
     */
    public function sendTemplateMessage(
        WhatsAppAccount $account,
        string $toPhoneE164,
        string $templateName,
        string $languageCode,
        array $bodyParameters = [],
    ): array {
        $to = ltrim($toPhoneE164, '+');

        if ($account->driver === WhatsAppAccountDriver::Log) {
            $messageId = 'wamid.log.'.Str::uuid();

            Log::info('WhatsApp log driver: template message queued.', [
                'account_uuid' => $account->uuid,
                'to' => $to,
                'template' => $templateName,
                'language' => $languageCode,
                'parameters' => $bodyParameters,
                'provider_message_id' => $messageId,
            ]);

            return ['provider_message_id' => $messageId];
        }

        $components = [];

        if ($bodyParameters !== []) {
            $components[] = [
                'type' => 'body',
                'parameters' => array_map(
                    fn (string $text): array => ['type' => 'text', 'text' => $text],
                    $bodyParameters,
                ),
            ];
        }

        $payload = [
            'messaging_product' => 'whatsapp',
            'to' => $to,
            'type' => 'template',
            'template' => [
                'name' => $templateName,
                'language' => ['code' => $languageCode],
                'components' => $components,
            ],
        ];

        try {
            $response = Http::withToken($account->access_token)
                ->acceptJson()
                ->post(
                    'https://graph.facebook.com/v21.0/'.$account->phone_number_id.'/messages',
                    $payload,
                )
                ->throw();
        } catch (RequestException $exception) {
            $body = $exception->response?->json();
            $message = data_get($body, 'error.message')
                ?? $exception->getMessage();

            throw new RuntimeException('WhatsApp Meta API: '.$message, previous: $exception);
        }

        $messageId = data_get($response->json(), 'messages.0.id');

        if (! is_string($messageId) || $messageId === '') {
            throw new RuntimeException('WhatsApp Meta API: identifiant de message manquant.');
        }

        return ['provider_message_id' => $messageId];
    }
}
