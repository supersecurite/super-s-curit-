<?php

namespace App\Models;

use App\Enums\ServiceId;
use App\Support\YoutubeUrl;
use Database\Factories\GalleryVideoFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'service_id',
    'youtube_url',
    'title',
    'description',
    'sort_order',
    'is_published',
])]
class GalleryVideo extends Model
{
    /** @use HasFactory<GalleryVideoFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'service_id' => ServiceId::class,
            'sort_order' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    /**
     * @param  Builder<GalleryVideo>  $query
     * @return Builder<GalleryVideo>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /**
     * @param  Builder<GalleryVideo>  $query
     * @return Builder<GalleryVideo>
     */
    public function scopeForService(Builder $query, ServiceId|string $serviceId): Builder
    {
        $value = $serviceId instanceof ServiceId ? $serviceId->value : $serviceId;

        return $query->where('service_id', $value);
    }

    /**
     * @param  Builder<GalleryVideo>  $query
     * @return Builder<GalleryVideo>
     */
    public function scopeGeneral(Builder $query): Builder
    {
        return $query->whereNull('service_id');
    }

    /**
     * @param  Builder<GalleryVideo>  $query
     * @return Builder<GalleryVideo>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    public function getYoutubeIdAttribute(): ?string
    {
        return YoutubeUrl::parseId($this->youtube_url);
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        $videoId = $this->youtube_id;

        return $videoId !== null ? YoutubeUrl::thumbnailUrl($videoId) : null;
    }

    public function getEmbedUrlAttribute(): ?string
    {
        $videoId = $this->youtube_id;

        return $videoId !== null ? YoutubeUrl::embedUrl($videoId) : null;
    }

    /**
     * @return array<string, mixed>
     */
    public function toPublicArray(): array
    {
        return [
            'id' => $this->id,
            'service_id' => $this->service_id?->value,
            'service_label' => $this->service_id?->label() ?? 'Galerie générale',
            'title' => $this->title,
            'description' => $this->description,
            'youtube_url' => $this->youtube_url,
            'youtube_id' => $this->youtube_id,
            'thumbnail_url' => $this->thumbnail_url,
            'embed_url' => $this->embed_url,
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
            'is_published' => $this->is_published,
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_formatted' => $this->created_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'updated_at_formatted' => $this->updated_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
        ];
    }
}
