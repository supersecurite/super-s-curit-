<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingCampaign;
use App\Models\MarketingContact;
use App\Models\MarketingList;

/**
 * Synchronise l'audience d'une campagne (groupes + contacts directs).
 */
class SyncMarketingCampaignAudience extends Action
{
    /**
     * @param  list<string>  $listUuids
     * @param  list<string>  $contactUuids
     */
    public function handle(MarketingCampaign $campaign, array $listUuids, array $contactUuids): void
    {
        $listIds = MarketingList::query()
            ->whereIn('uuid', $listUuids)
            ->pluck('id')
            ->all();

        $contactIds = MarketingContact::query()
            ->whereIn('uuid', $contactUuids)
            ->pluck('id')
            ->all();

        $campaign->lists()->sync($listIds);
        $campaign->audienceContacts()->sync($contactIds);

        // Compat lecture legacy : premier groupe comme marketing_list_id.
        $campaign->forceFill([
            'marketing_list_id' => $listIds[0] ?? null,
        ])->save();
    }
}
