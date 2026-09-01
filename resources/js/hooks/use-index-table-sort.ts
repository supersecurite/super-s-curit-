import { useCallback } from 'react';

export type TableSortState = {
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
};

/**
 * Bascule le tri d'une colonne et remet la pagination à la page 1.
 */
export function useIndexTableSort(
    filters: TableSortState,
    onFiltersChange: (updates: Partial<TableSortState & { page?: number }>) => void,
) {
    return useCallback(
        (column: string) => {
            const nextDirection: 'asc' | 'desc' =
                filters.sort_by === column && filters.sort_direction === 'desc'
                    ? 'asc'
                    : 'desc';

            onFiltersChange({
                sort_by: column,
                sort_direction: nextDirection,
                page: 1,
            });
        },
        [filters.sort_by, filters.sort_direction, onFiltersChange],
    );
}
