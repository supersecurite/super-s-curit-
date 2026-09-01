<?php

namespace App\Support;

use Illuminate\Http\Request;

/**
 * Tri colonne standard des tableaux index backoffice (`sort_by`, `sort_direction`).
 */
final class IndexTableSort
{
    /**
     * @param  list<string>  $allowed
     * @return array{column: string, direction: string}
     */
    public static function resolve(
        Request $request,
        array $allowed,
        string $defaultColumn,
        string $defaultDirection = 'asc',
    ): array {
        $column = $request->string('sort_by', $defaultColumn)->toString();
        $direction = $request->string('sort_direction', $defaultDirection)->toString();

        if (! in_array($column, $allowed, true)) {
            $column = $defaultColumn;
        }

        if (! in_array($direction, ['asc', 'desc'], true)) {
            $direction = $defaultDirection;
        }

        return [
            'column' => $column,
            'direction' => $direction,
        ];
    }

    /**
     * @return array{sort_by?: string, sort_direction?: string}
     */
    public static function filters(Request $request): array
    {
        $filters = [];

        $sortBy = $request->string('sort_by')->toString();
        $sortDirection = $request->string('sort_direction')->toString();

        if ($sortBy !== '') {
            $filters['sort_by'] = $sortBy;
        }

        if ($sortDirection !== '') {
            $filters['sort_direction'] = $sortDirection;
        }

        return $filters;
    }
}
