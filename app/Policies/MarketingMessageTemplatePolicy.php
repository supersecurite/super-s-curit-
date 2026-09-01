<?php

namespace App\Policies;

use App\Enums\BackofficePermission;
use App\Models\MarketingMessageTemplate;
use App\Models\User;

class MarketingMessageTemplatePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessFeature('marketing_campaigns');
    }

    public function view(User $user, MarketingMessageTemplate $marketingMessageTemplate): bool
    {
        return $user->canAccessFeature('marketing_campaigns');
    }

    public function create(User $user): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingCampaignsCreate);
    }

    public function update(User $user, MarketingMessageTemplate $marketingMessageTemplate): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingCampaignsUpdate);
    }

    public function delete(User $user, MarketingMessageTemplate $marketingMessageTemplate): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingCampaignsDelete);
    }
}
