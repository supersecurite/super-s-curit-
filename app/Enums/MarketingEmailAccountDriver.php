<?php

namespace App\Enums;

enum MarketingEmailAccountDriver: string
{
    case Smtp = 'smtp';
    case Log = 'log';

    public function label(): string
    {
        return match ($this) {
            self::Smtp => 'SMTP',
            self::Log => 'Log (démo locale)',
        };
    }
}
