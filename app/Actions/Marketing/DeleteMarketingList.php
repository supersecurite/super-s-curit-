<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingList;

/**
 * Supprime une liste marketing (détachement automatique des contacts via pivot).
 */
class DeleteMarketingList extends Action
{
    public function handle(MarketingList $list): void
    {
        $list->delete();
    }
}
