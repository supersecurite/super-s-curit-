<?php

namespace App\Enums;

enum SecurityAgentPost: string
{
    case Agent = 'agent';
    case Superviseur = 'superviseur';
    case Coordinateur = 'coordinateur';
    case Formateur = 'formateur';
    case ResponsableOperations = 'responsable_operations';
    case Autres = 'autres';

    public function label(): string
    {
        return match ($this) {
            self::Agent => 'Agent de sécurité',
            self::Superviseur => 'Superviseur',
            self::Coordinateur => 'Coordinateur',
            self::Formateur => 'Formateur',
            self::ResponsableOperations => 'Responsable des opérations',
            self::Autres => 'Autres',
        };
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $post) => [
                'value' => $post->value,
                'label' => $post->label(),
            ],
            self::cases(),
        );
    }
}
