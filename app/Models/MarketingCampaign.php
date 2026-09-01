<?php

namespace App\Models;

use App\Enums\MarketingCampaignChannel;
use App\Enums\MarketingCampaignSendStatus;
use App\Enums\MarketingCampaignStatus;
use Database\Factories\MarketingCampaignFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/** Campagne marketing e-mail ou WhatsApp vers une liste de contacts. */
#[Fillable([
    'uuid',
    'name',
    'channel',
    'status',
    'marketing_list_id',
    'marketing_message_template_id',
    'subject',
    'body',
    'created_by',
    'launched_at',
    'completed_at',
])]
class MarketingCampaign extends Model
{
    /** @use HasFactory<MarketingCampaignFactory> */
    use HasFactory, SoftDeletes;

    protected static function booted(): void
    {
        static::creating(function (MarketingCampaign $campaign): void {
            if (empty($campaign->uuid)) {
                $campaign->uuid = (string) Str::uuid();
            }

            if (empty($campaign->status)) {
                $campaign->status = MarketingCampaignStatus::Draft;
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
            'channel' => MarketingCampaignChannel::class,
            'status' => MarketingCampaignStatus::class,
            'launched_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<MarketingList, $this>
     */
    public function list(): BelongsTo
    {
        return $this->belongsTo(MarketingList::class, 'marketing_list_id');
    }

    /**
     * @return BelongsTo<MarketingMessageTemplate, $this>
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(MarketingMessageTemplate::class, 'marketing_message_template_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return HasMany<MarketingCampaignSend, $this>
     */
    public function sends(): HasMany
    {
        return $this->hasMany(MarketingCampaignSend::class);
    }

    /**
     * @param  Builder<MarketingCampaign>  $query
     * @return Builder<MarketingCampaign>
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if ($search === null || $search === '') {
            return $query;
        }

        return $query->where(function (Builder $builder) use ($search): void {
            $builder
                ->where('name', 'like', "%{$search}%")
                ->orWhere('subject', 'like', "%{$search}%");
        });
    }

    /**
     * @return array<string, int>
     */
    public function sendStats(): array
    {
        $counts = $this->sends()
            ->selectRaw('status, count(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $stats = [
            'total' => 0,
            'queued' => 0,
            'sent' => 0,
            'received' => 0,
            'delivered' => 0,
            'read' => 0,
            'failed' => 0,
            'bounced' => 0,
        ];

        foreach (MarketingCampaignSendStatus::cases() as $status) {
            $value = (int) ($counts[$status->value] ?? 0);
            $stats[$status->value] = $value;
            $stats['total'] += $value;
        }

        $stats['received'] += $stats['delivered'];
        $stats['delivered'] = 0;

        return $stats;
    }

    /**
     * @return array<string, mixed>
     */
    public function toAdminArray(): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'name' => $this->name,
            'channel' => $this->channel->value,
            'channel_label' => match ($this->channel) {
                MarketingCampaignChannel::Email => 'E-mail',
                MarketingCampaignChannel::WhatsApp => 'WhatsApp',
            },
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'is_editable' => $this->status->isEditable(),
            'marketing_list_id' => $this->marketing_list_id,
            'marketing_message_template_id' => $this->marketing_message_template_id,
            'list' => $this->relationLoaded('list') && $this->list
                ? [
                    'uuid' => $this->list->uuid,
                    'name' => $this->list->name,
                ]
                : null,
            'template' => $this->relationLoaded('template') && $this->template
                ? [
                    'uuid' => $this->template->uuid,
                    'name' => $this->template->name,
                ]
                : null,
            'subject' => $this->subject,
            'body' => $this->body,
            'launched_at' => $this->launched_at?->toIso8601String(),
            'launched_at_formatted' => $this->launched_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'completed_at_formatted' => $this->completed_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_formatted' => $this->created_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'updated_at_formatted' => $this->updated_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'stats' => $this->relationLoaded('sends') ? $this->sendStats() : null,
        ];
    }
}
