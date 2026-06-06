<?php

namespace App\Policies;

use App\Enums\ArticleStatus;
use App\Models\SecurityTip;
use App\Models\User;

class SecurityTipPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, SecurityTip $securityTip): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, SecurityTip $securityTip): bool
    {
        return $user->isAdmin() || $securityTip->created_by_id === $user->id;
    }

    public function delete(User $user, SecurityTip $securityTip): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $securityTip->created_by_id === $user->id
            && $securityTip->status !== ArticleStatus::Published;
    }

    public function approve(User $user, SecurityTip $securityTip): bool
    {
        return $user->isAdmin();
    }
}
