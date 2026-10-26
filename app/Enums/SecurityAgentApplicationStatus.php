<?php

namespace App\Enums;

enum SecurityAgentApplicationStatus: string
{
    case Pending = 'pending';
    case Contacted = 'contacted';
    case Recruited = 'recruited';
    case Rejected = 'rejected';
    case OnHold = 'on_hold';

    public function label(): string
    {
        return bt('enums.SecurityAgentApplicationStatus.'.$this->name, [], match ($this) {
            self::Pending => 'Nouvelle candidature',
            self::Contacted => 'Contacté',
            self::Recruited => 'Recruté',
            self::Rejected => 'Refusé',
            self::OnHold => 'En attente',
        });
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $status) => [
                'value' => $status->value,
                'label' => $status->label(),
            ],
            self::cases(),
        );
    }
}
