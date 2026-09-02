<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Enums\WhatsAppAccountDriver;
use App\Models\WhatsAppAccount;
use Illuminate\Support\Facades\DB;

/**
 * Crée un compte WhatsApp Meta et gère le flag is_default.
 */
class CreateWhatsAppAccount extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data): WhatsAppAccount
    {
        return DB::transaction(function () use ($data): WhatsAppAccount {
            $isDefault = (bool) ($data['is_default'] ?? false);

            if ($isDefault) {
                WhatsAppAccount::query()->where('is_default', true)->update(['is_default' => false]);
            }

            if (! WhatsAppAccount::query()->exists()) {
                $data['is_default'] = true;
            }

            $driver = $data['driver'] ?? WhatsAppAccountDriver::Meta;

            if (! $driver instanceof WhatsAppAccountDriver) {
                $driver = WhatsAppAccountDriver::from((string) $driver);
            }

            $data['driver'] = $driver;

            return WhatsAppAccount::query()->create($data);
        });
    }
}
