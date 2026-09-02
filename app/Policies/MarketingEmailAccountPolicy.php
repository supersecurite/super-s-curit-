<?php

namespace App\Policies;

use App\Enums\BackofficePermission;
use App\Models\MarketingEmailAccount;
use App\Models\User;

class MarketingEmailAccountPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessFeature('marketing_campaigns');
    }

    public function view(User $user, MarketingEmailAccount $marketingEmailAccount): bool
    {
        return $user->canAccessFeature('marketing_campaigns');
    }

    public function create(User $user): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingCampaignsUpdate);
    }

    public function update(User $user, MarketingEmailAccount $marketingEmailAccount): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingCampaignsUpdate);
    }

    public function delete(User $user, MarketingEmailAccount $marketingEmailAccount): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingCampaignsUpdate);
    }
}
