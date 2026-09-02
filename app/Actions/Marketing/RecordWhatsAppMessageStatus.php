<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Enums\MarketingCampaignSendStatus;
use App\Jobs\SyncMarketingCampaignCompletionJob;
use App\Models\MarketingCampaignSend;
use App\Support\Marketing\BroadcastMarketingCampaignProgress;

/**
 * Met à jour le statut d'un envoi WhatsApp à partir d'un webhook Meta.
 */
class RecordWhatsAppMessageStatus extends Action
{
    public function handle(string $providerMessageId, string $status, ?string $errorMessage = null): ?MarketingCampaignSend
    {
        $send = MarketingCampaignSend::query()
            ->where('provider_message_id', $providerMessageId)
            ->first();

        if ($send === null) {
            return null;
        }

        $mapped = match ($status) {
            'sent' => MarketingCampaignSendStatus::Sent,
            'delivered' => MarketingCampaignSendStatus::Received,
            'read' => MarketingCampaignSendStatus::Read,
            'failed' => MarketingCampaignSendStatus::Failed,
            default => null,
        };

        if ($mapped === null) {
            return $send;
        }

        $payload = ['status' => $mapped];

        if ($mapped === MarketingCampaignSendStatus::Sent && $send->sent_at === null) {
            $payload['sent_at'] = now();
        }

        if ($mapped === MarketingCampaignSendStatus::Received) {
            $payload['delivered_at'] = $send->delivered_at ?? now();
            if ($send->sent_at === null) {
                $payload['sent_at'] = now();
            }
        }

        if ($mapped === MarketingCampaignSendStatus::Read) {
            $payload['read_at'] = now();
            $payload['delivered_at'] = $send->delivered_at ?? now();
            if ($send->sent_at === null) {
                $payload['sent_at'] = now();
            }
        }

        if ($mapped === MarketingCampaignSendStatus::Failed) {
            $payload['failed_at'] = now();
            $payload['failure_reason'] = $errorMessage ?? $send->failure_reason;
        }

        $send->update($payload);
        $send = $send->fresh(['campaign', 'contact']);

        if ($send?->campaign !== null) {
            BroadcastMarketingCampaignProgress::dispatch($send->campaign, $send);
            SyncMarketingCampaignCompletionJob::dispatch($send->campaign);
        }

        return $send;
    }
}
