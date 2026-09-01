<?php

namespace App\Models;

use App\Enums\MarketingCampaignSendStatus;
use Database\Factories\MarketingCampaignSendFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/** Envoi individuel d'une campagne marketing vers un contact. */
#[Fillable([
    'uuid',
    'marketing_campaign_id',
    'marketing_contact_id',
    'recipient_email',
    'recipient_name',
    'status',
    'subject',
    'body_html',
    'open_token',
    'queued_at',
    'sent_at',
    'delivered_at',
    'read_at',
    'failed_at',
    'failure_reason',
    'provider_message_id',
])]
class MarketingCampaignSend extends Model
{
    /** @use HasFactory<MarketingCampaignSendFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function (MarketingCampaignSend $send): void {
            if (empty($send->uuid)) {
                $send->uuid = (string) Str::uuid();
            }

            if (empty($send->open_token)) {
                $send->open_token = (string) Str::uuid();
            }

            if (empty($send->status)) {
                $send->status = MarketingCampaignSendStatus::Queued;
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
            'status' => MarketingCampaignSendStatus::class,
            'queued_at' => 'datetime',
            'sent_at' => 'datetime',
            'delivered_at' => 'datetime',
            'read_at' => 'datetime',
            'failed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<MarketingCampaign, $this>
     */
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(MarketingCampaign::class, 'marketing_campaign_id');
    }

    /**
     * @return BelongsTo<MarketingContact, $this>
     */
    public function contact(): BelongsTo
    {
        return $this->belongsTo(MarketingContact::class, 'marketing_contact_id');
    }

    /**
     * @return array<string, mixed>
     */
    public function toAdminArray(): array
    {
        return [
            'uuid' => $this->uuid,
            'recipient_email' => $this->recipient_email,
            'recipient_name' => $this->recipient_name,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'subject' => $this->subject,
            'sent_at' => $this->sent_at?->toIso8601String(),
            'sent_at_formatted' => $this->sent_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'delivered_at' => $this->delivered_at?->toIso8601String(),
            'delivered_at_formatted' => $this->delivered_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'read_at' => $this->read_at?->toIso8601String(),
            'read_at_formatted' => $this->read_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'failed_at' => $this->failed_at?->toIso8601String(),
            'failed_at_formatted' => $this->failed_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'failure_reason' => $this->failure_reason,
            'contact' => $this->relationLoaded('contact') && $this->contact
                ? [
                    'uuid' => $this->contact->uuid,
                    'full_name' => $this->contact->full_name,
                ]
                : null,
        ];
    }
}
