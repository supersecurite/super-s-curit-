<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Enums\MarketingCampaignChannel;
use App\Enums\MarketingCampaignSendStatus;
use App\Enums\MarketingCampaignStatus;
use App\Jobs\SendMarketingCampaignEmailJob;
use App\Jobs\SendMarketingCampaignWhatsAppJob;
use App\Models\MarketingCampaign;
use App\Support\Marketing\BroadcastMarketingCampaignProgress;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Relance les envois échoués d'une campagne e-mail ou WhatsApp.
 */
class RetryFailedMarketingCampaignSends extends Action
{
    public function handle(MarketingCampaign $campaign): int
    {
        $channel = $campaign->channel;

        if ($channel === MarketingCampaignChannel::Email) {
            $account = $campaign->emailAccount;

            if ($account === null || ! $account->is_active) {
                throw ValidationException::withMessages([
                    'marketing_email_account_id' => 'Un compte e-mail actif est requis pour relancer cette campagne.',
                ]);
            }
        }

        if ($channel === MarketingCampaignChannel::WhatsApp) {
            $account = $campaign->whatsappAccount;

            if ($account === null || ! $account->is_active) {
                throw ValidationException::withMessages([
                    'whatsapp_account_id' => 'Un compte WhatsApp actif est requis pour relancer cette campagne.',
                ]);
            }

            $template = $campaign->template;

            if ($template === null || blank($template->meta_template_name)) {
                throw ValidationException::withMessages([
                    'marketing_message_template_id' => 'Un template WhatsApp avec nom Meta est requis pour relancer.',
                ]);
            }
        }

        // Récupère les envois en statut d'échec ou de rebond
        $failedSends = $campaign->sends()
            ->whereIn('status', [
                MarketingCampaignSendStatus::Failed,
                MarketingCampaignSendStatus::Bounced,
            ])
            ->get();

        // Si la campagne n'a aucun envoi créé (échec avant création des jobs), relance globale
        if ($campaign->sends()->count() === 0) {
            app(LaunchMarketingCampaign::class)->handle($campaign);

            return $campaign->sends()->count();
        }

        if ($failedSends->isEmpty()) {
            return 0;
        }

        // Vérification des quotas e-mail si nécessaire
        if ($channel === MarketingCampaignChannel::Email && isset($account) && $account !== null) {
            if (! $account->hasRemainingQuotaFor($failedSends->count())) {
                $remaining = $account->remainingDailyQuota() ?? 0;

                throw ValidationException::withMessages([
                    'marketing_email_account_id' => "Quota journalier insuffisant pour ce compte e-mail ({$remaining} envoi(s) restant(s), {$failedSends->count()} destinataire(s) à relancer).",
                ]);
            }
        }

        DB::transaction(function () use ($campaign, $failedSends, $channel): void {
            $campaign->update([
                'status' => MarketingCampaignStatus::Sending,
                'completed_at' => null,
            ]);

            foreach ($failedSends as $send) {
                $send->update([
                    'status' => MarketingCampaignSendStatus::Queued,
                    'failed_at' => null,
                    'failure_reason' => null,
                    'sent_at' => null,
                    'delivered_at' => null,
                    'read_at' => null,
                    'queued_at' => now(),
                ]);

                if ($channel === MarketingCampaignChannel::WhatsApp) {
                    SendMarketingCampaignWhatsAppJob::dispatch($send);
                } else {
                    SendMarketingCampaignEmailJob::dispatch($send);
                }
            }
        });

        $campaign = $campaign->refresh();
        BroadcastMarketingCampaignProgress::dispatch($campaign);

        return $failedSends->count();
    }
}
