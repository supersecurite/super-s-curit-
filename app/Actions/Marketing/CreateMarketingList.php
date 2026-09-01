<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingList;

/**
 * Crée une liste / audience marketing.
 */
class CreateMarketingList extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data): MarketingList
    {
        return MarketingList::query()->create($data);
    }
}
