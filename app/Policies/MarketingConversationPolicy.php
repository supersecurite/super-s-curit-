<?php

namespace App\Policies;

use App\Enums\BackofficePermission;
use App\Models\MarketingConversation;
use App\Models\User;

class MarketingConversationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessFeature('marketing_clients');
    }

    public function view(User $user, MarketingConversation $marketingConversation): bool
    {
        return $user->canAccessFeature('marketing_clients');
    }

    public function reply(User $user, MarketingConversation $marketingConversation): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingCampaignsSend);
    }
}
