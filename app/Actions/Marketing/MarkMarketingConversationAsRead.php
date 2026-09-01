<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingConversation;

/**
 * Remet à zéro le compteur de messages entrants non lus.
 */
class MarkMarketingConversationAsRead extends Action
{
    public function handle(MarketingConversation $conversation): MarketingConversation
    {
        if ($conversation->unread_inbound_count === 0) {
            return $conversation;
        }

        $conversation->update(['unread_inbound_count' => 0]);

        return $conversation->refresh();
    }
}
