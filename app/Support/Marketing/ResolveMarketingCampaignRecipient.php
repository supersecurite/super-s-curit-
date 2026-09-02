<?php

namespace App\Support\Marketing;

use App\Enums\MarketingCampaignChannel;
use App\Models\MarketingContact;
use App\Support\InternationalPhoneNumber;

/**
 * Résout le destinataire e-mail ou WhatsApp d'un contact pour une campagne.
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

    public static function phone(MarketingContact $contact): ?string
    {
        if (filled($contact->phone)) {
            return InternationalPhoneNumber::normalize((string) $contact->phone)
                ?? (string) $contact->phone;
        }

        $whatsapp = ResolveMarketingContactChannels::whatsapp($contact);

        $value = $whatsapp[0]['value'] ?? null;

        if ($value === null) {
            return null;
        }

        return InternationalPhoneNumber::normalize($value) ?? $value;
    }

    public static function isEligible(MarketingContact $contact): bool
    {
        return self::isEligibleFor($contact, MarketingCampaignChannel::Email);
    }

    public static function isEligibleFor(MarketingContact $contact, MarketingCampaignChannel $channel): bool
    {
        if (! $contact->marketing_consent) {
            return false;
        }

        return match ($channel) {
            MarketingCampaignChannel::Email => filled(self::email($contact)),
            MarketingCampaignChannel::WhatsApp => filled(self::phone($contact)),
        };
    }
}
