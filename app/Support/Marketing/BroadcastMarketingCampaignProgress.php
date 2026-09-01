<?php

namespace App\Support\Marketing;

use App\Events\Marketing\MarketingCampaignProgressUpdated;
use App\Models\MarketingCampaign;
use App\Models\MarketingCampaignSend;
use Illuminate\Support\Facades\Log;
use Throwable;

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

        try {
            MarketingCampaignProgressUpdated::dispatch($campaign, $freshSend);
        } catch (Throwable $exception) {
            Log::warning('Marketing campaign broadcast failed.', [
                'campaign_uuid' => $campaign->uuid,
                'send_uuid' => $freshSend?->uuid,
                'exception' => $exception->getMessage(),
            ]);
        }
    }

    public static function isEnabled(): bool
    {
        $driver = config('broadcasting.default');

        if (! in_array($driver, ['reverb', 'pusher'], true)) {
            return false;
        }

        $connection = config("broadcasting.connections.{$driver}");

        return filled($connection['key'] ?? null);
    }
}
