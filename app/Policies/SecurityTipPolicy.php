<?php

namespace App\Policies;

use App\Models\SecurityTip;
use App\Models\User;

class SecurityTipPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, SecurityTip $securityTip): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, SecurityTip $securityTip): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, SecurityTip $securityTip): bool
    {
        return $user->isAdmin();
    }

    public function approve(User $user, SecurityTip $securityTip): bool
    {
        return $user->isAdmin();
    }
}
