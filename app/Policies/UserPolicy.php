<?php

namespace App\Policies;

use App\Enums\BackofficePermission;
use App\Enums\UserRole;
use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessFeature('users');
    }

    public function view(User $user, User $model): bool
    {
        return $user->canAccessFeature('users');
    }

    public function create(User $user): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::UsersCreate);
    }

    public function update(User $user, User $model): bool
    {
        if (! $user->hasBackofficePermission(BackofficePermission::UsersUpdate)) {
            return false;
        }

        if ($model->role === UserRole::SuperAdmin && ! $user->isSuperAdmin()) {
            return false;
        }

        return true;
    }

    public function delete(User $user, User $model): bool
    {
        if (! $user->hasBackofficePermission(BackofficePermission::UsersDelete)) {
            return false;
        }

        if ($user->id === $model->id) {
            return false;
        }

        if ($model->role === UserRole::SuperAdmin && ! $user->isSuperAdmin()) {
            return false;
        }

        return true;
    }
}
