<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Enums\MarketingCampaignSendStatus;
use App\Enums\MarketingCampaignStatus;
use App\Jobs\SendMarketingCampaignEmailJob;
use App\Models\MarketingCampaign;
use App\Models\MarketingCampaignSend;
use App\Support\Marketing\BroadcastMarketingCampaignProgress;
use App\Support\Marketing\RenderMarketingMessageTemplate;
use App\Support\Marketing\ResolveMarketingCampaignRecipient;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Lance une campagne e-mail : crée les envois individuels et les met en file.
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

        $contacts = $campaign->list()
            ->firstOrFail()
            ->contacts()
            ->where('marketing_consent', true)
            ->get()
            ->filter(fn ($contact) => ResolveMarketingCampaignRecipient::isEligible($contact));

        if ($contacts->isEmpty()) {
            throw ValidationException::withMessages([
                'marketing_list_id' => 'Aucun contact éligible (consentement + e-mail) dans cette liste.',
            ]);
        }

        DB::transaction(function () use ($campaign, $contacts): void {
            $campaign->update([
                'status' => MarketingCampaignStatus::Sending,
                'launched_at' => now(),
                'completed_at' => null,
            ]);

            foreach ($contacts as $contact) {
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
