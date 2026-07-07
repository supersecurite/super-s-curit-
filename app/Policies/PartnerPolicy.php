<?php

namespace App\Policies;

use App\Enums\BackofficePermission;
use App\Models\Partner;
use App\Models\User;

class PartnerPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessFeature('partners');
    }

    public function view(User $user, Partner $partner): bool
    {
        return $user->canAccessFeature('partners');
    }

    public function create(User $user): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::PartnersCreate);
    }

    public function update(User $user, Partner $partner): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::PartnersUpdate);
    }

    public function delete(User $user, Partner $partner): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::PartnersDelete);
    }
}
