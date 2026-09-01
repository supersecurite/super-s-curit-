import { Head, router, usePage } from '@inertiajs/react';
import { History } from 'lucide-react';
import {
    AccessLogsTable,
    type AccessLogFilterOptions,
    type AccessLogFilters,
    type PaginatedAccessLogs,
    type AccessLogUserOption,
} from '@/components/access-logs/access-logs-table';
import { index } from '@/routes/access-logs';

type PageProps = {
    logs: PaginatedAccessLogs;
    users: AccessLogUserOption[];
    filterOptions: AccessLogFilterOptions;
    filters: AccessLogFilters & {
        sort_by?: string;
        sort_direction?: string;
        per_page?: number;
    };
    accessLogFilterUsers?: AccessLogUserOption[];
    accessLogFilterOptions?: AccessLogFilterOptions;
};

export default function AccessLogsIndex() {
    const {
        logs,
        users,
        filterOptions,
        filters,
        accessLogFilterUsers = [],
        accessLogFilterOptions,
    } = usePage<PageProps>().props;

    const filterUsers = users.length > 0 ? users : accessLogFilterUsers;
    const resolvedFilterOptions =
        filterOptions.countries.length > 0 || filterOptions.browsers.length > 0
            ? filterOptions
            : (accessLogFilterOptions ?? filterOptions);

    const applyFilters = (updates: Partial<AccessLogFilters>) => {
        const next = { ...filters, ...updates };
        Object.keys(next).forEach((key) => {
            const value = next[key as keyof typeof next];
            if (value === undefined || value === '') {
                delete next[key as keyof typeof next];
            }
        });
        router.get(index.url(), next, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        router.get(index.url(), {}, { preserveState: true, replace: true });
    };

    return (
        <>
            <Head title="Journal d'accès" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
                        <History className="size-6" aria-hidden />
                        Journal d'accès
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Qui a fait quoi, quand, depuis quel poste — consultations et
                        modifications backoffice.
                    </p>
                </div>

                <AccessLogsTable
                    logs={logs}
                    users={filterUsers}
                    filterOptions={resolvedFilterOptions}
                    filters={filters}
                    onFiltersChange={applyFilters}
                    onResetFilters={resetFilters}
                />
            </div>
        </>
    );
}

AccessLogsIndex.layout = {
    breadcrumbs: [{ title: 'Journal d\'accès', href: index.url() }],
};
