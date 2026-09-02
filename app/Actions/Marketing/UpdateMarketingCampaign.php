<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Enums\MarketingCampaignChannel;
use App\Models\MarketingCampaign;
use Illuminate\Support\Facades\DB;

/**
 * Met à jour une campagne en brouillon.
 */
class UpdateMarketingCampaign extends Action
{
    public function __construct(
        private SyncMarketingCampaignAudience $syncAudience,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(MarketingCampaign $campaign, array $data): MarketingCampaign
    {
        $channel = MarketingCampaignChannel::from($data['channel'] ?? $campaign->channel->value);
        $listUuids = array_values(array_filter($data['list_uuids'] ?? []));
        $contactUuids = array_values(array_filter($data['contact_uuids'] ?? []));

        unset($data['list_uuids'], $data['contact_uuids'], $data['marketing_list_id']);

        if ($channel === MarketingCampaignChannel::Email) {
            $data['whatsapp_account_id'] = null;
        }

        if ($channel === MarketingCampaignChannel::WhatsApp) {
            $data['marketing_email_account_id'] = null;
            $data['subject'] = null;
            $data['body'] = '';
        }

        $data['channel'] = $channel;

        return DB::transaction(function () use ($campaign, $data, $listUuids, $contactUuids): MarketingCampaign {
            $campaign->update($data);
            $this->syncAudience->handle($campaign->fresh() ?? $campaign, $listUuids, $contactUuids);

            return $campaign->fresh(['lists', 'audienceContacts']) ?? $campaign;
        });
    }
}
