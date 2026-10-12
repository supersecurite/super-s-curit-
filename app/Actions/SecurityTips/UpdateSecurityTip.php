<?php

namespace App\Actions\SecurityTips;

use App\Actions\Action;
use App\Enums\ArticleStatus;
use App\Models\SecurityTip;
use App\Models\User;
use App\Support\SecurityTipStatusTransition;

/**
 * Met à jour un conseil de sécurité et applique une transition de statut si nécessaire.
 */
class UpdateSecurityTip extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(
        SecurityTip $securityTip,
        array $data,
        User $actor,
        ArticleStatus $status,
        SecurityTipStatusTransition $statusTransition,
    ): SecurityTip {
        $securityTip->fill($data);

        if ($securityTip->status !== $status) {
            $statusTransition->apply($securityTip, $status, $actor);
        }

        $securityTip->save();

        return $securityTip;
    }
}
