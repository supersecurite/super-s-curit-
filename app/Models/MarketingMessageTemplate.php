<?php

namespace App\Models;

use App\Enums\MarketingMessageTemplateChannel;
use Database\Factories\MarketingMessageTemplateFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/** Modèle de message réutilisable pour campagnes e-mail ou WhatsApp. */
#[Fillable([
    'uuid',
    'name',
    'channel',
    'subject',
    'body',
    'meta_template_name',
    'meta_template_language',
])]
class MarketingMessageTemplate extends Model
{
    /** @use HasFactory<MarketingMessageTemplateFactory> */
    use HasFactory, SoftDeletes;

    protected static function booted(): void
    {
        static::creating(function (MarketingMessageTemplate $template): void {
            if (empty($template->uuid)) {
                $template->uuid = (string) Str::uuid();
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
            'channel' => MarketingMessageTemplateChannel::class,
        ];
    }

    /**
     * @param  Builder<MarketingMessageTemplate>  $query
     * @return Builder<MarketingMessageTemplate>
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if ($search === null || $search === '') {
            return $query;
        }

        return $query->where(function (Builder $builder) use ($search): void {
            $builder
                ->where('name', 'like', "%{$search}%")
                ->orWhere('subject', 'like', "%{$search}%")
                ->orWhere('body', 'like', "%{$search}%");
        });
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
                MarketingMessageTemplateChannel::Email => 'E-mail',
                MarketingMessageTemplateChannel::WhatsApp => 'WhatsApp',
            },
            'subject' => $this->subject,
            'body' => $this->body,
            'meta_template_name' => $this->meta_template_name,
            'meta_template_language' => $this->meta_template_language,
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_formatted' => $this->created_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'updated_at_formatted' => $this->updated_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
        ];
    }
}
