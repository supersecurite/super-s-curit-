<?php

namespace App\Models;

use Database\Factories\MarketingListFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/** Liste de diffusion marketing (audience pour campagnes). */
#[Fillable([
    'uuid',
    'name',
    'description',
])]
class MarketingList extends Model
{
    /** @use HasFactory<MarketingListFactory> */
    use HasFactory, SoftDeletes;

    protected static function booted(): void
    {
        static::creating(function (MarketingList $list): void {
            if (empty($list->uuid)) {
                $list->uuid = (string) Str::uuid();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * @return BelongsToMany<MarketingContact, $this>
     */
    public function contacts(): BelongsToMany
    {
        return $this->belongsToMany(MarketingContact::class)->withTimestamps();
    }

    /**
     * @param  Builder<MarketingList>  $query
     * @return Builder<MarketingList>
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if ($search === null || $search === '') {
            return $query;
        }

        return $query->where(function (Builder $builder) use ($search): void {
            $builder
                ->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
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
            'description' => $this->description,
            'contacts_count' => $this->contacts_count ?? $this->contacts()->count(),
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_formatted' => $this->created_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'updated_at_formatted' => $this->updated_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
        ];
    }
}
