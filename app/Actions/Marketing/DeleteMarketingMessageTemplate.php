<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingMessageTemplate;

/** Supprime un modèle de message marketing (soft delete). */
class DeleteMarketingMessageTemplate extends Action
{
    public function handle(MarketingMessageTemplate $template): void
    {
        $template->delete();
    }
}
