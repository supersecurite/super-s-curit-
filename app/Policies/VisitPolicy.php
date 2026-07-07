<?php

namespace App\Policies;

use App\Enums\BackofficePermission;
use App\Models\User;

class VisitPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::AnalyticsView);
    }
}
