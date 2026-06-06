<?php

namespace App\Enums;

enum ArticleStatus: string
{
    case Draft = 'draft';
    case PendingApproval = 'pending_approval';
    case Published = 'published';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Brouillon',
            self::PendingApproval => 'En attente de validation',
            self::Published => 'Publié',
            self::Rejected => 'Refusé',
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

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function authorOptions(): array
    {
        return array_map(
            fn (self $status) => [
                'value' => $status->value,
                'label' => $status->label(),
            ],
            [self::Draft, self::PendingApproval],
        );
    }

    /**
     * @return list<string>
     */
    public static function authorEditableValues(): array
    {
        return [self::Draft->value, self::PendingApproval->value];
    }
}
