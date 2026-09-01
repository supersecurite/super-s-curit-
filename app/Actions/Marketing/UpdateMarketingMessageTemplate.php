<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingMessageTemplate;

/**
 * Met à jour un modèle de message marketing.
 */
class UpdateMarketingMessageTemplate extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(MarketingMessageTemplate $template, array $data): MarketingMessageTemplate
    {
        $template->update($data);

        return $template->fresh() ?? $template;
    }
}
