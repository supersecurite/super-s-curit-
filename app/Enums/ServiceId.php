<?php

namespace App\Enums;

enum ServiceId: string
{
    case Entreprise = 'entreprise';
    case Residence = 'residence';
    case Chantiers = 'chantiers';
    case ZonesMinieres = 'zones-minieres';

    public function label(): string
    {
        return bt('enums.ServiceId.'.$this->name, [], match ($this) {
            self::Entreprise => 'Sécurité entreprise',
            self::Residence => 'Sécurité résidence',
            self::Chantiers => 'Sécurité chantiers',
            self::ZonesMinieres => 'Zones minières',
        });
    }

    public function path(): string
    {
        return match ($this) {
            self::Entreprise => '/entreprise',
            self::Residence => '/residence',
            self::Chantiers => '/chantiers',
            self::ZonesMinieres => '/zones-minieres',
        };
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * @return list<array{value: string, label: string, path: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $service): array => [
                'value' => $service->value,
                'label' => $service->label(),
                'path' => $service->path(),
            ],
            self::cases(),
        );
    }
}
