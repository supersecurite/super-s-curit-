<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\WhatsAppAccount;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Supprime un compte WhatsApp s'il n'est pas lié à des campagnes.
 */
class DeleteWhatsAppAccount extends Action
{
    public function handle(WhatsAppAccount $account): void
    {
        if ($account->campaigns()->exists()) {
            throw ValidationException::withMessages([
                'account' => 'Impossible de supprimer un compte lié à des campagnes.',
            ]);
        }

        DB::transaction(function () use ($account): void {
            $wasDefault = $account->is_default;
            $account->delete();

            if ($wasDefault) {
                WhatsAppAccount::query()
                    ->where('is_active', true)
                    ->orderBy('id')
                    ->limit(1)
                    ->update(['is_default' => true]);
            }
        });
    }
}
