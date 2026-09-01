<?php

namespace App\Jobs;

use App\Enums\MarketingCampaignSendStatus;
use App\Mail\MarketingCampaignMailable;
use App\Models\MarketingCampaignSend;
use App\Support\Marketing\BroadcastMarketingCampaignProgress;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendMarketingCampaignEmailJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public MarketingCampaignSend $send,
    ) {}

    public function handle(): void
    {
        $send = $this->send->fresh(['campaign']);

        if ($send === null || $send->status !== MarketingCampaignSendStatus::Queued) {
            return;
        }

        try {
            Mail::to($send->recipient_email)->send(new MarketingCampaignMailable($send));

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
