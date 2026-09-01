<?php

namespace App\Enums;

enum MarketingCampaignSendStatus: string
{
    case Queued = 'queued';
    case Sent = 'sent';
    case Delivered = 'delivered';
    case Read = 'read';
    case Failed = 'failed';
    case Bounced = 'bounced';

    public function label(): string
    {
        return match ($this) {
            self::Queued => 'En file',
            self::Sent => 'Envoyé',
            self::Delivered => 'Livré',
            self::Read => 'Ouvert',
            self::Failed => 'Échec',
            self::Bounced => 'Rebond',
        };
    }

    public function isTerminal(): bool
    {
        return ! in_array($this, [self::Queued, self::Sent], true);
    }
}
