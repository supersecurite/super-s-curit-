<?php

namespace App\Models;

use App\Enums\ArticleStatus;
use Database\Factories\SecurityTipFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

#[Fillable([
    'title',
    'slug',
    'status',
    'excerpt',
    'content',
    'image',
    'category',
    'tags',
    'featured',
    'views',
    'read_time',
    'published_at',
    'created_by_id',
    'approved_by_id',
    'rejected_by_id',
    'submitted_at',
    'approved_at',
    'rejected_at',
])]
class SecurityTip extends Model
{
    /** @use HasFactory<SecurityTipFactory> */
    use HasFactory, SoftDeletes;

    protected static function booted(): void
    {
        static::saving(function (SecurityTip $securityTip): void {
            if ($securityTip->isDirty('title')) {
                $securityTip->slug = static::generateUniqueSlug(
                    $securityTip->title,
                    $securityTip->exists ? $securityTip->id : null,
                );
            }

            if ($securityTip->content !== null) {
                $securityTip->read_time = static::calculateReadingTime($securityTip->content);
            }
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ArticleStatus::class,
            'tags' => 'array',
            'featured' => 'boolean',
            'views' => 'integer',
            'read_time' => 'integer',
            'published_at' => 'datetime',
            'submitted_at' => 'datetime',
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function rejectedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rejected_by_id');
    }

    /**
     * @param  Builder<SecurityTip>  $query
     * @return Builder<SecurityTip>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('status', ArticleStatus::Published)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function isPublished(): bool
    {
        return $this->status === ArticleStatus::Published
            && $this->published_at !== null
            && $this->published_at->lte(now());
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getImageUrlAttribute(): ?string
    {
        if ($this->image === null) {
            return null;
        }

        if (str_starts_with($this->image, 'http')) {
            return $this->image;
        }

        return '/storage/'.$this->image;
    }

    public function getFormattedReadTimeAttribute(): string
    {
        $minutes = max(1, $this->read_time ?? 1);

        return $minutes === 1 ? '1 min de lecture' : $minutes.' min de lecture';
    }

    public static function generateUniqueSlug(string $title, ?int $id = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        while (static::query()
            ->where('slug', $slug)
            ->when($id !== null, fn (Builder $query) => $query->where('id', '!=', $id))
            ->exists()) {
            $slug = $originalSlug.'-'.$counter;
            $counter++;
        }

        return $slug;
    }

    public static function calculateReadingTime(?string $content): int
    {
        if ($content === null || trim($content) === '') {
            return 1;
        }

        $textContent = static::extractTextFromContent($content);
        $textContent = trim($textContent);

        if ($textContent === '') {
            return 1;
        }

        $wordCount = str_word_count($textContent);
        $readingTime = (int) ceil($wordCount / 200);

        return max(1, $readingTime);
    }

    public static function extractTextFromContent(?string $content): string
    {
        if ($content === null || trim($content) === '') {
            return '';
        }

        $trimmed = trim($content);

        if (! str_starts_with($trimmed, '{') && ! str_starts_with($trimmed, '[')) {
            return strip_tags($content);
        }

        try {
            $lexicalData = json_decode($content, true, 512, JSON_THROW_ON_ERROR);

            if (is_array($lexicalData)
                && isset($lexicalData['root']['children'])
                && is_array($lexicalData['root']['children'])) {
                return trim(static::extractTextFromLexicalNodes($lexicalData['root']['children']));
            }
        } catch (\JsonException) {
            return strip_tags($content);
        }

        return strip_tags($content);
    }

    /**
     * @param  list<array<string, mixed>>  $nodes
     */
    private static function extractTextFromLexicalNodes(array $nodes): string
    {
        $text = '';

        foreach ($nodes as $node) {
            if (! is_array($node)) {
                continue;
            }

            if (($node['type'] ?? null) === 'image') {
                continue;
            }

            if (($node['type'] ?? null) === 'text' && isset($node['text'])) {
                $text .= $node['text'].' ';
            }

            if (isset($node['children']) && is_array($node['children'])) {
                $text .= static::extractTextFromLexicalNodes($node['children']);
            }
        }

        return $text;
    }

    /**
     * @return array<string, mixed>
     */
    public function toPublicArray(bool $includeContent = false): array
    {
        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'image' => $this->image,
            'image_url' => $this->image_url,
            'category' => $this->category,
            'tags' => $this->tags ?? [],
            'featured' => $this->featured,
            'views' => $this->views,
            'read_time' => $this->read_time,
            'formatted_read_time' => $this->formatted_read_time,
            'published_at' => $this->published_at?->toIso8601String(),
            'published_at_formatted' => $this->published_at?->locale('fr')->isoFormat('D MMMM YYYY'),
        ];

        if ($includeContent) {
            $data['content'] = $this->content;
        }

        return $data;
    }

    /**
     * @return array<string, mixed>
     */
    public function toAdminArray(bool $includeContent = false): array
    {
        return [
            ...$this->toPublicArray($includeContent),
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'created_by' => $this->formatUserReference($this->createdBy),
            'approved_by' => $this->formatUserReference($this->approvedBy),
            'rejected_by' => $this->formatUserReference($this->rejectedBy),
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_formatted' => $this->created_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'submitted_at' => $this->submitted_at?->toIso8601String(),
            'submitted_at_formatted' => $this->submitted_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'approved_at' => $this->approved_at?->toIso8601String(),
            'approved_at_formatted' => $this->approved_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'rejected_at' => $this->rejected_at?->toIso8601String(),
            'rejected_at_formatted' => $this->rejected_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
        ];
    }

    /**
     * @return array{id: int, name: string}|null
     */
    private function formatUserReference(?User $user): ?array
    {
        if ($user === null) {
            return null;
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
        ];
    }
}
