<?php

namespace App\Policies;

use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\User;

class ArticlePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Article $article): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Article $article): bool
    {
        return $user->isAdmin() || $article->created_by_id === $user->id;
    }

    public function delete(User $user, Article $article): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $article->created_by_id === $user->id
            && $article->status !== ArticleStatus::Published;
    }

    public function approve(User $user, Article $article): bool
    {
        return $user->isAdmin();
    }
}
