<?php

namespace App\Support\Marketing;

use App\Models\MarketingContact;

/**
 * Résout le destinataire e-mail principal d'un contact pour une campagne.
 */
final class ResolveMarketingCampaignRecipient
{
    public static function email(MarketingContact $contact): ?string
    {
        if (filled($contact->email)) {
            return (string) $contact->email;
        }

        $emails = ResolveMarketingContactChannels::emails($contact);

        return $emails[0]['value'] ?? null;
    }

    public static function isEligible(MarketingContact $contact): bool
    {
        return $contact->marketing_consent && filled(self::email($contact));
    }
}
