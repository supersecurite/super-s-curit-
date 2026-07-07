<?php

namespace App\Policies;

use App\Enums\ArticleStatus;
use App\Enums\BackofficePermission;
use App\Models\Article;
use App\Models\User;

class ArticlePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessFeature('articles');
    }

    public function view(User $user, Article $article): bool
    {
        return $user->canAccessFeature('articles');
    }

    public function create(User $user): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::ArticlesCreate);
    }

    public function update(User $user, Article $article): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::ArticlesUpdateAny)
            || ($user->hasBackofficePermission(BackofficePermission::ArticlesUpdate)
                && $article->created_by_id === $user->id);
    }

    public function delete(User $user, Article $article): bool
    {
        if ($user->hasBackofficePermission(BackofficePermission::ArticlesDeleteAny)) {
            return true;
        }

        return $user->hasBackofficePermission(BackofficePermission::ArticlesDelete)
            && $article->created_by_id === $user->id
            && $article->status !== ArticleStatus::Published;
    }

    public function approve(User $user, Article $article): bool
    {
        return $user->canApproveArticles();
    }
}
