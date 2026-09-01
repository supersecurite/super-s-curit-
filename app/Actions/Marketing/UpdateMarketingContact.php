<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingContact;

/**
 * Met à jour les coordonnées et métadonnées d'un contact marketing.
 */
class UpdateMarketingContact extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(MarketingContact $contact, array $data): MarketingContact
    {
        $contact->update($data);

        return $contact->fresh() ?? $contact;
    }
}
