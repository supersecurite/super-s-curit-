<?php

namespace App\Policies;

use App\Enums\BackofficePermission;
use App\Models\MarketingCampaign;
use App\Models\User;

class MarketingCampaignPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessFeature('marketing_campaigns');
    }

    public function view(User $user, MarketingCampaign $marketingCampaign): bool
    {
        return $user->canAccessFeature('marketing_campaigns');
    }

    public function create(User $user): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingCampaignsCreate);
    }

    public function update(User $user, MarketingCampaign $marketingCampaign): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingCampaignsUpdate)
            && $marketingCampaign->status->isEditable();
    }

    public function delete(User $user, MarketingCampaign $marketingCampaign): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingCampaignsDelete)
            && $marketingCampaign->status->isEditable();
    }

    public function send(User $user, MarketingCampaign $marketingCampaign): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingCampaignsSend)
            && $marketingCampaign->status->canLaunch();
    }

    public function retry(User $user, MarketingCampaign $marketingCampaign): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingCampaignsSend)
            && $marketingCampaign->canRetry();
    }
}
