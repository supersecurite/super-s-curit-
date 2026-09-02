<?php

namespace App\Models;

use App\Enums\WhatsAppAccountDriver;
use Database\Factories\WhatsAppAccountFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/** Compte / configuration Meta WhatsApp Cloud API (multi-comptes). */
#[Fillable([
    'uuid',
    'name',
    'phone_number_id',
    'business_account_id',
    'access_token',
    'app_secret',
    'verify_token',
    'driver',
    'is_active',
    'is_default',
])]
class WhatsAppAccount extends Model
{
    /** @use HasFactory<WhatsAppAccountFactory> */
    use HasFactory;

    protected $table = 'whatsapp_accounts';

    protected static function booted(): void
    {
        static::creating(function (WhatsAppAccount $account): void {
            if (empty($account->uuid)) {
                $account->uuid = (string) Str::uuid();
            }

            if (empty($account->driver)) {
                $account->driver = WhatsAppAccountDriver::Meta;
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
            'access_token' => 'encrypted',
            'app_secret' => 'encrypted',
            'driver' => WhatsAppAccountDriver::class,
            'is_active' => 'boolean',
            'is_default' => 'boolean',
        ];
    }

    /**
     * @return HasMany<MarketingCampaign, $this>
     */
    public function campaigns(): HasMany
    {
        return $this->hasMany(MarketingCampaign::class, 'whatsapp_account_id');
    }

    /**
     * Données admin sans secrets en clair.
     *
     * @return array<string, mixed>
     */
    public function toAdminArray(bool $includeWebhookUrl = false): array
    {
        $data = [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'name' => $this->name,
            'phone_number_id' => $this->phone_number_id,
            'business_account_id' => $this->business_account_id,
            'verify_token' => $this->verify_token,
            'driver' => $this->driver?->value ?? WhatsAppAccountDriver::Meta->value,
            'driver_label' => ($this->driver ?? WhatsAppAccountDriver::Meta)->label(),
            'is_active' => $this->is_active,
            'is_default' => $this->is_default,
            'has_access_token' => filled($this->access_token),
            'has_app_secret' => filled($this->app_secret),
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_formatted' => $this->created_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'updated_at_formatted' => $this->updated_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
        ];

        if ($includeWebhookUrl) {
            $data['webhook_url'] = url('/webhooks/marketing/whatsapp/'.$this->uuid);
        }

        return $data;
    }
}
