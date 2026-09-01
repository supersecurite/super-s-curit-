<?php

namespace App\Enums;

enum MarketingConversationMessageDirection: string
{
    case Inbound = 'inbound';
    case Outbound = 'outbound';

    public function label(): string
    {
        return match ($this) {
            self::Inbound => 'Reçu',
            self::Outbound => 'Envoyé',
        };
    }
}
