<?php

namespace App\Models;

use App\Enums\AccessLogKind;
use Database\Factories\AccessLogFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/** Journal d'accès et d'actions backoffice — qui a fait quoi, quand. */
#[Fillable([
    'uuid',
    'user_id',
    'kind',
    'http_method',
    'route_name',
    'ip',
    'user_agent',
    'browser',
    'browser_version',
    'platform',
    'country_code',
    'country',
    'page',
    'description',
    'visited_at',
])]
class AccessLog extends Model
{
    /** @use HasFactory<AccessLogFactory> */
    use HasFactory, SoftDeletes;

    protected static function booted(): void
    {
        static::creating(function (AccessLog $log): void {
            if (empty($log->uuid)) {
                $log->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'kind' => AccessLogKind::class,
            'visited_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function toFeedArray(): array
    {
        return [
            'uuid' => $this->uuid,
            'user_name' => $this->user?->name,
            'user_email' => $this->user?->email,
            'kind' => $this->kind?->value,
            'kind_label' => $this->kind?->label(),
            'http_method' => $this->http_method,
            'page' => $this->page,
            'description' => $this->description,
            'visited_at' => $this->visited_at?->toIso8601String(),
            'ip' => $this->ip,
            'browser' => $this->browser,
            'browser_version' => $this->browser_version,
            'platform' => $this->platform,
            'browser_label' => $this->browserLabel(),
            'country_code' => $this->country_code,
            'country' => $this->country,
        ];
    }

    public function browserLabel(): ?string
    {
        if ($this->browser === null || $this->browser === '') {
            return null;
        }

        $label = $this->browser;

        if ($this->browser_version !== null && $this->browser_version !== '') {
            $label .= ' '.$this->browser_version;
        }

        if ($this->platform !== null && $this->platform !== '') {
            $label .= ' · '.$this->platform;
        }

        return $label;
    }

    /**
     * Filtre les logs liés au chemin courant (page ou ressource parente).
     */
    public function scopeForContext(Builder $query, ?string $path): Builder
    {
        $path = trim((string) $path, '/');

        if ($path === '') {
            return $query;
        }

        $segments = explode('/', $path);
        $base = $segments[0] ?? $path;

        return $query->where(function (Builder $inner) use ($path, $base): void {
            $inner->where('page', 'like', '%/'.$path.'%')
                ->orWhere('page', 'like', '%/'.$path)
                ->orWhere('page', 'like', '%/'.$base.'%');
        });
    }
}
