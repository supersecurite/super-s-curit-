<?php

namespace App\Mail;

use App\Models\MarketingConversation;
use App\Models\MarketingConversationMessage;
use App\Support\Marketing\MarketingReplyAddress;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MarketingConversationReplyMailable extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public MarketingConversation $conversation,
        public MarketingConversationMessage $message,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: (string) $this->message->subject,
            replyTo: [
                new Address(MarketingReplyAddress::forConversation($this->conversation)),
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.marketing-conversation-reply',
        );
    }
}
