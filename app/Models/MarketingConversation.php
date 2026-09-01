<?php

namespace App\Models;

use Database\Factories\MarketingConversationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/** Fil de conversation e-mail avec un contact marketing (réponses campagne). */
#[Fillable([
    'uuid',
    'marketing_contact_id',
    'reply_token',
    'subject',
    'unread_inbound_count',
    'last_message_at',
])]
class MarketingConversation extends Model
{
    /** @use HasFactory<MarketingConversationFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function (MarketingConversation $conversation): void {
            if (empty($conversation->uuid)) {
                $conversation->uuid = (string) Str::uuid();
            }

            if (empty($conversation->reply_token)) {
                $conversation->reply_token = (string) Str::uuid();
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
            'last_message_at' => 'datetime',
            'unread_inbound_count' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<MarketingContact, $this>
     */
    public function contact(): BelongsTo
    {
        return $this->belongsTo(MarketingContact::class, 'marketing_contact_id');
    }

    /**
     * @return HasMany<MarketingConversationMessage, $this>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(MarketingConversationMessage::class)->orderBy('sent_at');
    }

    /**
     * @return array<string, mixed>
     */
    public function toAdminArray(): array
    {
        return [
            'uuid' => $this->uuid,
            'subject' => $this->subject,
            'unread_inbound_count' => $this->unread_inbound_count,
            'last_message_at' => $this->last_message_at?->toIso8601String(),
            'last_message_at_formatted' => $this->last_message_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'contact' => $this->relationLoaded('contact') && $this->contact
                ? [
                    'uuid' => $this->contact->uuid,
                    'full_name' => $this->contact->full_name,
                    'email' => $this->contact->email,
                ]
                : null,
        ];
    }
}
