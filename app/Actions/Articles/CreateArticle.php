<?php

namespace App\Actions\Articles;

use App\Actions\Action;
use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\User;
use App\Support\ArticleStatusTransition;

/**
 * Crée une actualité (brouillon soumis pour validation) avec champs FR + EN optionnels.
 */
class CreateArticle extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(
        array $data,
        User $author,
        ArticleStatusTransition $statusTransition,
        ArticleStatus $status = ArticleStatus::PendingApproval,
    ): Article {
        $article = new Article($data);
        $article->created_by_id = $author->id;
        $statusTransition->apply($article, $status, $author);
        $article->save();

        return $article;
    }
}
