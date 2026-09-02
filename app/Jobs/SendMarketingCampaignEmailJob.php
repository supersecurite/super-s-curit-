<?php

namespace App\Jobs;

use App\Enums\MarketingCampaignSendStatus;
use App\Mail\MarketingCampaignMailable;
use App\Models\MarketingCampaignSend;
use App\Support\Marketing\BroadcastMarketingCampaignProgress;
use App\Support\Marketing\ConfigureMarketingEmailMailer;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class SendMarketingCampaignEmailJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public MarketingCampaignSend $send,
    ) {}

    public function handle(): void
    {
        $send = $this->send->fresh(['campaign.emailAccount']);

        if ($send === null || $send->status !== MarketingCampaignSendStatus::Queued) {
            return;
        }

        $account = $send->campaign?->emailAccount;

        if ($account === null || ! $account->is_active) {
            $send->update([
                'status' => MarketingCampaignSendStatus::Failed,
                'failed_at' => now(),
                'failure_reason' => 'Compte e-mail manquant ou inactif.',
            ]);

            if ($send->campaign !== null) {
                BroadcastMarketingCampaignProgress::dispatch($send->campaign, $send->fresh(['contact']));
                SyncMarketingCampaignCompletionJob::dispatch($send->campaign);
            }

            return;
        }

        if (! $account->hasRemainingQuotaFor(1)) {
            $send->update([
                'status' => MarketingCampaignSendStatus::Failed,
                'failed_at' => now(),
                'failure_reason' => 'Quota journalier du compte e-mail atteint.',
            ]);

            if ($send->campaign !== null) {
                BroadcastMarketingCampaignProgress::dispatch($send->campaign, $send->fresh(['contact']));
                SyncMarketingCampaignCompletionJob::dispatch($send->campaign);
            }

            return;
        }

        try {
            ConfigureMarketingEmailMailer::mailer($account)
                ->to($send->recipient_email)
                ->send(new MarketingCampaignMailable($send, $account));

            $now = now();

            $send->update([
                'status' => MarketingCampaignSendStatus::Received,
                'sent_at' => $now,
                'delivered_at' => $now,
            ]);
        } catch (Throwable $exception) {
            $send->update([
                'status' => MarketingCampaignSendStatus::Failed,
                'failed_at' => now(),
                'failure_reason' => $exception->getMessage(),
            ]);
        }

        if ($send->campaign !== null) {
            BroadcastMarketingCampaignProgress::dispatch($send->campaign, $send->fresh(['contact']));
            SyncMarketingCampaignCompletionJob::dispatch($send->campaign);
        }
    }
}
