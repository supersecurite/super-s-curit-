<?php

namespace App\Console\Commands;

use App\Actions\AccessLogs\PruneAccessLogs;
use Illuminate\Console\Command;

class PruneAccessLogsCommand extends Command
{
    protected $signature = 'access-logs:prune {--days= : Jours de rétention (défaut = configuration)}';

    protected $description = 'Purge le journal d\'accès au-delà de la rétention';

    public function handle(PruneAccessLogs $action): int
    {
        $days = $this->option('days');
        $deleted = $action->handle($days !== null && $days !== '' ? (int) $days : null);
        $this->info("Journaux purgés : {$deleted}");

        return self::SUCCESS;
    }
}
