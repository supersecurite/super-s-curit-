<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Enums\MarketingCampaignChannel;
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
        $channel = MarketingCampaignChannel::from($data['channel'] ?? $campaign->channel->value);

        if ($channel === MarketingCampaignChannel::Email) {
            $data['whatsapp_account_id'] = null;
        }

        $data['channel'] = $channel;

        $campaign->update($data);

        return $campaign->refresh();
    }
}
