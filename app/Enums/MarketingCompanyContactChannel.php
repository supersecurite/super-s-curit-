<?php

namespace App\Enums;

/** Canal de contact d'un interlocuteur entreprise (campagnes e-mail / WhatsApp). */
enum MarketingCompanyContactChannel: string
{
    case Email = 'email';
    case Phone = 'phone';
    case WhatsApp = 'whatsapp';

    public function label(): string
    {
        return match ($this) {
            self::Email => 'E-mail',
            self::Phone => 'Téléphone',
            self::WhatsApp => 'WhatsApp',
        };
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $channel) => [
                'value' => $channel->value,
                'label' => $channel->label(),
            ],
            self::cases(),
        );
    }
}
