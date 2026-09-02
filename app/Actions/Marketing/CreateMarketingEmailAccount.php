<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Enums\MarketingEmailAccountDriver;
use App\Models\MarketingEmailAccount;
use Illuminate\Support\Facades\DB;

/**
 * Crée un compte e-mail marketing et gère le flag is_default.
 */
class CreateMarketingEmailAccount extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data): MarketingEmailAccount
    {
        return DB::transaction(function () use ($data): MarketingEmailAccount {
            $isDefault = (bool) ($data['is_default'] ?? false);

            if ($isDefault) {
                MarketingEmailAccount::query()->where('is_default', true)->update(['is_default' => false]);
            }

            if (! MarketingEmailAccount::query()->exists()) {
                $data['is_default'] = true;
            }

            $driver = $data['driver'] ?? MarketingEmailAccountDriver::Smtp;

            if (! $driver instanceof MarketingEmailAccountDriver) {
                $driver = MarketingEmailAccountDriver::from((string) $driver);
            }

            $data['driver'] = $driver;

            if ($driver === MarketingEmailAccountDriver::Log) {
                $data['smtp_host'] = null;
                $data['smtp_port'] = null;
                $data['smtp_encryption'] = null;
                $data['smtp_username'] = null;
                $data['smtp_password'] = null;
            }

            return MarketingEmailAccount::query()->create($data);
        });
    }
}
