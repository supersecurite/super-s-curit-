<?php

namespace App\Policies;

use App\Enums\BackofficePermission;
use App\Models\AccessLog;
use App\Models\User;

class AccessLogPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::AccessLogsView);
    }

    public function view(User $user, AccessLog $accessLog): bool
    {
        return $this->viewAny($user);
    }
}
