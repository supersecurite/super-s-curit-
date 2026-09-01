import { RotateCcw, Search } from 'lucide-react';
import { AccessLogClientMeta } from '@/components/access-logs/access-log-client-meta';
import { AccessLogDescription } from '@/components/access-logs/access-log-description';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import {
    BackofficeFiltersBar,
    IndexTablePagination,
    SortableColumnHeader,
} from '@/components/backoffice/responsive-data-table';
import { hasActiveAccessLogFilters } from '@/lib/access-log-query';
import { cn } from '@/lib/utils';

export type AccessLogRow = {
    uuid: string;
    user_name: string | null;
    user_email: string | null;
    kind: 'visit' | 'action' | null;
    kind_label: string | null;
    http_method: string | null;
    page: string;
    description: string | null;
    visited_at: string | null;
    ip?: string | null;
    country_code?: string | null;
    country?: string | null;
    browser_label?: string | null;
};

export type AccessLogUserOption = {
    uuid: string;
    name: string;
    email: string;
};

export type AccessLogFilterOptions = {
    countries: Array<{ code: string; label: string }>;
    browsers: string[];
    methods: string[];
};

export type AccessLogFilters = {
    search?: string;
    from?: string;
    to?: string;
    user?: string;
    kind?: string;
    ip?: string;
    country?: string;
    browser?: string;
    method?: string;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
    per_page?: number;
    scope?: 'page' | 'all';
    page?: number;
};

export type PaginatedAccessLogs = {
    data: AccessLogRow[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type AccessLogsTableProps = {
    logs: PaginatedAccessLogs;
    users: AccessLogUserOption[];
    filterOptions: AccessLogFilterOptions;
    filters: AccessLogFilters;
    loading?: boolean;
    embedded?: boolean;
    onFiltersChange: (updates: Partial<AccessLogFilters>) => void;
    onPageChange?: (page: number) => void;
    onResetFilters?: () => void;
};

const PER_PAGE_OPTIONS = [
    { value: '15', label: '15 / page' },
    { value: '20', label: '20 / page' },
    { value: '30', label: '30 / page' },
    { value: '50', label: '50 / page' },
];

function formatActivityDate(value: string | null): string {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function AccessLogsTable({
    logs,
    users,
    filterOptions,
    filters,
    loading = false,
    embedded = false,
    onFiltersChange,
    onPageChange,
    onResetFilters,
}: AccessLogsTableProps) {
    const debouncedSearch = useDebouncedCallback((search: string) => {
        onFiltersChange({ search: search || undefined, page: 1 });
    }, 400);

    const debouncedIp = useDebouncedCallback((ip: string) => {
        onFiltersChange({ ip: ip || undefined, page: 1 });
    }, 400);

    const userOptions = users.map((user) => ({
        value: user.uuid,
        label: `${user.name} (${user.email})`,
    }));

    const kindOptions = [
        { value: '', label: 'Tous les types' },
        { value: 'visit', label: 'Consultations' },
        { value: 'action', label: 'Actions' },
    ];

    const countryOptions = [
        { value: '', label: 'Tous les pays' },
        ...filterOptions.countries.map((country) => ({
            value: country.code,
            label: country.label,
        })),
    ];

    const browserOptions = [
        { value: '', label: 'Tous les navigateurs' },
        ...filterOptions.browsers.map((browser) => ({
            value: browser,
            label: browser,
        })),
    ];

    const methodOptions = [
        { value: '', label: 'Toutes les méthodes' },
        ...filterOptions.methods.map((method) => ({
            value: method,
            label: method,
        })),
    ];

    const handleSort = (column: string) => {
        const nextDirection =
            filters.sort_by === column && filters.sort_direction === 'desc'
                ? 'asc'
                : 'desc';

        onFiltersChange({
            sort_by: column,
            sort_direction: nextDirection,
            page: 1,
        });
    };

    const showReset = hasActiveAccessLogFilters(filters, {
        ignoreScope: !embedded,
    });

    const idPrefix = embedded ? 'access-log-embedded' : 'access-log';

    return (
        <div
            className={cn(
                'rounded-xl border border-border/70 bg-card',
                embedded ? 'border-0 bg-transparent shadow-none' : 'surface-accent',
                loading && 'pointer-events-none opacity-60',
            )}
        >
            <div className="space-y-3 border-b border-border/60 p-4">
                <BackofficeFiltersBar>
                    <div className="min-w-0 flex-1 lg:min-w-[220px]">
                        <Label htmlFor={`${idPrefix}-search`}>Recherche globale</Label>
                        <div className="relative mt-1">
                            <Search
                                className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
                                aria-hidden
                            />
                            <Input
                                id={`${idPrefix}-search`}
                                key={`search-${filters.search ?? ''}`}
                                defaultValue={filters.search ?? ''}
                                placeholder="Description, URL, IP, pays, navigateur…"
                                className="pl-9"
                                onChange={(event) => debouncedSearch(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className="min-w-0">
                        <Label htmlFor={`${idPrefix}-from`}>Du</Label>
                        <Input
                            id={`${idPrefix}-from`}
                            type="date"
                            className="mt-1"
                            value={filters.from ?? ''}
                            onChange={(event) =>
                                onFiltersChange({
                                    from: event.target.value || undefined,
                                    page: 1,
                                })
                            }
                        />
                    </div>

                    <div className="min-w-0">
                        <Label htmlFor={`${idPrefix}-to`}>Au</Label>
                        <Input
                            id={`${idPrefix}-to`}
                            type="date"
                            className="mt-1"
                            value={filters.to ?? ''}
                            onChange={(event) =>
                                onFiltersChange({
                                    to: event.target.value || undefined,
                                    page: 1,
                                })
                            }
                        />
                    </div>

                    <div className="min-w-0 lg:min-w-[200px]">
                        <Label>Utilisateur</Label>
                        <SearchableSelect
                            className="mt-1"
                            value={filters.user ?? ''}
                            onChange={(value) =>
                                onFiltersChange({ user: value || undefined, page: 1 })
                            }
                            options={[
                                { value: '', label: 'Tous les utilisateurs' },
                                ...userOptions,
                            ]}
                            placeholder="Filtrer par utilisateur"
                        />
                    </div>

                    <div className="min-w-0 lg:min-w-[160px]">
                        <Label>Type</Label>
                        <SearchableSelect
                            className="mt-1"
                            value={filters.kind ?? ''}
                            onChange={(value) =>
                                onFiltersChange({ kind: value || undefined, page: 1 })
                            }
                            options={kindOptions}
                            placeholder="Type d'événement"
                        />
                    </div>
                </BackofficeFiltersBar>

                <BackofficeFiltersBar>
                    <div className="min-w-0 lg:min-w-[160px]">
                        <Label htmlFor={`${idPrefix}-ip`}>Adresse IP</Label>
                        <Input
                            id={`${idPrefix}-ip`}
                            key={`ip-${filters.ip ?? ''}`}
                            defaultValue={filters.ip ?? ''}
                            placeholder="192.168.…"
                            className="mt-1"
                            onChange={(event) => debouncedIp(event.target.value)}
                        />
                    </div>

                    <div className="min-w-0 lg:min-w-[160px]">
                        <Label>Pays</Label>
                        <SearchableSelect
                            className="mt-1"
                            value={filters.country ?? ''}
                            onChange={(value) =>
                                onFiltersChange({ country: value || undefined, page: 1 })
                            }
                            options={countryOptions}
                            placeholder="Filtrer par pays"
                        />
                    </div>

                    <div className="min-w-0 lg:min-w-[160px]">
                        <Label>Navigateur</Label>
                        <SearchableSelect
                            className="mt-1"
                            value={filters.browser ?? ''}
                            onChange={(value) =>
                                onFiltersChange({ browser: value || undefined, page: 1 })
                            }
                            options={browserOptions}
                            placeholder="Filtrer par navigateur"
                        />
                    </div>

                    <div className="min-w-0 lg:min-w-[140px]">
                        <Label>Méthode HTTP</Label>
                        <SearchableSelect
                            className="mt-1"
                            value={filters.method ?? ''}
                            onChange={(value) =>
                                onFiltersChange({ method: value || undefined, page: 1 })
                            }
                            options={methodOptions}
                            placeholder="GET, POST…"
                        />
                    </div>

                    {!embedded ? (
                        <div className="min-w-0 lg:min-w-[130px]">
                            <Label>Par page</Label>
                            <SearchableSelect
                                className="mt-1"
                                value={String(filters.per_page ?? 20)}
                                onChange={(value) =>
                                    onFiltersChange({
                                        per_page: Number.parseInt(value, 10),
                                        page: 1,
                                    })
                                }
                                options={PER_PAGE_OPTIONS}
                                placeholder="Résultats"
                            />
                        </div>
                    ) : null}

                    {embedded ? (
                        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                            <Button
                                type="button"
                                size="sm"
                                variant={filters.scope === 'page' ? 'default' : 'outline'}
                                onClick={() => onFiltersChange({ scope: 'page', page: 1 })}
                            >
                                Cette page
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={filters.scope !== 'page' ? 'default' : 'outline'}
                                onClick={() => onFiltersChange({ scope: 'all', page: 1 })}
                            >
                                Tout le backoffice
                            </Button>
                        </div>
                    ) : null}

                    {showReset ? (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={onResetFilters}
                        >
                            <RotateCcw className="size-4" aria-hidden />
                            Réinitialiser
                        </Button>
                    ) : null}
                </BackofficeFiltersBar>
            </div>

            <div
                className={cn(
                    embedded && 'max-h-[min(420px,50vh)] overflow-y-auto',
                )}
            >
                {logs.data.length === 0 ? (
                    <p className="text-muted-foreground px-4 py-10 text-center text-sm">
                        Aucune entrée pour ces filtres.
                    </p>
                ) : (
                    <>
                        <div className="space-y-3 p-3 md:hidden">
                            {logs.data.map((row) => (
                                <article
                                    key={row.uuid}
                                    className="space-y-3 rounded-xl border border-border/70 bg-card p-4"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-muted-foreground text-xs">
                                                {formatActivityDate(row.visited_at)}
                                            </p>
                                            <p className="mt-1 font-medium">
                                                {row.user_name ?? '—'}
                                            </p>
                                            {row.user_email ? (
                                                <p className="text-muted-foreground text-xs">
                                                    {row.user_email}
                                                </p>
                                            ) : null}
                                        </div>
                                        <Badge
                                            variant={
                                                row.kind === 'action'
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                            className="shrink-0 font-semibold uppercase tracking-wide"
                                        >
                                            {row.kind_label ?? row.kind}
                                        </Badge>
                                    </div>
                                    <p className="text-sm leading-snug text-muted-foreground">
                                        <AccessLogDescription
                                            description={row.description}
                                            fallback={row.page}
                                            userName={row.user_name}
                                        />
                                    </p>
                                    <AccessLogClientMeta
                                        country_code={row.country_code}
                                        country={row.country}
                                        browser_label={row.browser_label}
                                        ip={row.ip}
                                        compact
                                    />
                                </article>
                            ))}
                        </div>

                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[720px] text-sm">
                                <thead className="sticky top-0 z-10 border-b border-border/60 bg-muted/95 backdrop-blur">
                                    <tr>
                                        <th className="px-4 py-3 text-left">
                                            <SortableColumnHeader
                                                label="Date"
                                                column="visited_at"
                                                sort={filters}
                                                onSort={handleSort}
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            <SortableColumnHeader
                                                label="Utilisateur"
                                                column="user"
                                                sort={filters}
                                                onSort={handleSort}
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            <SortableColumnHeader
                                                label="Action"
                                                column="description"
                                                sort={filters}
                                                onSort={handleSort}
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            <SortableColumnHeader
                                                label="Origine"
                                                column="ip"
                                                sort={filters}
                                                onSort={handleSort}
                                            />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.data.map((row) => (
                                        <tr
                                            key={row.uuid}
                                            className="border-b border-border/40 last:border-0"
                                        >
                                            <td className="text-muted-foreground px-4 py-3 whitespace-nowrap">
                                                {formatActivityDate(row.visited_at)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium">
                                                    {row.user_name ?? '—'}
                                                </div>
                                                {row.user_email ? (
                                                    <div className="text-muted-foreground text-xs">
                                                        {row.user_email}
                                                    </div>
                                                ) : null}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-start gap-2">
                                                    <Badge
                                                        variant={
                                                            row.kind === 'action'
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                        className="font-semibold uppercase tracking-wide"
                                                    >
                                                        {row.kind_label ?? row.kind}
                                                    </Badge>
                                                    <span className="leading-snug text-muted-foreground">
                                                        <AccessLogDescription
                                                            description={row.description}
                                                            fallback={row.page}
                                                            userName={row.user_name}
                                                        />
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <AccessLogClientMeta
                                                    country_code={row.country_code}
                                                    country={row.country}
                                                    browser_label={row.browser_label}
                                                    ip={row.ip}
                                                    compact={embedded}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            <div className="border-t border-border/60 px-4 py-3">
                <IndexTablePagination
                    paginated={logs}
                    itemLabel="entrée(s)"
                    embedded={embedded}
                    onPageClick={onPageChange}
                />
            </div>
        </div>
    );
}
