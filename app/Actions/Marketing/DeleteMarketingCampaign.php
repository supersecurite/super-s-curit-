<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingCampaign;

/** Supprime une campagne marketing (soft delete). */
class DeleteMarketingCampaign extends Action
{
    public function handle(MarketingCampaign $campaign): void
    {
        $campaign->delete();
    }
}
