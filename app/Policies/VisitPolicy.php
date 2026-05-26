<?php

namespace App\Policies;

use App\Models\User;

class VisitPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }
}
