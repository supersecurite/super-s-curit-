<?php

namespace App\Enums;

enum WhatsAppAccountDriver: string
{
    case Meta = 'meta';
    case Log = 'log';

    public function label(): string
    {
        return bt('enums.WhatsAppAccountDriver.'.$this->name, [], match ($this) {
            self::Meta => 'Meta Cloud API',
            self::Log => 'Log (démo locale)',
        });
    }
}
