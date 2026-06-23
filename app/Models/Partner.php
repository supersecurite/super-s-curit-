<?php

namespace App\Models;

use App\Support\MarketingMediaUrl;
use Database\Factories\PartnerFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

#[Fillable([
    'uuid',
    'name',
    'logo',
    'sort_order',
    'is_published',
])]
class Partner extends Model
{
    /** @use HasFactory<PartnerFactory> */
    use HasFactory, SoftDeletes;

    protected static function booted(): void
    {
        static::creating(function (Partner $partner): void {
            if (empty($partner->uuid)) {
                $partner->uuid = (string) Str::uuid();
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
            'sort_order' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    /**
     * @param  Builder<Partner>  $query
     * @return Builder<Partner>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /**
     * @param  Builder<Partner>  $query
     * @return Builder<Partner>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    public function getLogoUrlAttribute(): ?string
    {
        return MarketingMediaUrl::resolve($this->logo);
    }

    public function getLogoSourceAttribute(): ?string
    {
        return MarketingMediaUrl::source($this->logo);
    }

    /**
     * @return array<string, mixed>
     */
    public function toPublicArray(): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'logo' => $this->logo_url,
            'logo_source' => $this->logo_source,
            'sort_order' => $this->sort_order,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toAdminArray(): array
    {
        return [
            ...$this->toPublicArray(),
            'id' => $this->id,
            'logo_path' => $this->logo,
            'is_published' => $this->is_published,
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_formatted' => $this->created_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'updated_at_formatted' => $this->updated_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
        ];
    }
}
