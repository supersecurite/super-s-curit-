<?php

namespace App\Support\Marketing;

use App\Enums\MarketingCompanyContactChannel;

/**
 * Convertit d'anciennes valeurs texte libre en canaux plats.
 */
final class CompanyContactLegacyConverter
{
    /**
     * @return list<array{type: string, value: string, label: null}>
     */
    public static function convert(string $legacy): array
    {
        $legacy = trim($legacy);

        if ($legacy === '') {
            return [];
        }

        $channels = [];

        if (preg_match_all('/[\w.+-]+@[\w.-]+\.\w+/', $legacy, $emails) > 0) {
            foreach (array_unique($emails[0]) as $email) {
                $channels[] = [
                    'type' => MarketingCompanyContactChannel::Email->value,
                    'value' => $email,
                    'label' => null,
                ];
            }
        }

        if (preg_match_all('/\+\d{8,15}/', $legacy, $phones) > 0) {
            foreach (array_unique($phones[0]) as $phone) {
                $channels[] = [
                    'type' => MarketingCompanyContactChannel::Phone->value,
                    'value' => $phone,
                    'label' => null,
                ];
            }
        }

        return $channels;
    }
}
