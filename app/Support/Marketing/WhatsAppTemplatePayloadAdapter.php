<?php

namespace App\Support\Marketing;

use App\Models\MarketingContact;
use App\Models\MarketingMessageTemplate;
use Illuminate\Support\Str;

/**
 * Adapte les variables d'un modèle Meta WhatsApp aux données de la plateforme (contacts, entreprise, etc.).
 */
final class WhatsAppTemplatePayloadAdapter
{
    /**
     * Construit la liste des composants Meta conformes (header, body) avec leurs paramètres typés.
     *
     * @return list<array{type: string, parameters: list<array{type: string, text: string}>}>
     */
    public static function buildComponents(MarketingMessageTemplate $template, MarketingContact $contact): array
    {
        $components = [];

        // 1. En-tête (Header) si des variables sont présentes (ex: {{1}})
        $headerText = (string) ($template->subject ?? '');
        $headerParams = self::extractParameters($headerText, $contact, isHeader: true);

        if ($headerParams !== []) {
            $components[] = [
                'type' => 'header',
                'parameters' => array_map(
                    fn (string $text): array => ['type' => 'text', 'text' => $text],
                    $headerParams,
                ),
            ];
        }

        // 2. Corps (Body) si des variables sont présentes (ex: {{1}}, {{2}})
        $bodyText = (string) ($template->body ?? '');
        $bodyParams = self::extractParameters($bodyText, $contact, isHeader: false);

        if ($bodyParams !== []) {
            $components[] = [
                'type' => 'body',
                'parameters' => array_map(
                    fn (string $text): array => ['type' => 'text', 'text' => $text],
                    $bodyParams,
                ),
            ];
        }

        return $components;
    }

    /**
     * Extrait et résout les valeurs des paramètres positionnels {{1}}, {{2}}...
     *
     * @return list<string>
     */
    public static function extractParameters(string $text, MarketingContact $contact, bool $isHeader = false): array
    {
        if ($text === '') {
            return [];
        }

        preg_match_all('/\{\{(\d+)\}\}/', $text, $matches);

        if (empty($matches[1])) {
            return [];
        }

        $expectedCount = max(array_map('intval', $matches[1]));

        if ($expectedCount <= 0) {
            return [];
        }

        [$givenName, $familyName] = $contact->nameParts();
        $fullName = $contact->full_name !== '—' && filled($contact->full_name)
            ? $contact->full_name
            : ($givenName ?: 'Client');

        $company = filled($contact->company_name)
            ? $contact->company_name
            : ($familyName ?: 'Super Sécurité');

        $phone = filled($contact->phone)
            ? $contact->phone
            : '+224 620 00 00 00';

        $email = filled($contact->email)
            ? $contact->email
            : 'contact@supersecurite.com';

        $address = filled($contact->address)
            ? $contact->address
            : 'Conakry, Guinée';

        // Pool de données de la plateforme ordonné logiquement
        $pool = $isHeader
            ? [
                1 => $fullName,
                2 => $company,
            ]
            : [
                1 => $fullName,
                2 => $company,
                3 => $phone,
                4 => $email,
                5 => $address,
            ];

        $parameters = [];
        for ($i = 1; $i <= $expectedCount; $i++) {
            $val = $pool[$i] ?? ($contact->notes ? Str::limit($contact->notes, 30) : ('Info '.$i));
            $clean = trim((string) $val);

            // Meta refuse les chaînes vides ou de plus de 1024 caractères
            $parameters[] = $clean !== '' ? mb_substr($clean, 0, 1000) : '—';
        }

        return $parameters;
    }
}
