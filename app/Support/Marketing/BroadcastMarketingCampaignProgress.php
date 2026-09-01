<?php

namespace App\Support\Marketing;

use App\Events\Marketing\MarketingCampaignProgressUpdated;
use App\Models\MarketingCampaign;
use App\Models\MarketingCampaignSend;

/**
 * Émet une mise à jour temps réel de la campagne (statut global + envoi optionnel).
 */
final class BroadcastMarketingCampaignProgress
{
    public static function dispatch(MarketingCampaign $campaign, ?MarketingCampaignSend $send = null): void
    {
        if (! self::isEnabled()) {
            return;
        }

        $campaign = $campaign->fresh();

        if ($campaign === null) {
            return;
        }

        $freshSend = $send?->fresh(['contact']);

        MarketingCampaignProgressUpdated::dispatch($campaign, $freshSend);
    }

    public static function isEnabled(): bool
    {
        return in_array(config('broadcasting.default'), ['reverb', 'pusher'], true);
    }
}
