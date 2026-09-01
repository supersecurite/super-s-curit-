<?php

namespace App\Models;

use App\Support\Marketing\MarketingCompanyContactRules;
use App\Support\Marketing\ResolveMarketingContactChannels;
use Database\Factories\MarketingContactFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/** Contact marketing (e-mail, téléphone, consentement) pour campagnes futures. */
#[Fillable([
    'uuid',
    'first_name',
    'last_name',
    'email',
    'phone',
    'is_company',
    'company_name',
    'company_role',
    'company_contacts',
    'address',
    'tags',
    'marketing_consent',
    'notes',
])]
class MarketingContact extends Model
{
    /** @use HasFactory<MarketingContactFactory> */
    use HasFactory, SoftDeletes;

    protected static function booted(): void
    {
        static::creating(function (MarketingContact $contact): void {
            if (empty($contact->uuid)) {
                $contact->uuid = (string) Str::uuid();
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
            'tags' => 'array',
            'company_contacts' => 'array',
            'is_company' => 'boolean',
            'marketing_consent' => 'boolean',
        ];
    }

    /**
     * @return BelongsToMany<MarketingList, $this>
     */
    public function lists(): BelongsToMany
    {
        return $this->belongsToMany(MarketingList::class)->withTimestamps();
    }

    /**
     * @return HasOne<MarketingConversation, $this>
     */
    public function conversation(): HasOne
    {
        return $this->hasOne(MarketingConversation::class, 'marketing_contact_id');
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}") ?: '—';
    }

    /**
     * Canaux campagne (e-mail, téléphone, WhatsApp) du contact principal et de l'entreprise.
     *
     * @return array{
     *     emails: list<array{value: string, label: string|null, person_name: string|null, scope: string}>,
     *     phones: list<array{value: string, label: string|null, person_name: string|null, scope: string}>,
     *     whatsapp: list<array{value: string, label: string|null, person_name: string|null, scope: string}>,
     *     cc_emails: list<string>
     * }
     */
    public function campaignChannels(): array
    {
        return ResolveMarketingContactChannels::forCampaign($this);
    }

    /**
     * @param  Builder<MarketingContact>  $query
     * @return Builder<MarketingContact>
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if ($search === null || $search === '') {
            return $query;
        }

        return $query->where(function (Builder $builder) use ($search): void {
            $builder
                ->where('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%")
                ->orWhere('company_name', 'like', "%{$search}%")
                ->orWhere('company_role', 'like', "%{$search}%")
                ->orWhere('company_contacts', 'like', "%{$search}%")
                ->orWhere('address', 'like', "%{$search}%");
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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'is_company' => $this->is_company,
            'company_name' => $this->company_name,
            'company_role' => $this->company_role,
            'company_contacts' => MarketingCompanyContactRules::normalize($this->company_contacts),
            'campaign_channels' => $this->campaignChannels(),
            'address' => $this->address,
            'tags' => $this->tags ?? [],
            'marketing_consent' => $this->marketing_consent,
            'notes' => $this->notes,
            'lists_count' => $this->lists_count ?? $this->lists()->count(),
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_formatted' => $this->created_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'updated_at_formatted' => $this->updated_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
        ];
    }
}
