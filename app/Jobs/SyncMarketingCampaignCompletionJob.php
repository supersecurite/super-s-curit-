<?php

namespace App\Jobs;

use App\Actions\Marketing\SyncMarketingCampaignCompletion;
use App\Models\MarketingCampaign;
use App\Support\Marketing\BroadcastMarketingCampaignProgress;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Attributes\DebounceFor;

/**
 * Recalcule le statut global d'une campagne après un lot d'envois terminés.
 *
 * Debounce : plusieurs envois qui se terminent en rafale ne déclenchent qu'une seule synchro.
 */
#[DebounceFor(3, maxWait: 30)]
class SyncMarketingCampaignCompletionJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public MarketingCampaign $campaign,
    ) {}

    public function debounceId(): string
    {
        return (string) $this->campaign->getKey();
    }

    public function handle(SyncMarketingCampaignCompletion $syncCompletion): void
    {
        $campaign = $this->campaign->fresh();

        if ($campaign === null) {
            return;
        }

        $syncCompletion->handle($campaign);

        BroadcastMarketingCampaignProgress::dispatch($campaign->refresh());
    }
}
