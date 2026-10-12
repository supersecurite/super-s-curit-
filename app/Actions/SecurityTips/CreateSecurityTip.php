<?php

namespace App\Actions\SecurityTips;

use App\Actions\Action;
use App\Enums\ArticleStatus;
use App\Models\SecurityTip;
use App\Models\User;
use App\Support\SecurityTipStatusTransition;

/**
 * Crée un conseil de sécurité avec champs FR + EN optionnels.
 */
class CreateSecurityTip extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(
        array $data,
        User $author,
        SecurityTipStatusTransition $statusTransition,
        ArticleStatus $status = ArticleStatus::PendingApproval,
    ): SecurityTip {
        $tip = new SecurityTip($data);
        $tip->created_by_id = $author->id;
        $statusTransition->apply($tip, $status, $author);
        $tip->save();

        return $tip;
    }
}
