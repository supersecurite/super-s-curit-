<?php

namespace App\Console\Commands;

use App\Actions\Marketing\PurgeMarketingData;
use App\Enums\UserRole;
use App\Models\MarketingEmailAccount;
use App\Models\User;
use App\Models\WhatsAppAccount;
use Illuminate\Console\Command;

/**
 * Purge locale des données marketing (hors comptes e-mail / WhatsApp).
 * Réservée à l'environnement local et à un super administrateur.
 */
class PurgeMarketingDataCommand extends Command
{
    protected $signature = 'marketing:purge
                            {email : E-mail d\'un compte super_admin}
                            {--force : Confirmer sans interaction}';

    protected $description = 'Vide contacts, listes, templates et campagnes marketing (conserve les comptes). Local + super_admin uniquement.';

    public function handle(PurgeMarketingData $action): int
    {
        if (! app()->isLocal()) {
            $this->error('Cette commande est disponible uniquement en environnement local.');

            return self::FAILURE;
        }

        $email = (string) $this->argument('email');
        $actor = User::query()->where('email', $email)->first();

        if ($actor === null || $actor->role !== UserRole::SuperAdmin) {
            $this->error('Seul un super administrateur existant peut lancer cette commande.');

            return self::FAILURE;
        }

        $this->warn('Cette opération va supprimer définitivement :');
        $this->line('  • campagnes et envois');
        $this->line('  • contacts et groupes');
        $this->line('  • templates e-mail / WhatsApp');
        $this->newLine();
        $this->info('Conservés : comptes e-mail ('.MarketingEmailAccount::query()->count().') et comptes WhatsApp ('.WhatsAppAccount::query()->count().').');

        if (! $this->option('force') && ! $this->confirm('Confirmer la purge marketing ?', false)) {
            $this->info('Opération annulée.');

            return self::SUCCESS;
        }

        $counts = $action->handle();

        $this->info(sprintf(
            'Purge terminée par %s — envois: %d, campagnes: %d, contacts: %d, listes: %d, templates: %d.',
            $actor->email,
            $counts['sends'],
            $counts['campaigns'],
            $counts['contacts'],
            $counts['lists'],
            $counts['templates'],
        ));

        return self::SUCCESS;
    }
}
