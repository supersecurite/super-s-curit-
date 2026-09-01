<?php

namespace App\Models;

use App\Enums\MarketingConversationMessageDirection;
use Database\Factories\MarketingConversationMessageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/** Message entrant ou sortant d'une conversation marketing. */
#[Fillable([
    'uuid',
    'marketing_conversation_id',
    'marketing_campaign_send_id',
    'user_id',
    'direction',
    'from_email',
    'to_email',
    'subject',
    'body_html',
    'body_text',
    'email_message_id',
    'sent_at',
])]
class MarketingConversationMessage extends Model
{
    /** @use HasFactory<MarketingConversationMessageFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function (MarketingConversationMessage $message): void {
            if (empty($message->uuid)) {
                $message->uuid = (string) Str::uuid();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'direction' => MarketingConversationMessageDirection::class,
            'sent_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<MarketingConversation, $this>
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(MarketingConversation::class, 'marketing_conversation_id');
    }

    /**
     * @return BelongsTo<MarketingCampaignSend, $this>
     */
    public function campaignSend(): BelongsTo
    {
        return $this->belongsTo(MarketingCampaignSend::class, 'marketing_campaign_send_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function toAdminArray(): array
    {
        return [
            'uuid' => $this->uuid,
            'direction' => $this->direction->value,
            'direction_label' => $this->direction->label(),
            'from_email' => $this->from_email,
            'to_email' => $this->to_email,
            'subject' => $this->subject,
            'body_html' => $this->body_html,
            'body_text' => $this->body_text,
            'sent_at' => $this->sent_at->toIso8601String(),
            'sent_at_formatted' => $this->sent_at->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'author_name' => $this->relationLoaded('user') && $this->user
                ? $this->user->name
                : null,
        ];
    }
}
