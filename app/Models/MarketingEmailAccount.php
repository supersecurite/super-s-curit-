<?php

namespace App\Models;

use App\Enums\MarketingCampaignSendStatus;
use App\Enums\MarketingEmailAccountDriver;
use Database\Factories\MarketingEmailAccountFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/** Compte d'envoi e-mail marketing (SMTP multi-comptes + quota journalier). */
#[Fillable([
    'uuid',
    'name',
    'from_address',
    'from_name',
    'driver',
    'smtp_host',
    'smtp_port',
    'smtp_encryption',
    'smtp_username',
    'smtp_password',
    'daily_send_limit',
    'is_active',
    'is_default',
])]
class MarketingEmailAccount extends Model
{
    /** @use HasFactory<MarketingEmailAccountFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function (MarketingEmailAccount $account): void {
            if (empty($account->uuid)) {
                $account->uuid = (string) Str::uuid();
            }

            if (empty($account->driver)) {
                $account->driver = MarketingEmailAccountDriver::Smtp;
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
            'smtp_password' => 'encrypted',
            'driver' => MarketingEmailAccountDriver::class,
            'smtp_port' => 'integer',
            'daily_send_limit' => 'integer',
            'is_active' => 'boolean',
            'is_default' => 'boolean',
        ];
    }

    /**
     * @return HasMany<MarketingCampaign, $this>
     */
    public function campaigns(): HasMany
    {
        return $this->hasMany(MarketingCampaign::class, 'marketing_email_account_id');
    }

    /**
     * Nombre d'e-mails effectivement envoyés aujourd'hui via ce compte.
     */
    public function sentTodayCount(): int
    {
        return MarketingCampaignSend::query()
            ->whereHas('campaign', fn ($query) => $query->where('marketing_email_account_id', $this->id))
            ->whereDate('sent_at', today())
            ->whereIn('status', [
                MarketingCampaignSendStatus::Sent,
                MarketingCampaignSendStatus::Received,
                MarketingCampaignSendStatus::Delivered,
                MarketingCampaignSendStatus::Read,
            ])
            ->count();
    }

    /**
     * Quota journalier restant ; `null` = illimité.
     */
    public function remainingDailyQuota(): ?int
    {
        if ($this->daily_send_limit === null) {
            return null;
        }

        return max(0, $this->daily_send_limit - $this->sentTodayCount());
    }

    public function hasRemainingQuotaFor(int $plannedSends): bool
    {
        $remaining = $this->remainingDailyQuota();

        if ($remaining === null) {
            return true;
        }

        return $plannedSends <= $remaining;
    }

    /**
     * @return array<string, mixed>
     */
    public function toAdminArray(): array
    {
        $sentToday = $this->sentTodayCount();
        $remaining = $this->remainingDailyQuota();

        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'name' => $this->name,
            'from_address' => $this->from_address,
            'from_name' => $this->from_name,
            'driver' => $this->driver?->value ?? MarketingEmailAccountDriver::Smtp->value,
            'driver_label' => ($this->driver ?? MarketingEmailAccountDriver::Smtp)->label(),
            'smtp_host' => $this->smtp_host,
            'smtp_port' => $this->smtp_port,
            'smtp_encryption' => $this->smtp_encryption,
            'smtp_username' => $this->smtp_username,
            'has_smtp_password' => filled($this->smtp_password),
            'daily_send_limit' => $this->daily_send_limit,
            'sent_today' => $sentToday,
            'remaining_today' => $remaining,
            'is_active' => $this->is_active,
            'is_default' => $this->is_default,
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_formatted' => $this->created_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'updated_at_formatted' => $this->updated_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
        ];
    }
}
