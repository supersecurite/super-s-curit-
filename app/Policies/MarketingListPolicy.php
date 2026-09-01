<?php

namespace App\Policies;

use App\Enums\BackofficePermission;
use App\Models\MarketingList;
use App\Models\User;

class MarketingListPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessFeature('marketing_clients');
    }

    public function view(User $user, MarketingList $marketingList): bool
    {
        return $user->canAccessFeature('marketing_clients');
    }

    public function create(User $user): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingClientsCreate);
    }

    public function update(User $user, MarketingList $marketingList): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingClientsUpdate);
    }

    public function delete(User $user, MarketingList $marketingList): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingClientsDelete);
    }
}
