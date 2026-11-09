<?php

namespace App\Models;

use Database\Factories\JobOfferFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/**
 * Offre d'emploi publiée sur la page Carrières.
 */
#[Fillable([
    'uuid',
    'slug',
    'title',
    'location',
    'contract_type',
    'description',
    'is_active',
    'published_at',
])]
class JobOffer extends Model
{
    /** @use HasFactory<JobOfferFactory> */
    use HasFactory, SoftDeletes;

    protected static function booted(): void
    {
        static::creating(function (JobOffer $offer): void {
            if (empty($offer->uuid)) {
                $offer->uuid = (string) Str::uuid();
            }

            if (empty($offer->slug)) {
                $offer->slug = static::generateUniqueSlug($offer->title);
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
            'is_active' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    /**
     * @return HasMany<SecurityAgentApplication, $this>
     */
    public function applications(): HasMany
    {
        return $this->hasMany(SecurityAgentApplication::class);
    }

    /**
     * @param  Builder<JobOffer>  $query
     * @return Builder<JobOffer>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public static function generateUniqueSlug(string $title, ?int $id = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug !== '' ? $slug : 'offre';
        $slug = $originalSlug;
        $counter = 1;

        while (static::query()
            ->withTrashed()
            ->where('slug', $slug)
            ->when($id !== null, fn (Builder $query) => $query->where('id', '!=', $id))
            ->exists()) {
            $slug = $originalSlug.'-'.$counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Résumé texte pour la liste publique (sans JSON Lexical brut).
     */
    public function excerpt(int $limit = 180): ?string
    {
        $plain = trim(preg_replace(
            '/\s+/u',
            ' ',
            Article::extractTextFromContent($this->description),
        ) ?? '');

        if ($plain === '') {
            return null;
        }

        return Str::limit($plain, $limit);
    }

    /**
     * Payload liste publique — extrait lisible, sans description Lexical complète.
     *
     * @return array<string, mixed>
     */
    public function toPublicListArray(): array
    {
        return [
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'title' => $this->title,
            'location' => $this->location,
            'contract_type' => $this->contract_type,
            'excerpt' => $this->excerpt(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toPublicArray(): array
    {
        return [
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'title' => $this->title,
            'location' => $this->location,
            'contract_type' => $this->contract_type,
            'description' => $this->description,
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
            'is_active' => $this->is_active,
            'applications_count' => $this->applications_count ?? $this->applications()->count(),
            'published_at' => $this->published_at?->toIso8601String(),
            'published_at_formatted' => $this->published_at?->locale('fr')->isoFormat('D MMM YYYY'),
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_formatted' => $this->created_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'updated_at_formatted' => $this->updated_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
        ];
    }
}
