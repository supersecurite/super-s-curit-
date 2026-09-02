<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Enums\MarketingCampaignChannel;
use App\Enums\MarketingCampaignStatus;
use App\Models\MarketingCampaign;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Crée une campagne marketing en brouillon depuis les données validées.
 */
class CreateMarketingCampaign extends Action
{
    public function __construct(
        private SyncMarketingCampaignAudience $syncAudience,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data, User $creator): MarketingCampaign
    {
        $channel = MarketingCampaignChannel::from($data['channel'] ?? MarketingCampaignChannel::Email->value);
        $listUuids = array_values(array_filter($data['list_uuids'] ?? []));
        $contactUuids = array_values(array_filter($data['contact_uuids'] ?? []));

        unset($data['list_uuids'], $data['contact_uuids'], $data['marketing_list_id']);

        if ($channel === MarketingCampaignChannel::Email) {
            $data['whatsapp_account_id'] = null;
        }

        if ($channel === MarketingCampaignChannel::WhatsApp) {
            $data['subject'] = null;
            $data['body'] = '';
        }

        return DB::transaction(function () use ($data, $creator, $channel, $listUuids, $contactUuids): MarketingCampaign {
            $campaign = MarketingCampaign::query()->create([
                ...$data,
                'channel' => $channel,
                'status' => MarketingCampaignStatus::Draft,
                'created_by' => $creator->id,
                'marketing_list_id' => null,
            ]);

            $this->syncAudience->handle($campaign, $listUuids, $contactUuids);

            return $campaign->fresh(['lists', 'audienceContacts']) ?? $campaign;
        });
    }
}
