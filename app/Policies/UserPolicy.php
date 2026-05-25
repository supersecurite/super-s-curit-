<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, User $model): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, User $model): bool
    {
        if (! $user->isAdmin()) {
            return false;
        }

        if ($model->role === UserRole::SuperAdmin && ! $user->isSuperAdmin()) {
            return false;
        }

        return true;
    }

    public function delete(User $user, User $model): bool
    {
        if (! $user->isAdmin()) {
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
