<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Enums\MarketingCampaignChannel;
use App\Enums\MarketingCampaignStatus;
use App\Models\MarketingCampaign;
use App\Models\User;

/**
 * Crée une campagne marketing en brouillon depuis les données validées.
 */
class CreateMarketingCampaign extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data, User $creator): MarketingCampaign
    {
        return MarketingCampaign::query()->create([
            ...$data,
            'channel' => MarketingCampaignChannel::Email,
            'status' => MarketingCampaignStatus::Draft,
            'created_by' => $creator->id,
        ]);
    }
}
