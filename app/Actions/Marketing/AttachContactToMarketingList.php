<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingContact;
use App\Models\MarketingList;

/**
 * Ajoute un contact à une liste sans retirer les associations existantes.
 */
class AttachContactToMarketingList extends Action
{
    public function __construct(
        private AttachContactsToMarketingList $attachContacts,
    ) {}

    public function handle(MarketingList $list, MarketingContact $contact): void
    {
        $this->attachContacts->handle($list, [$contact->id]);
    }
}
