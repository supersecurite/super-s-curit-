<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Enums\MarketingCampaignChannel;
use App\Enums\MarketingCampaignSendStatus;
use App\Enums\MarketingCampaignStatus;
use App\Jobs\SendMarketingCampaignEmailJob;
use App\Jobs\SendMarketingCampaignWhatsAppJob;
use App\Models\MarketingCampaign;
use App\Models\MarketingCampaignSend;
use App\Support\Marketing\BroadcastMarketingCampaignProgress;
use App\Support\Marketing\RenderMarketingMessageTemplate;
use App\Support\Marketing\ResolveMarketingCampaignAudience;
use App\Support\Marketing\ResolveMarketingCampaignRecipient;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Lance ou planifie une campagne e-mail / WhatsApp.
 */
class LaunchMarketingCampaign extends Action
{
    public function handle(MarketingCampaign $campaign, ?CarbonInterface $scheduledAt = null): MarketingCampaign
    {
        if (! $campaign->status->canLaunch()) {
            throw ValidationException::withMessages([
                'campaign' => 'Seule une campagne en brouillon ou planifiée peut être lancée.',
            ]);
        }

        if ($scheduledAt !== null && $scheduledAt->isFuture()) {
            $campaign->update([
                'status' => MarketingCampaignStatus::Scheduled,
                'scheduled_at' => $scheduledAt,
                'launched_at' => null,
                'completed_at' => null,
            ]);

            return $campaign->refresh();
        }

        $channel = $campaign->channel;

        if ($channel === MarketingCampaignChannel::Email) {
            $account = $campaign->emailAccount;

            if ($account === null || ! $account->is_active) {
                throw ValidationException::withMessages([
                    'marketing_email_account_id' => 'Un compte e-mail actif est requis pour lancer cette campagne.',
                ]);
            }

            if ($campaign->template === null && $campaign->marketing_message_template_id === null) {
                throw ValidationException::withMessages([
                    'marketing_message_template_id' => 'Un template e-mail est requis pour lancer cette campagne.',
                ]);
            }
        }

        if ($channel === MarketingCampaignChannel::WhatsApp) {
            $account = $campaign->whatsappAccount;

            if ($account === null || ! $account->is_active) {
                throw ValidationException::withMessages([
                    'whatsapp_account_id' => 'Un compte WhatsApp actif est requis pour lancer cette campagne.',
                ]);
            }

            $template = $campaign->template;

            if ($template === null || blank($template->meta_template_name)) {
                throw ValidationException::withMessages([
                    'marketing_message_template_id' => 'Un template WhatsApp avec nom Meta est requis.',
                ]);
            }
        }

        $contacts = ResolveMarketingCampaignAudience::eligibleContacts($campaign, $channel);

        if ($contacts->isEmpty()) {
            $hint = $channel === MarketingCampaignChannel::WhatsApp
                ? 'Aucun contact éligible (consentement + téléphone) dans l\'audience.'
                : 'Aucun contact éligible (consentement + e-mail) dans l\'audience.';

            throw ValidationException::withMessages([
                'list_uuids' => $hint,
            ]);
        }

        if ($channel === MarketingCampaignChannel::Email) {
            $emailAccount = $campaign->emailAccount;

            if ($emailAccount !== null && ! $emailAccount->hasRemainingQuotaFor($contacts->count())) {
                $remaining = $emailAccount->remainingDailyQuota() ?? 0;

                throw ValidationException::withMessages([
                    'marketing_email_account_id' => "Quota journalier insuffisant pour ce compte e-mail ({$remaining} envoi(s) restant(s), {$contacts->count()} destinataire(s)).",
                ]);
            }
        }

        DB::transaction(function () use ($campaign, $contacts, $channel): void {
            $campaign->update([
                'status' => MarketingCampaignStatus::Sending,
                'launched_at' => now(),
                'scheduled_at' => null,
                'completed_at' => null,
            ]);

            foreach ($contacts as $contact) {
                if ($channel === MarketingCampaignChannel::WhatsApp) {
                    $phone = ResolveMarketingCampaignRecipient::phone($contact);

                    if ($phone === null) {
                        continue;
                    }

                    $send = MarketingCampaignSend::query()->create([
                        'marketing_campaign_id' => $campaign->id,
                        'marketing_contact_id' => $contact->id,
                        'recipient_email' => ResolveMarketingCampaignRecipient::email($contact),
                        'recipient_phone' => $phone,
                        'recipient_name' => $contact->full_name !== '—' ? $contact->full_name : null,
                        'status' => MarketingCampaignSendStatus::Queued,
                        'subject' => $campaign->template?->meta_template_name ?? $campaign->name,
                        'body_html' => '',
                        'open_token' => (string) Str::uuid(),
                        'queued_at' => now(),
                    ]);

                    SendMarketingCampaignWhatsAppJob::dispatch($send);

                    continue;
                }

                $recipientEmail = ResolveMarketingCampaignRecipient::email($contact);

                if ($recipientEmail === null) {
                    continue;
                }

                $subject = RenderMarketingMessageTemplate::render($campaign->subject, $contact);
                $bodyHtml = RenderMarketingMessageTemplate::renderHtml($campaign->body, $contact);

                $send = MarketingCampaignSend::query()->create([
                    'marketing_campaign_id' => $campaign->id,
                    'marketing_contact_id' => $contact->id,
                    'recipient_email' => $recipientEmail,
                    'recipient_name' => $contact->full_name !== '—' ? $contact->full_name : null,
                    'status' => MarketingCampaignSendStatus::Queued,
                    'subject' => $subject,
                    'body_html' => $bodyHtml,
                    'open_token' => (string) Str::uuid(),
                    'queued_at' => now(),
                ]);

                SendMarketingCampaignEmailJob::dispatch($send);
            }
        });

        $campaign = $campaign->refresh();

        BroadcastMarketingCampaignProgress::dispatch($campaign);

        return $campaign;
    }
}
