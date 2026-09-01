<?php

namespace App\Actions\AccessLogs;

use App\Actions\Action;
use App\Models\AccessLog;

/** Purge le journal d'accès au-delà de la rétention configurée. */
class PruneAccessLogs extends Action
{
    public function handle(?int $days = null): int
    {
        $days ??= (int) config('super-securite.access_logs.retention_days', 365);
        $before = now()->subDays($days);

        return AccessLog::query()
            ->where('visited_at', '<', $before)
            ->delete();
    }
}
