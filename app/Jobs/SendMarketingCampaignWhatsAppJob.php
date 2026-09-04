<?php

namespace App\Jobs;

use App\Enums\MarketingCampaignSendStatus;
use App\Models\MarketingCampaignSend;
use App\Models\MarketingContact;
use App\Models\MarketingMessageTemplate;
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
                $this->resolveBodyParameters($template, $contact),
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
     * Calcule exactement les paramètres positionnels Meta {{1}}, {{2}} requis par le template.
     * Si le template ne contient aucune variable positionnelle (ex. hello_world), renvoie un tableau vide.
     *
     * @return list<string>
     */
    private function resolveBodyParameters(MarketingMessageTemplate $template, MarketingContact $contact): array
    {
        $body = (string) $template->body;

        preg_match_all('/\{\{(\d+)\}\}/', $body, $matches);

        if (empty($matches[1])) {
            return [];
        }

        $expectedCount = max(array_map('intval', $matches[1]));

        if ($expectedCount <= 0) {
            return [];
        }

        [$givenName, $familyName] = $contact->nameParts();
        $fullName = $contact->full_name !== '—' && filled($contact->full_name)
            ? $contact->full_name
            : ($givenName ?: 'Client');

        $pool = [
            1 => $fullName,
            2 => filled($contact->company_name) ? $contact->company_name : ($familyName ?: 'Super Sécurité'),
            3 => filled($contact->phone) ? $contact->phone : '+224 620 00 00 00',
            4 => filled($contact->email) ? $contact->email : 'contact@supersecurite.com',
        ];

        $parameters = [];
        for ($i = 1; $i <= $expectedCount; $i++) {
            $value = $pool[$i] ?? ('Paramètre '.$i);
            $parameters[] = filled($value) ? (string) $value : '—';
        }

        return $parameters;
    }
}
