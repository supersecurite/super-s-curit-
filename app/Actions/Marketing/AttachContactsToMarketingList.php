<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingList;

/**
 * Ajoute un ou plusieurs contacts à une liste sans retirer les associations existantes.
 */
class AttachContactsToMarketingList extends Action
{
    /**
     * @param  list<int>  $contactIds
     * @return int Nombre de contacts demandés (idempotent via syncWithoutDetaching)
     */
    public function handle(MarketingList $list, array $contactIds): int
    {
        $ids = array_values(array_unique(array_map('intval', $contactIds)));

        if ($ids === []) {
            return 0;
        }

        $list->contacts()->syncWithoutDetaching($ids);

        return count($ids);
    }
}
