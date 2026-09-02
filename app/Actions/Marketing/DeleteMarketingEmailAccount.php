<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingEmailAccount;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Supprime un compte e-mail s'il n'est pas lié à des campagnes.
 */
class DeleteMarketingEmailAccount extends Action
{
    public function handle(MarketingEmailAccount $account): void
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
                MarketingEmailAccount::query()
                    ->where('is_active', true)
                    ->orderBy('id')
                    ->limit(1)
                    ->update(['is_default' => true]);
            }
        });
    }
}
