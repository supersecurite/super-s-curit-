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
use App\Support\Marketing\ResolveMarketingCampaignRecipient;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Lance une campagne e-mail ou WhatsApp : crée les envois individuels et les met en file.
 */
class LaunchMarketingCampaign extends Action
{
    public function handle(MarketingCampaign $campaign): MarketingCampaign
    {
        if ($campaign->status !== MarketingCampaignStatus::Draft) {
            throw ValidationException::withMessages([
                'campaign' => 'Seule une campagne en brouillon peut être lancée.',
            ]);
        }

        $channel = $campaign->channel;

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

        $contacts = $campaign->list()
            ->firstOrFail()
            ->contacts()
            ->where('marketing_consent', true)
            ->get()
            ->filter(fn ($contact) => ResolveMarketingCampaignRecipient::isEligibleFor($contact, $channel));

        if ($contacts->isEmpty()) {
            $hint = $channel === MarketingCampaignChannel::WhatsApp
                ? 'Aucun contact éligible (consentement + téléphone) dans ce groupe.'
                : 'Aucun contact éligible (consentement + e-mail) dans ce groupe.';

            throw ValidationException::withMessages([
                'marketing_list_id' => $hint,
            ]);
        }

        DB::transaction(function () use ($campaign, $contacts, $channel): void {
            $campaign->update([
                'status' => MarketingCampaignStatus::Sending,
                'launched_at' => now(),
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
