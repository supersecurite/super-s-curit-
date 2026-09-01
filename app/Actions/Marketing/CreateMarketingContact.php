<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingContact;

/**
 * Crée un contact marketing depuis les données validées du formulaire backoffice.
 */
class CreateMarketingContact extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data): MarketingContact
    {
        return MarketingContact::query()->create($data);
    }
}
