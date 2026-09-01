<?php

namespace App\Enums;

enum MarketingCampaignSendStatus: string
{
    case Queued = 'queued';
    case Sent = 'sent';
    case Received = 'received';
    case Delivered = 'delivered';
    case Read = 'read';
    case Failed = 'failed';
    case Bounced = 'bounced';

    public function label(): string
    {
        return match ($this) {
            self::Queued => 'En file',
            self::Sent => 'Envoyé',
            self::Received, self::Delivered => 'Reçu',
            self::Read => 'Lu',
            self::Failed => 'Échec',
            self::Bounced => 'Rebond',
        };
    }

    public function isTerminal(): bool
    {
        return ! in_array($this, [self::Queued, self::Sent, self::Received, self::Delivered], true);
    }

    public function isReceived(): bool
    {
        return in_array($this, [self::Received, self::Delivered], true);
    }
}
