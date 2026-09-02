<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\WhatsAppAccount;
use Illuminate\Support\Facades\DB;

/**
 * Met à jour un compte WhatsApp (tokens optionnels si vides).
 */
class UpdateWhatsAppAccount extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(WhatsAppAccount $account, array $data): WhatsAppAccount
    {
        return DB::transaction(function () use ($account, $data): WhatsAppAccount {
            if (array_key_exists('access_token', $data) && blank($data['access_token'])) {
                unset($data['access_token']);
            }

            if (array_key_exists('app_secret', $data) && blank($data['app_secret'])) {
                unset($data['app_secret']);
            }

            $isDefault = (bool) ($data['is_default'] ?? $account->is_default);

            if ($isDefault) {
                WhatsAppAccount::query()
                    ->where('id', '!=', $account->id)
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
                $data['is_default'] = true;
            }

            $account->update($data);

            return $account->refresh();
        });
    }
}
