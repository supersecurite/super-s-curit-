<?php

namespace App\Policies;

use App\Enums\BackofficePermission;
use App\Models\MarketingContact;
use App\Models\User;

class MarketingContactPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessFeature('marketing_clients');
    }

    public function view(User $user, MarketingContact $marketingContact): bool
    {
        return $user->canAccessFeature('marketing_clients');
    }

    public function create(User $user): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingClientsCreate);
    }

    public function update(User $user, MarketingContact $marketingContact): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingClientsUpdate);
    }

    public function delete(User $user, MarketingContact $marketingContact): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingClientsDelete);
    }

    public function import(User $user): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::MarketingClientsImport);
    }
}
