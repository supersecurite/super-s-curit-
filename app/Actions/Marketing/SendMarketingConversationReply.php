<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Enums\MarketingConversationMessageDirection;
use App\Mail\MarketingConversationReplyMailable;
use App\Models\MarketingConversation;
use App\Models\MarketingConversationMessage;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

/**
 * Envoie une réponse manuelle depuis le backoffice dans le fil contact.
 */
class SendMarketingConversationReply extends Action
{
    public function handle(
        MarketingConversation $conversation,
        User $user,
        string $body,
        ?string $subject = null,
    ): MarketingConversationMessage {
        $contact = $conversation->contact;

        if ($contact === null || $contact->email === null || $contact->email === '') {
            throw ValidationException::withMessages([
                'body' => 'Ce contact n\'a pas d\'adresse e-mail utilisable.',
            ]);
        }

        $subject ??= $conversation->subject !== null
            ? (str_starts_with(strtolower($conversation->subject), 're:')
                ? $conversation->subject
                : 'Re: '.$conversation->subject)
            : 'Message Super Sécurité';

        $message = MarketingConversationMessage::query()->create([
            'marketing_conversation_id' => $conversation->id,
            'user_id' => $user->id,
            'direction' => MarketingConversationMessageDirection::Outbound,
            'from_email' => (string) config('mail.from.address'),
            'to_email' => $contact->email,
            'subject' => $subject,
            'body_html' => nl2br(e($body)),
            'body_text' => $body,
            'sent_at' => now(),
        ]);

        Mail::to($contact->email)->send(new MarketingConversationReplyMailable($conversation, $message));

        $conversation->update([
            'subject' => $subject,
            'last_message_at' => $message->sent_at,
        ]);

        return $message;
    }
}
