<?php

namespace App\Policies;

use App\Models\Partner;
use App\Models\User;

class PartnerPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Partner $partner): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Partner $partner): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Partner $partner): bool
    {
        return $user->isAdmin();
    }
}
