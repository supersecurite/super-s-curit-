<?php

namespace App\Mail;

use App\Models\MarketingCampaignSend;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MarketingCampaignMailable extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public MarketingCampaignSend $send,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->send->subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.marketing-campaign',
        );
    }
}
