<?php

namespace App\Policies;

use App\Enums\BackofficePermission;
use App\Models\User;
use App\Models\WhatsAppAccount;

class WhatsAppAccountPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessFeature('marketing_campaigns');
    }

    public function view(User $user, WhatsAppAccount $whatsAppAccount): bool
    {
        return $user->canAccessFeature('marketing_campaigns');
    }

    public function create(User $user): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingCampaignsUpdate);
    }

    public function update(User $user, WhatsAppAccount $whatsAppAccount): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingCampaignsUpdate);
    }

    public function delete(User $user, WhatsAppAccount $whatsAppAccount): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingCampaignsUpdate);
    }
}
