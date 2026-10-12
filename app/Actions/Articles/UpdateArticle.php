<?php

namespace App\Actions\Articles;

use App\Actions\Action;
use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\User;
use App\Support\ArticleStatusTransition;

/**
 * Met à jour une actualité et applique une transition de statut si nécessaire.
 */
class UpdateArticle extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(
        Article $article,
        array $data,
        User $actor,
        ArticleStatus $status,
        ArticleStatusTransition $statusTransition,
    ): Article {
        $article->fill($data);

        if ($article->status !== $status) {
            $statusTransition->apply($article, $status, $actor);
        }

        $article->save();

        return $article;
    }
}
