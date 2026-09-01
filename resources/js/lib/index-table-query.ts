import type { TableSortState } from '@/hooks/use-index-table-sort';

/** Fusionne tri + filtres + page pour les URLs Inertia des index. */
export function withIndexTableQuery(
    filters: Record<string, string | number | undefined>,
    page?: number,
): Record<string, string | number> {
    const query: Record<string, string | number> = {};

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            query[key] = value;
        }
    });

    if (page && page > 1) {
        query.page = page;
    }

    return query;
}

export type { TableSortState };
