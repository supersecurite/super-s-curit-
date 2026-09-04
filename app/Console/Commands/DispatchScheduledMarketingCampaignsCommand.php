<?php

namespace App\Console\Commands;

use App\Actions\Marketing\LaunchMarketingCampaign;
use App\Enums\MarketingCampaignStatus;
use App\Models\MarketingCampaign;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Throwable;

#[Signature('marketing:dispatch-scheduled-campaigns')]
#[Description('Lance les campagnes marketing dont la date de planification est atteinte')]
class DispatchScheduledMarketingCampaignsCommand extends Command
{
    public function handle(LaunchMarketingCampaign $action): int
    {
        $campaigns = MarketingCampaign::query()
            ->where('status', MarketingCampaignStatus::Scheduled)
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '<=', now())
            ->orderBy('scheduled_at')
            ->get();

        if ($campaigns->isEmpty()) {
            $this->info('Aucune campagne planifiée à lancer.');

            return self::SUCCESS;
        }

        $launched = 0;
        $failed = 0;

        foreach ($campaigns as $campaign) {
            try {
                $action->handle($campaign);
                $launched++;
                $this->info("Campagne « {$campaign->name} » lancée.");
            } catch (Throwable $exception) {
                $failed++;
                report($exception);
                $this->error("Échec « {$campaign->name} » : {$exception->getMessage()}");
            }
        }

        $this->info("Terminé : {$launched} lancée(s), {$failed} échec(s).");

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }
}
