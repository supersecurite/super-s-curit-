<?php

namespace App\Models;

use App\Support\LocaleUrl;
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
    'title_en',
    'title_zh',
    'location',
    'location_en',
    'location_zh',
    'contract_type',
    'contract_type_en',
    'contract_type_zh',
    'description',
    'description_en',
    'description_zh',
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
     * Résout les champs publics pour la locale courante (fallback FR).
     *
     * @return array{
     *     title: string,
     *     location: string,
     *     contract_type: string,
     *     description: string|null,
     *     is_fallback: bool,
     *     has_english: bool,
     *     has_chinese: bool
     * }
     */
    public function localized(?string $locale = null): array
    {
        $locale ??= app()->getLocale();
        $hasEnglish = filled($this->title_en);
        $hasChinese = filled($this->title_zh);

        if ($locale === 'en' && $hasEnglish) {
            return [
                'title' => (string) $this->title_en,
                'location' => $this->location_en ?: $this->location,
                'contract_type' => $this->contract_type_en ?: $this->contract_type,
                'description' => filled($this->description_en) ? $this->description_en : $this->description,
                'is_fallback' => false,
                'has_english' => true,
                'has_chinese' => $hasChinese,
            ];
        }

        if ($locale === 'zh' && $hasChinese) {
            return [
                'title' => (string) $this->title_zh,
                'location' => $this->location_zh ?: $this->location,
                'contract_type' => $this->contract_type_zh ?: $this->contract_type,
                'description' => filled($this->description_zh) ? $this->description_zh : $this->description,
                'is_fallback' => false,
                'has_english' => $hasEnglish,
                'has_chinese' => true,
            ];
        }

        return [
            'title' => (string) $this->title,
            'location' => (string) $this->location,
            'contract_type' => (string) $this->contract_type,
            'description' => $this->description,
            'is_fallback' => $locale !== LocaleUrl::defaultLocale(),
            'has_english' => $hasEnglish,
            'has_chinese' => $hasChinese,
        ];
    }

    /**
     * Résumé texte pour la liste publique (sans JSON Lexical brut).
     */
    public function excerpt(int $limit = 180, ?string $description = null): ?string
    {
        $plain = trim(preg_replace(
            '/\s+/u',
            ' ',
            Article::extractTextFromContent($description ?? $this->description),
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
        $localized = $this->localized();

        return [
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'title' => $localized['title'],
            'location' => $localized['location'],
            'contract_type' => $localized['contract_type'],
            'excerpt' => $this->excerpt(description: $localized['description']),
            'is_locale_fallback' => $localized['is_fallback'],
            'has_english' => $localized['has_english'],
            'has_chinese' => $localized['has_chinese'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toPublicArray(): array
    {
        $localized = $this->localized();

        return [
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'title' => $localized['title'],
            'location' => $localized['location'],
            'contract_type' => $localized['contract_type'],
            'description' => $localized['description'],
            'is_locale_fallback' => $localized['is_fallback'],
            'has_english' => $localized['has_english'],
            'has_chinese' => $localized['has_chinese'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toAdminArray(): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'title' => $this->title,
            'title_en' => $this->title_en,
            'title_zh' => $this->title_zh,
            'location' => $this->location,
            'location_en' => $this->location_en,
            'location_zh' => $this->location_zh,
            'contract_type' => $this->contract_type,
            'contract_type_en' => $this->contract_type_en,
            'contract_type_zh' => $this->contract_type_zh,
            'description' => $this->description,
            'description_en' => $this->description_en,
            'description_zh' => $this->description_zh,
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
