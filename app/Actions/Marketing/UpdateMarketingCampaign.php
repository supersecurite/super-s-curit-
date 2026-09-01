<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingCampaign;

/**
 * Met à jour une campagne en brouillon.
 */
class UpdateMarketingCampaign extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(MarketingCampaign $campaign, array $data): MarketingCampaign
    {
        $campaign->update($data);

        return $campaign->refresh();
    }
}
