<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingMessageTemplate;

/**
 * Crée un modèle de message marketing depuis les données validées.
 */
class CreateMarketingMessageTemplate extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data): MarketingMessageTemplate
    {
        return MarketingMessageTemplate::query()->create($data);
    }
}
