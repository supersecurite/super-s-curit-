import type { AccessLogFilters } from '@/components/access-logs/access-logs-table';

type QueryExtras = {
    path?: string;
    perPage?: number;
    page?: number;
};

/**
 * Sérialise les filtres du journal d'accès en paramètres de requête HTTP.
 */
export function buildAccessLogQueryParams(
    filters: AccessLogFilters,
    extras: QueryExtras = {},
): Record<string, string | number> {
    const query: Record<string, string | number> = {};

    if (extras.path) {
        query.path = extras.path;
    }

    if (extras.perPage) {
        query.per_page = extras.perPage;
    }

    if (filters.scope) {
        query.scope = filters.scope;
    }

    if (filters.search) {
        query.search = filters.search;
    }

    if (filters.from) {
        query.from = filters.from;
    }

    if (filters.to) {
        query.to = filters.to;
    }

    if (filters.user) {
        query.user = filters.user;
    }

    if (filters.kind) {
        query.kind = filters.kind;
    }

    if (filters.ip) {
        query.ip = filters.ip;
    }

    if (filters.country) {
        query.country = filters.country;
    }

    if (filters.browser) {
        query.browser = filters.browser;
    }

    if (filters.method) {
        query.method = filters.method;
    }

    if (filters.sort_by) {
        query.sort_by = filters.sort_by;
    }

    if (filters.sort_direction) {
        query.sort_direction = filters.sort_direction;
    }

    if (filters.per_page) {
        query.per_page = filters.per_page;
    }

    const page = extras.page ?? filters.page;

    if (page && page > 1) {
        query.page = page;
    }

    return query;
}

export function hasActiveAccessLogFilters(
    filters: AccessLogFilters,
    options?: { ignoreScope?: boolean },
): boolean {
    const keys: Array<keyof AccessLogFilters> = [
        'search',
        'from',
        'to',
        'user',
        'kind',
        'ip',
        'country',
        'browser',
        'method',
        'sort_by',
        'sort_direction',
        'per_page',
    ];

    if (!options?.ignoreScope && filters.scope === 'page') {
        return true;
    }

    return keys.some((key) => {
        const value = filters[key];

        if (value === undefined || value === '') {
            return false;
        }

        if (key === 'sort_by' && value === 'visited_at') {
            return filters.sort_direction === 'asc';
        }

        return true;
    });
}
