<?php

namespace App\Jobs;

use App\Enums\MarketingCampaignSendStatus;
use App\Models\MarketingCampaignSend;
use App\Models\MarketingContact;
use App\Services\Marketing\WhatsAppCloudApiService;
use App\Support\Marketing\BroadcastMarketingCampaignProgress;
use App\Support\Marketing\RenderMarketingMessageTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

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

        if ($campaign === null || $account === null || $template === null || $contact === null) {
            $send->update([
                'status' => MarketingCampaignSendStatus::Failed,
                'failed_at' => now(),
                'failure_reason' => 'Compte WhatsApp, template ou contact manquant.',
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
            $parameters = $this->bodyParameters($campaign->body, $contact);

            $result = $whatsApp->sendTemplateMessage(
                $account,
                $send->recipient_phone,
                (string) $template->meta_template_name,
                (string) ($template->meta_template_language ?: 'fr'),
                $parameters,
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
     * @return list<string>
     */
    private function bodyParameters(string $body, MarketingContact $contact): array
    {
        $plain = RenderMarketingMessageTemplate::render($body, $contact);

        // Les paramètres Meta sont souvent dérivés des variables ; on envoie prénom/nom/entreprise si présents.
        $values = array_values(array_filter([
            $contact->first_name ?? '',
            $contact->last_name ?? '',
            $contact->company_name ?? '',
        ], fn (string $value): bool => $value !== ''));

        if ($values !== []) {
            return $values;
        }

        return $plain !== '' ? [mb_substr($plain, 0, 100)] : [];
    }
}
