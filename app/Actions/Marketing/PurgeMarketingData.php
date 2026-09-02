<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingCampaign;
use App\Models\MarketingCampaignSend;
use App\Models\MarketingContact;
use App\Models\MarketingList;
use App\Models\MarketingMessageTemplate;
use Illuminate\Support\Facades\DB;

/**
 * Purge les données métier marketing (contacts, listes, templates, campagnes)
 * en conservant les comptes e-mail et WhatsApp.
 *
 * @return array{sends: int, campaigns: int, contacts: int, lists: int, templates: int}
 */
class PurgeMarketingData extends Action
{
    /**
     * @return array{sends: int, campaigns: int, contacts: int, lists: int, templates: int}
     */
    public function handle(): array
    {
        return DB::transaction(function (): array {
            $sends = MarketingCampaignSend::query()->count();
            MarketingCampaignSend::query()->delete();

            DB::table('marketing_campaign_marketing_list')->delete();
            DB::table('marketing_campaign_marketing_contact')->delete();

            $campaigns = MarketingCampaign::withTrashed()->count();
            MarketingCampaign::withTrashed()->forceDelete();

            DB::table('marketing_contact_marketing_list')->delete();

            $contacts = MarketingContact::withTrashed()->count();
            MarketingContact::withTrashed()->forceDelete();

            $lists = MarketingList::withTrashed()->count();
            MarketingList::withTrashed()->forceDelete();

            $templates = MarketingMessageTemplate::withTrashed()->count();
            MarketingMessageTemplate::withTrashed()->forceDelete();

            return [
                'sends' => $sends,
                'campaigns' => $campaigns,
                'contacts' => $contacts,
                'lists' => $lists,
                'templates' => $templates,
            ];
        });
    }
}
