<?php

namespace App\Models;

use App\Enums\SecurityAgentApplicationStatus;
use App\Enums\SecurityAgentPost;
use Database\Factories\SecurityAgentApplicationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable([
    'uuid',
    'first_name',
    'last_name',
    'phone',
    'email',
    'experience_years',
    'availability',
    'certifications',
    'motivation',
    'post',
    'region_id',
    'region_name',
    'prefecture_id',
    'prefecture_name',
    'commune_id',
    'commune_name',
    'quartier_id',
    'quartier_name',
    'address_detail',
    'status',
    'internal_notes',
    'reviewed_by_id',
    'contacted_at',
])]
class SecurityAgentApplication extends Model
{
    /** @use HasFactory<SecurityAgentApplicationFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function (SecurityAgentApplication $application): void {
            if (empty($application->uuid)) {
                $application->uuid = (string) Str::uuid();
            }

            if (empty($application->status)) {
                $application->status = SecurityAgentApplicationStatus::Pending;
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
            'status' => SecurityAgentApplicationStatus::class,
            'post' => SecurityAgentPost::class,
            'experience_years' => 'integer',
            'contacted_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by_id');
    }

    public function getFullNameAttribute(): string
    {
        return trim($this->first_name.' '.$this->last_name);
    }

    /**
     * @return array<string, mixed>
     */
    public function toAdminArray(): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'phone' => $this->phone,
            'email' => $this->email,
            'experience_years' => $this->experience_years,
            'availability' => $this->availability,
            'availability_label' => $this->availabilityLabel(),
            'certifications' => $this->certifications,
            'motivation' => $this->motivation,
            'post' => $this->post?->value,
            'post_label' => $this->postLabel(),
            'region_id' => $this->region_id,
            'region_name' => $this->region_name,
            'prefecture_id' => $this->prefecture_id,
            'prefecture_name' => $this->prefecture_name,
            'commune_id' => $this->commune_id,
            'commune_name' => $this->commune_name,
            'quartier_id' => $this->quartier_id,
            'quartier_name' => $this->quartier_name,
            'address_detail' => $this->address_detail,
            'location_summary' => $this->locationSummary(),
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'internal_notes' => $this->internal_notes,
            'reviewed_by' => $this->formatUserReference($this->reviewedBy),
            'contacted_at' => $this->contacted_at?->toIso8601String(),
            'contacted_at_formatted' => $this->contacted_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_formatted' => $this->created_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    public function locationSummary(): string
    {
        $parts = array_filter([
            $this->commune_name,
            $this->prefecture_name,
            $this->region_name,
        ]);

        return implode(', ', $parts);
    }

    public function postLabel(): ?string
    {
        return $this->post?->label();
    }

    public function availabilityLabel(): ?string
    {
        return match ($this->availability) {
            'jour' => 'Jour',
            'nuit' => 'Nuit',
            '24h' => '24h/24',
            'evenementiel' => 'Événementiel',
            default => $this->availability,
        };
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
