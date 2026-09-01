<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingContact;

/**
 * Supprime définitivement un contact marketing (détachement automatique des listes via pivot).
 */
class DeleteMarketingContact extends Action
{
    public function handle(MarketingContact $contact): void
    {
        $contact->delete();
    }
}
