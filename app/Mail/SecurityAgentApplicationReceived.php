<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SecurityAgentApplicationReceived extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  array<string, mixed>  $application
     */
    public function __construct(
        public array $application,
    ) {}

    public function envelope(): Envelope
    {
        $replyTo = [];

        if (! empty($this->application['email'])) {
            $replyTo[] = $this->application['email'];
        }

        return new Envelope(
            subject: 'Nouvelle candidature — Super Sécurité',
            replyTo: $replyTo,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.security-agent-application-received',
        );
    }
}
