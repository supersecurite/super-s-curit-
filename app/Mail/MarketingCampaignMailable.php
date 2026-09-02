<?php

namespace App\Mail;

use App\Models\MarketingCampaignSend;
use App\Models\MarketingEmailAccount;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MarketingCampaignMailable extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public MarketingCampaignSend $send,
        public ?MarketingEmailAccount $emailAccount = null,
    ) {}

    public function envelope(): Envelope
    {
        $account = $this->emailAccount ?? $this->send->campaign?->emailAccount;

        $envelope = [
            'subject' => $this->send->subject,
        ];

        if ($account !== null && filled($account->from_address)) {
            $envelope['from'] = new Address(
                $account->from_address,
                $account->from_name ?: null,
            );
        }

        return new Envelope(...$envelope);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.marketing-campaign',
        );
    }
}
