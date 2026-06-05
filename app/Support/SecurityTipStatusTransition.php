<?php

namespace App\Support;

use App\Enums\ArticleStatus;
use App\Models\SecurityTip;
use App\Models\User;

class SecurityTipStatusTransition
{
    public function apply(SecurityTip $securityTip, ArticleStatus $status, User $actor): void
    {
        $previous = $securityTip->status;

        if ($status === ArticleStatus::PendingApproval && $previous !== ArticleStatus::PendingApproval) {
            $securityTip->submitted_at = now();
        }

        if ($status === ArticleStatus::Published) {
            $securityTip->approved_by_id = $actor->id;
            $securityTip->approved_at = now();
            $securityTip->rejected_by_id = null;
            $securityTip->rejected_at = null;

            if ($securityTip->published_at === null) {
                $securityTip->published_at = now();
            }
        }

        if ($status === ArticleStatus::Rejected) {
            $securityTip->rejected_by_id = $actor->id;
            $securityTip->rejected_at = now();
        }

        if ($status === ArticleStatus::Draft) {
            $securityTip->rejected_by_id = null;
            $securityTip->rejected_at = null;
        }

        $securityTip->status = $status;
    }
}
