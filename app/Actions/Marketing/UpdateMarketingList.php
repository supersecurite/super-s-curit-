<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingList;

/**
 * Met à jour le nom et la description d'une liste marketing.
 */
class UpdateMarketingList extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(MarketingList $list, array $data): MarketingList
    {
        $list->update($data);

        return $list->fresh() ?? $list;
    }
}
