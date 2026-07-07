<?php

namespace App\Policies;

use App\Enums\ArticleStatus;
use App\Enums\BackofficePermission;
use App\Models\SecurityTip;
use App\Models\User;

class SecurityTipPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessFeature('conseils');
    }

    public function view(User $user, SecurityTip $securityTip): bool
    {
        return $user->canAccessFeature('conseils');
    }

    public function create(User $user): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::ConseilsCreate);
    }

    public function update(User $user, SecurityTip $securityTip): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::ConseilsUpdateAny)
            || ($user->hasBackofficePermission(BackofficePermission::ConseilsUpdate)
                && $securityTip->created_by_id === $user->id);
    }

    public function delete(User $user, SecurityTip $securityTip): bool
    {
        if ($user->hasBackofficePermission(BackofficePermission::ConseilsDeleteAny)) {
            return true;
        }

        return $user->hasBackofficePermission(BackofficePermission::ConseilsDelete)
            && $securityTip->created_by_id === $user->id
            && $securityTip->status !== ArticleStatus::Published;
    }

    public function approve(User $user, SecurityTip $securityTip): bool
    {
        return $user->canApproveConseils();
    }
}
