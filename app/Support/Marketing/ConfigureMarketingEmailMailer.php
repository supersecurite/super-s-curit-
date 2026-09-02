<?php

namespace App\Support\Marketing;

use App\Enums\MarketingEmailAccountDriver;
use App\Models\MarketingEmailAccount;
use Illuminate\Contracts\Mail\Mailer;
use Illuminate\Support\Facades\Mail;
use InvalidArgumentException;

/**
 * Construit un mailer Laravel nommé pour un compte e-mail marketing.
 */
final class ConfigureMarketingEmailMailer
{
    public static function mailer(MarketingEmailAccount $account): Mailer
    {
        $name = 'marketing_email_'.$account->getKey();
        $driver = $account->driver ?? MarketingEmailAccountDriver::Smtp;

        if ($driver === MarketingEmailAccountDriver::Log) {
            config([
                "mail.mailers.{$name}" => [
                    'transport' => 'log',
                ],
            ]);

            return Mail::mailer($name);
        }

        if (blank($account->smtp_host) || blank($account->smtp_port)) {
            throw new InvalidArgumentException('Configuration SMTP incomplète pour ce compte e-mail.');
        }

        config([
            "mail.mailers.{$name}" => [
                'transport' => 'smtp',
                'host' => $account->smtp_host,
                'port' => $account->smtp_port,
                'encryption' => $account->smtp_encryption ?: null,
                'username' => $account->smtp_username,
                'password' => $account->smtp_password,
                'timeout' => null,
            ],
        ]);

        return Mail::mailer($name);
    }
}
