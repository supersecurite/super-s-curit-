<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Enums\MarketingEmailAccountDriver;
use App\Models\MarketingEmailAccount;
use Illuminate\Support\Facades\DB;

/**
 * Met à jour un compte e-mail (mot de passe SMTP optionnel si vide).
 */
class UpdateMarketingEmailAccount extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(MarketingEmailAccount $account, array $data): MarketingEmailAccount
    {
        return DB::transaction(function () use ($account, $data): MarketingEmailAccount {
            if (array_key_exists('smtp_password', $data) && blank($data['smtp_password'])) {
                unset($data['smtp_password']);
            }

            $isDefault = (bool) ($data['is_default'] ?? $account->is_default);

            if ($isDefault) {
                MarketingEmailAccount::query()
                    ->where('id', '!=', $account->id)
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
                $data['is_default'] = true;
            }

            $driver = $data['driver'] ?? $account->driver;

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

            $account->update($data);

            return $account->refresh();
        });
    }
}
