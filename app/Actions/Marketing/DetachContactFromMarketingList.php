<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingContact;
use App\Models\MarketingList;

/**
 * Retire un contact d'une liste marketing.
 */
class DetachContactFromMarketingList extends Action
{
    public function handle(MarketingList $list, MarketingContact $contact): void
    {
        $list->contacts()->detach($contact->id);
    }
}
