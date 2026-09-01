<?php

namespace App\Enums;

/** Nature d'une entrée du journal d'accès backoffice. */
enum AccessLogKind: string
{
    case Visit = 'visit';
    case Action = 'action';

    public function label(): string
    {
        return match ($this) {
            self::Visit => 'Consultation',
            self::Action => 'Action',
        };
    }
}
