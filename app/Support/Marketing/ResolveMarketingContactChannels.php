<?php

namespace App\Support\Marketing;

use App\Enums\MarketingCompanyContactChannel;
use App\Models\MarketingContact;

/**
 * Résout les canaux utilisables pour les campagnes (destinataire, copie, WhatsApp).
 */
final class ResolveMarketingContactChannels
{
    /**
     * @return list<array{
     *     type: string,
     *     value: string,
     *     label: string|null,
     *     person_name: string|null,
     *     scope: 'primary'|'company'
     * }>
     */
    public static function all(MarketingContact $contact): array
    {
        $channels = [];
        $personName = $contact->full_name !== '—' ? $contact->full_name : null;

        if (filled($contact->email)) {
            $channels[] = self::entry(
                MarketingCompanyContactChannel::Email,
                (string) $contact->email,
                'Contact principal',
                $personName,
                'primary',
            );
        }

        if (filled($contact->phone)) {
            $channels[] = self::entry(
                MarketingCompanyContactChannel::Phone,
                (string) $contact->phone,
                'Contact principal',
                $personName,
                'primary',
            );
        }

        foreach (MarketingCompanyContactRules::normalize($contact->company_contacts) as $channel) {
            $type = MarketingCompanyContactChannel::from($channel['type']);

            $channels[] = self::entry(
                $type,
                $channel['value'],
                $channel['label'],
                $personName,
                'company',
            );
        }

        return $channels;
    }

    /**
     * @return list<array{value: string, label: string|null, person_name: string|null, scope: string}>
     */
    public static function emails(MarketingContact $contact, bool $companyOnly = false): array
    {
        return self::filterByType($contact, MarketingCompanyContactChannel::Email, $companyOnly);
    }

    /**
     * @return list<array{value: string, label: string|null, person_name: string|null, scope: string}>
     */
    public static function phones(MarketingContact $contact, bool $companyOnly = false): array
    {
        return self::filterByType($contact, MarketingCompanyContactChannel::Phone, $companyOnly);
    }

    /**
     * @return list<array{value: string, label: string|null, person_name: string|null, scope: string}>
     */
    public static function whatsapp(MarketingContact $contact, bool $companyOnly = false): array
    {
        return self::filterByType($contact, MarketingCompanyContactChannel::WhatsApp, $companyOnly);
    }

    /**
     * E-mails entreprise pour mise en copie (hors contact principal).
     *
     * @return list<string>
     */
    public static function ccEmails(MarketingContact $contact): array
    {
        return array_values(array_unique(array_map(
            fn (array $entry): string => $entry['value'],
            self::emails($contact, companyOnly: true),
        )));
    }

    /**
     * @return array{
     *     emails: list<array{value: string, label: string|null, person_name: string|null, scope: string}>,
     *     phones: list<array{value: string, label: string|null, person_name: string|null, scope: string}>,
     *     whatsapp: list<array{value: string, label: string|null, person_name: string|null, scope: string}>,
     *     cc_emails: list<string>
     * }
     */
    public static function forCampaign(MarketingContact $contact): array
    {
        return [
            'emails' => self::emails($contact),
            'phones' => self::phones($contact),
            'whatsapp' => self::whatsapp($contact),
            'cc_emails' => self::ccEmails($contact),
        ];
    }

    /**
     * @return list<array{value: string, label: string|null, person_name: string|null, scope: string}>
     */
    private static function filterByType(
        MarketingContact $contact,
        MarketingCompanyContactChannel $type,
        bool $companyOnly,
    ): array {
        return array_values(array_filter(
            self::all($contact),
            fn (array $entry): bool => $entry['type'] === $type->value
                && (! $companyOnly || $entry['scope'] === 'company'),
        ));
    }

    /**
     * @return array{
     *     type: string,
     *     value: string,
     *     label: string|null,
     *     person_name: string|null,
     *     scope: 'primary'|'company'
     * }
     */
    private static function entry(
        MarketingCompanyContactChannel $type,
        string $value,
        ?string $label,
        ?string $personName,
        string $scope,
    ): array {
        return [
            'type' => $type->value,
            'value' => $value,
            'label' => $label,
            'person_name' => $personName,
            'scope' => $scope,
        ];
    }
}
