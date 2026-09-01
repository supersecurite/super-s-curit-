<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Enums\MarketingCampaignSendStatus;
use App\Enums\MarketingCampaignStatus;
use App\Models\MarketingCampaign;

/**
 * Met à jour le statut global de la campagne lorsque tous les envois sont terminés.
 */
class SyncMarketingCampaignCompletion extends Action
{
    public function handle(MarketingCampaign $campaign): MarketingCampaign
    {
        if (! in_array($campaign->status, [MarketingCampaignStatus::Sending, MarketingCampaignStatus::Queued], true)) {
            return $campaign;
        }

        $pendingCount = $campaign->sends()
            ->where('status', MarketingCampaignSendStatus::Queued)
            ->count();

        if ($pendingCount > 0) {
            return $campaign;
        }

        $failedCount = $campaign->sends()
            ->whereIn('status', [
                MarketingCampaignSendStatus::Failed,
                MarketingCampaignSendStatus::Bounced,
            ])
            ->count();

        $totalCount = $campaign->sends()->count();

        $status = ($totalCount > 0 && $failedCount === $totalCount)
            ? MarketingCampaignStatus::Failed
            : MarketingCampaignStatus::Completed;

        if ($campaign->status !== $status || $campaign->completed_at === null) {
            $campaign->update([
                'status' => $status,
                'completed_at' => now(),
            ]);
        }

        return $campaign->refresh();
    }
}
