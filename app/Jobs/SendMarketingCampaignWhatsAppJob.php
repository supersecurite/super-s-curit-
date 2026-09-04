<?php

namespace App\Jobs;

use App\Enums\MarketingCampaignSendStatus;
use App\Models\MarketingCampaignSend;
use App\Models\MarketingContact;
use App\Services\Marketing\WhatsAppCloudApiService;
use App\Support\Marketing\BroadcastMarketingCampaignProgress;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

/**
 * Envoie un message WhatsApp via le modèle Meta du template associé à la campagne.
 */
class SendMarketingCampaignWhatsAppJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public MarketingCampaignSend $send,
    ) {}

    public function handle(WhatsAppCloudApiService $whatsApp): void
    {
        $send = $this->send->fresh(['campaign.whatsappAccount', 'campaign.template', 'contact']);

        if ($send === null || $send->status !== MarketingCampaignSendStatus::Queued) {
            return;
        }

        $campaign = $send->campaign;
        $account = $campaign?->whatsappAccount;
        $template = $campaign?->template;
        $contact = $send->contact;

        if (
            $campaign === null
            || $account === null
            || $template === null
            || blank($template->meta_template_name)
            || $contact === null
        ) {
            $send->update([
                'status' => MarketingCampaignSendStatus::Failed,
                'failed_at' => now(),
                'failure_reason' => 'Compte WhatsApp ou modèle Meta manquant.',
            ]);

            if ($campaign !== null) {
                BroadcastMarketingCampaignProgress::dispatch($campaign, $send->fresh(['contact']));
                SyncMarketingCampaignCompletionJob::dispatch($campaign);
            }

            return;
        }

        if (blank($send->recipient_phone)) {
            $send->update([
                'status' => MarketingCampaignSendStatus::Failed,
                'failed_at' => now(),
                'failure_reason' => 'Numéro WhatsApp manquant.',
            ]);

            BroadcastMarketingCampaignProgress::dispatch($campaign, $send->fresh(['contact']));
            SyncMarketingCampaignCompletionJob::dispatch($campaign);

            return;
        }

        try {
            $result = $whatsApp->sendTemplateMessage(
                $account,
                $send->recipient_phone,
                (string) $template->meta_template_name,
                (string) ($template->meta_template_language ?: 'fr'),
                $this->bodyParameters($contact),
            );

            $send->update([
                'status' => MarketingCampaignSendStatus::Sent,
                'sent_at' => now(),
                'provider_message_id' => $result['provider_message_id'],
            ]);
        } catch (Throwable $exception) {
            $send->update([
                'status' => MarketingCampaignSendStatus::Failed,
                'failed_at' => now(),
                'failure_reason' => $exception->getMessage(),
            ]);
        }

        BroadcastMarketingCampaignProgress::dispatch($campaign, $send->fresh(['contact']));
        SyncMarketingCampaignCompletionJob::dispatch($campaign);
    }

    /**
     * Paramètres positionnels Meta {{1}}, {{2}}, {{3}} — début du nom, reste du nom, entreprise.
     *
     * @return list<string>
     */
    private function bodyParameters(MarketingContact $contact): array
    {
        [$givenName, $familyName] = $contact->nameParts();

        return array_values(array_filter([
            $givenName,
            $familyName,
            $contact->company_name ?? '',
        ], fn (string $value): bool => $value !== ''));
    }
}
