import { useCallback, useEffect, useState } from 'react';
import type {
    AccessLogFilterOptions,
    AccessLogFilters,
    AccessLogUserOption,
    PaginatedAccessLogs,
} from '@/components/access-logs/access-logs-table';
import { buildAccessLogQueryParams } from '@/lib/access-log-query';
import { feed as accessLogsFeed } from '@/routes/access-logs';

const emptyLogs: PaginatedAccessLogs = {
    data: [],
    current_page: 1,
    last_page: 1,
    total: 0,
    links: [],
};

const emptyFilterOptions: AccessLogFilterOptions = {
    countries: [],
    browsers: [],
    methods: ['DELETE', 'GET', 'PATCH', 'POST', 'PUT'],
};

type UseAccessLogsFeedOptions = {
    currentPath: string;
    enabled: boolean;
    initialUsers?: AccessLogUserOption[];
    initialFilterOptions?: AccessLogFilterOptions;
};

/**
 * Charge le tableau paginé du journal d'accès (accordéon global backoffice).
 */
export function useAccessLogsFeed({
    currentPath,
    enabled,
    initialUsers = [],
    initialFilterOptions = emptyFilterOptions,
}: UseAccessLogsFeedOptions) {
    const [filters, setFilters] = useState<AccessLogFilters>({
        scope: 'page',
        page: 1,
    });
    const [logs, setLogs] = useState<PaginatedAccessLogs>(emptyLogs);
    const [users, setUsers] = useState<AccessLogUserOption[]>(initialUsers);
    const [filterOptions, setFilterOptions] =
        useState<AccessLogFilterOptions>(initialFilterOptions);
    const [loading, setLoading] = useState(false);

    const loadTable = useCallback(
        async (nextFilters: AccessLogFilters) => {
            if (!enabled) {
                return;
            }

            setLoading(true);

            try {
                const query = buildAccessLogQueryParams(nextFilters, {
                    path: currentPath.replace(/^\//, ''),
                    perPage: nextFilters.per_page ?? 15,
                });

                const response = await fetch(accessLogsFeed.url({ query }), {
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin',
                });

                if (!response.ok) {
                    setLogs(emptyLogs);

                    return;
                }

                const data = (await response.json()) as {
                    logs: PaginatedAccessLogs;
                    users: AccessLogUserOption[];
                    filterOptions: AccessLogFilterOptions;
                };

                setLogs(data.logs ?? emptyLogs);

                if (data.users?.length) {
                    setUsers(data.users);
                }

                if (data.filterOptions) {
                    setFilterOptions(data.filterOptions);
                }
            } finally {
                setLoading(false);
            }
        },
        [currentPath, enabled],
    );

    useEffect(() => {
        if (initialUsers.length > 0) {
            setUsers(initialUsers);
        }
    }, [initialUsers]);

    useEffect(() => {
        setFilterOptions(initialFilterOptions);
    }, [initialFilterOptions]);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        void loadTable(filters);
    }, [
        enabled,
        filters.scope,
        filters.search,
        filters.from,
        filters.to,
        filters.user,
        filters.kind,
        filters.ip,
        filters.country,
        filters.browser,
        filters.method,
        filters.sort_by,
        filters.sort_direction,
        filters.per_page,
        filters.page,
        loadTable,
    ]);

    const updateFilters = useCallback((updates: Partial<AccessLogFilters>) => {
        setFilters((current) => ({ ...current, ...updates }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({ scope: 'page', page: 1 });
    }, []);

    return {
        filters,
        logs,
        users,
        filterOptions,
        loading,
        updateFilters,
        resetFilters,
    };
}
