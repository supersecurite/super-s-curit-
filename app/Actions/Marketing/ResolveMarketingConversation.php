<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingContact;
use App\Models\MarketingConversation;

/**
 * Retourne le fil de conversation d'un contact (création à la première réponse).
 */
class ResolveMarketingConversation extends Action
{
    public function handle(MarketingContact $contact, ?string $subject = null): MarketingConversation
    {
        $conversation = $contact->conversation()->first();

        if ($conversation !== null) {
            if ($subject !== null && $conversation->subject === null) {
                $conversation->update(['subject' => $subject]);
            }

            return $conversation->refresh();
        }

        return MarketingConversation::query()->create([
            'marketing_contact_id' => $contact->id,
            'subject' => $subject,
        ]);
    }
}
