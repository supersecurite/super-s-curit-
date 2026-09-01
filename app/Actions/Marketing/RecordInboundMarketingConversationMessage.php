<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Enums\MarketingConversationMessageDirection;
use App\Models\MarketingCampaignSend;
use App\Models\MarketingConversation;
use App\Models\MarketingConversationMessage;
use App\Support\Marketing\MarketingReplyAddress;
use Illuminate\Support\Carbon;

/**
 * Enregistre un e-mail entrant (réponse destinataire) dans le fil contact.
 */
class RecordInboundMarketingConversationMessage extends Action
{
    public function __construct(
        private ResolveMarketingConversation $resolveConversation,
    ) {}

    public function handle(array $payload): ?MarketingConversationMessage
    {
        $token = $this->resolveReplyToken($payload);

        if ($token === null) {
            return null;
        }

        $send = MarketingCampaignSend::query()->where('reply_token', $token)->first();
        $conversation = MarketingConversation::query()->where('reply_token', $token)->first();

        if ($send === null && $conversation === null) {
            return null;
        }

        $contact = $send?->contact ?? $conversation?->contact;

        if ($contact === null) {
            return null;
        }

        $conversation ??= $this->resolveConversation->handle(
            $contact,
            $payload['subject'] ?? null,
        );

        $messageId = $payload['email_message_id'] ?? null;

        if ($messageId !== null && MarketingConversationMessage::query()->where('email_message_id', $messageId)->exists()) {
            return null;
        }

        $message = MarketingConversationMessage::query()->create([
            'marketing_conversation_id' => $conversation->id,
            'marketing_campaign_send_id' => $send?->id,
            'direction' => MarketingConversationMessageDirection::Inbound,
            'from_email' => $payload['from_email'],
            'to_email' => $payload['to_email'],
            'subject' => $payload['subject'] ?? null,
            'body_html' => $payload['body_html'] ?? null,
            'body_text' => $payload['body_text'] ?? null,
            'email_message_id' => $messageId,
            'sent_at' => isset($payload['sent_at']) ? Carbon::parse($payload['sent_at']) : now(),
        ]);

        $conversation->update([
            'subject' => $payload['subject'] ?? $conversation->subject,
            'unread_inbound_count' => $conversation->unread_inbound_count + 1,
            'last_message_at' => $message->sent_at,
        ]);

        return $message;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function resolveReplyToken(array $payload): ?string
    {
        foreach ($this->recipientAddresses($payload['to_email'] ?? '') as $address) {
            $token = MarketingReplyAddress::extractTokenFromAddress($address);

            if ($token !== null) {
                return $token;
            }
        }

        return null;
    }

    /**
     * @return list<string>
     */
    private function recipientAddresses(string|array $to): array
    {
        if (is_array($to)) {
            return array_values(array_filter(array_map('strval', $to)));
        }

        return array_values(array_filter(array_map('trim', preg_split('/[,;]/', $to) ?: [])));
    }
}
