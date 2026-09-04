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

    /**
     * Récupère la liste des modèles de messages du compte Business Meta.
     *
     * @return list<array{
     *     id: string,
     *     name: string,
     *     language: string,
     *     status: string,
     *     category: string,
     *     body_text: string,
     *     header_text: string|null,
     *     footer_text: string|null,
     *     components: list<array<string, mixed>>
     * }>
     */
    public function fetchTemplates(WhatsAppAccount $account): array
    {
        if ($account->driver === WhatsAppAccountDriver::Log) {
            return [
                [
                    'id' => 'sample_tpl_1',
                    'name' => 'notification_securite',
                    'language' => 'fr',
                    'status' => 'APPROVED',
                    'category' => 'MARKETING',
                    'body_text' => 'Bonjour {{1}}, nous vous informons que votre demande pour {{2}} a bien été prise en compte par Super Sécurité.',
                    'header_text' => 'Super Sécurité — Notification',
                    'footer_text' => 'Votre sécurité notre priorité',
                    'components' => [
                        ['type' => 'HEADER', 'format' => 'TEXT', 'text' => 'Super Sécurité — Notification'],
                        ['type' => 'BODY', 'text' => 'Bonjour {{1}}, nous vous informons que votre demande pour {{2}} a bien été prise en compte par Super Sécurité.'],
                        ['type' => 'FOOTER', 'text' => 'Votre sécurité notre priorité'],
                    ],
                ],
                [
                    'id' => 'sample_tpl_2',
                    'name' => 'devis_gardiennage_pro',
                    'language' => 'fr',
                    'status' => 'APPROVED',
                    'category' => 'MARKETING',
                    'body_text' => "Bonjour {{1}}, votre proposition de gardiennage et sécurité pour l'entreprise {{2}} est prête. Contactez votre conseiller au {{3}}.",
                    'header_text' => null,
                    'footer_text' => 'Super Sécurité SARL',
                    'components' => [
                        ['type' => 'BODY', 'text' => "Bonjour {{1}}, votre proposition de gardiennage et sécurité pour l'entreprise {{2}} est prête. Contactez votre conseiller au {{3}}."],
                        ['type' => 'FOOTER', 'text' => 'Super Sécurité SARL'],
                    ],
                ],
                [
                    'id' => 'sample_tpl_3',
                    'name' => 'alerte_intervention',
                    'language' => 'fr',
                    'status' => 'APPROVED',
                    'category' => 'UTILITY',
                    'body_text' => 'Alerte sécurité pour {{1}} : nos équipes d’intervention ont effectué une ronde sur votre site {{2}} avec succès.',
                    'header_text' => 'Rapport de ronde',
                    'footer_text' => 'Centre de télésurveillance',
                    'components' => [
                        ['type' => 'HEADER', 'format' => 'TEXT', 'text' => 'Rapport de ronde'],
                        ['type' => 'BODY', 'text' => 'Alerte sécurité pour {{1}} : nos équipes d’intervention ont effectué une ronde sur votre site {{2}} avec succès.'],
                        ['type' => 'FOOTER', 'text' => 'Centre de télésurveillance'],
                    ],
                ],
            ];
        }

        if (blank($account->business_account_id) || blank($account->access_token)) {
            throw new RuntimeException('Identifiant de compte business Meta (WABA ID) ou jeton d’accès manquant.');
        }

        try {
            $response = Http::withToken($account->access_token)
                ->acceptJson()
                ->get('https://graph.facebook.com/v21.0/'.$account->business_account_id.'/message_templates', [
                    'limit' => 100,
                ])
                ->throw();
        } catch (RequestException $exception) {
            $body = $exception->response?->json();
            $message = data_get($body, 'error.message') ?? $exception->getMessage();

            throw new RuntimeException('WhatsApp Meta API (fetch templates): '.$message, previous: $exception);
        }

        /** @var list<array<string, mixed>> $data */
        $data = $response->json('data', []);

        return array_map(function (array $item): array {
            $body = '';
            $header = null;
            $footer = null;
            /** @var list<array<string, mixed>> $components */
            $components = $item['components'] ?? [];

            foreach ($components as $component) {
                $type = strtoupper((string) ($component['type'] ?? ''));
                if ($type === 'BODY') {
                    $body = (string) ($component['text'] ?? '');
                } elseif ($type === 'HEADER') {
                    $header = isset($component['text']) ? (string) $component['text'] : null;
                } elseif ($type === 'FOOTER') {
                    $footer = isset($component['text']) ? (string) $component['text'] : null;
                }
            }

            return [
                'id' => (string) ($item['id'] ?? Str::uuid()),
                'name' => (string) ($item['name'] ?? ''),
                'language' => (string) ($item['language'] ?? 'fr'),
                'status' => (string) ($item['status'] ?? 'UNKNOWN'),
                'category' => (string) ($item['category'] ?? 'MARKETING'),
                'body_text' => $body,
                'header_text' => $header,
                'footer_text' => $footer,
                'components' => $components,
            ];
        }, $data);
    }
}
