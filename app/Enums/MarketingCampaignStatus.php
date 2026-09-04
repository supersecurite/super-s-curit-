<?php

namespace App\Enums;

enum MarketingCampaignStatus: string
{
    case Draft = 'draft';
    case Scheduled = 'scheduled';
    case Queued = 'queued';
    case Sending = 'sending';
    case Completed = 'completed';
    case Failed = 'failed';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Brouillon',
            self::Scheduled => 'Planifiée',
            self::Queued => 'En file',
            self::Sending => 'Envoi en cours',
            self::Completed => 'Terminée',
            self::Failed => 'Échec',
        };
    }

    public function isEditable(): bool
    {
        return in_array($this, [self::Draft, self::Scheduled], true);
    }

    public function canLaunch(): bool
    {
        return in_array($this, [self::Draft, self::Scheduled], true);
    }
}
