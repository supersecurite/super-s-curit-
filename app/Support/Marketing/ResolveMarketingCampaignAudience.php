<?php

namespace App\Support\Marketing;

use App\Enums\MarketingCampaignChannel;
use App\Models\MarketingCampaign;
use App\Models\MarketingContact;
use Illuminate\Support\Collection;

/**
 * Résout l'audience d'une campagne : union des groupes + contacts directs, dédupliquée.
 */
final class ResolveMarketingCampaignAudience
{
    /**
     * @return Collection<int, MarketingContact>
     */
    public static function contacts(MarketingCampaign $campaign): Collection
    {
        $campaign->loadMissing(['lists.contacts', 'audienceContacts']);

        $fromLists = $campaign->lists
            ->flatMap(fn ($list) => $list->contacts)
            ->keyBy('id');

        $direct = $campaign->audienceContacts->keyBy('id');

        /** @var Collection<int, MarketingContact> $merged */
        $merged = $fromLists->union($direct)->values();

        // Compatibilité : ancienne FK marketing_list_id si pivots vides.
        if ($merged->isEmpty() && $campaign->marketing_list_id) {
            $campaign->loadMissing('list.contacts');
            $merged = $campaign->list?->contacts?->values() ?? collect();
        }

        return $merged;
    }

    /**
     * @return Collection<int, MarketingContact>
     */
    public static function eligibleContacts(
        MarketingCampaign $campaign,
        MarketingCampaignChannel $channel,
    ): Collection {
        return self::contacts($campaign)
            ->filter(fn (MarketingContact $contact) => ResolveMarketingCampaignRecipient::isEligibleFor($contact, $channel))
            ->values();
    }
}
