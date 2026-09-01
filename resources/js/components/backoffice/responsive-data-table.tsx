import { Link } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TableSortState } from '@/hooks/use-index-table-sort';

export type ResponsiveColumn<T> = {
    id: string;
    header: ReactNode;
    cell: (row: T) => ReactNode;
    /** Rôle d'affichage sur mobile — défaut : `default`. */
    mobileRole?: 'title' | 'subtitle' | 'meta' | 'actions' | 'hidden' | 'default';
    /** Clé de tri envoyée au backend (`sort_by`). */
    sortKey?: string;
    /** Colonne triable (desktop). */
    sortable?: boolean;
    className?: string;
    headerClassName?: string;
};

export type PaginatedMeta = {
    current_page: number;
    last_page: number;
    total: number;
    links?: Array<{ url: string | null; label: string; active: boolean }>;
};

type ResponsiveDataTableProps<T> = {
    rows: T[];
    columns: ResponsiveColumn<T>[];
    getRowKey: (row: T) => string;
    emptyMessage: ReactNode;
    minWidth?: string;
    className?: string;
    sort?: TableSortState;
    onSort?: (column: string) => void;
};

export function SortableColumnHeader({
    label,
    column,
    sort,
    onSort,
    className,
}: {
    label: ReactNode;
    column: string;
    sort?: TableSortState;
    onSort?: (column: string) => void;
    className?: string;
}) {
    if (!onSort) {
        return <span className={className}>{label}</span>;
    }

    const active = sort?.sort_by === column;
    const Icon = active
        ? sort?.sort_direction === 'asc'
            ? ArrowUp
            : ArrowDown
        : ArrowUpDown;

    return (
        <button
            type="button"
            className={cn(
                'inline-flex items-center gap-1 font-medium hover:text-foreground',
                className,
            )}
            onClick={() => onSort(column)}
        >
            {label}
            <Icon
                className={cn(
                    'size-3.5',
                    active ? 'text-primary' : 'text-muted-foreground',
                )}
            />
        </button>
    );
}

function renderColumnHeader<T>(
    column: ResponsiveColumn<T>,
    sort?: TableSortState,
    onSort?: (column: string) => void,
) {
    if (column.sortable && column.sortKey && onSort) {
        return (
            <SortableColumnHeader
                label={column.header}
                column={column.sortKey}
                sort={sort}
                onSort={onSort}
            />
        );
    }

    return column.header;
}

function MobileRowCard<T>({
    row,
    columns,
}: {
    row: T;
    columns: ResponsiveColumn<T>[];
}) {
    const visibleColumns = columns.filter(
        (column) => column.mobileRole !== 'hidden',
    );

    const titleColumn =
        visibleColumns.find((column) => column.mobileRole === 'title') ??
        visibleColumns[0];

    const subtitleColumn = visibleColumns.find(
        (column) => column.mobileRole === 'subtitle',
    );

    const actionsColumn = visibleColumns.find(
        (column) => column.mobileRole === 'actions',
    );

    const metaColumns = visibleColumns.filter((column) => {
        if (column.id === titleColumn?.id) {
            return false;
        }

        if (column.id === subtitleColumn?.id) {
            return false;
        }

        if (column.id === actionsColumn?.id) {
            return false;
        }

        return column.mobileRole !== 'actions';
    });

    return (
        <article className="space-y-3 rounded-xl border border-border/70 bg-card p-4 shadow-sm">
            <div className="space-y-1">
                {titleColumn ? (
                    <div className="font-semibold leading-snug">
                        {titleColumn.cell(row)}
                    </div>
                ) : null}
                {subtitleColumn ? (
                    <div className="text-muted-foreground text-sm">
                        {subtitleColumn.cell(row)}
                    </div>
                ) : null}
            </div>

            {metaColumns.length > 0 ? (
                <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {metaColumns.map((column) => (
                        <div key={column.id} className="min-w-0">
                            <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                                {column.header}
                            </dt>
                            <dd className="mt-0.5 text-sm break-words">
                                {column.cell(row)}
                            </dd>
                        </div>
                    ))}
                </dl>
            ) : null}

            {actionsColumn ? (
                <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                    {actionsColumn.cell(row)}
                </div>
            ) : null}
        </article>
    );
}

/**
 * Tableau backoffice : vue tableau à partir de `md`, cartes empilées sur mobile.
 */
export function ResponsiveDataTable<T>({
    rows,
    columns,
    getRowKey,
    emptyMessage,
    minWidth = '640px',
    className,
    sort,
    onSort,
}: ResponsiveDataTableProps<T>) {
    if (rows.length === 0) {
        return (
            <div className="text-muted-foreground px-4 py-10 text-center text-sm">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={className}>
            <div className="space-y-3 p-3 md:hidden">
                {rows.map((row) => (
                    <MobileRowCard
                        key={getRowKey(row)}
                        row={row}
                        columns={columns}
                    />
                ))}
            </div>

            <div className="hidden md:block md:overflow-x-auto">
                <table
                    className="w-full text-left text-sm"
                    style={{ minWidth }}
                >
                    <thead className="bg-muted/50 border-b text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                            {columns
                                .filter((column) => column.mobileRole !== 'hidden')
                                .map((column) => (
                                    <th
                                        key={column.id}
                                        className={cn(
                                            'px-4 py-3 font-medium',
                                            column.headerClassName,
                                        )}
                                    >
                                        {renderColumnHeader(column, sort, onSort)}
                                    </th>
                                ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr
                                key={getRowKey(row)}
                                className="border-b transition-colors last:border-b-0 hover:bg-muted/40"
                            >
                                {columns
                                    .filter((column) => column.mobileRole !== 'hidden')
                                    .map((column) => (
                                        <td
                                            key={column.id}
                                            className={cn('px-4 py-3', column.className)}
                                        >
                                            {column.cell(row)}
                                        </td>
                                    ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

type IndexTablePaginationProps = {
    paginated: PaginatedMeta;
    itemLabel: string;
    buildPageUrl?: (page: number) => string;
    onPageClick?: (page: number) => void;
    embedded?: boolean;
};

export function IndexTablePagination({
    paginated,
    itemLabel,
    buildPageUrl,
    onPageClick,
    embedded = false,
}: IndexTablePaginationProps) {
    if (paginated.last_page <= 1) {
        return null;
    }

    const handlePageFromUrl = (url: string | null) => {
        if (!url || !onPageClick) {
            return;
        }

        const page = new URL(url, window.location.origin).searchParams.get('page');

        if (page) {
            onPageClick(Number.parseInt(page, 10));
        }
    };

    return (
        <div className="text-muted-foreground flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span>
                Page {paginated.current_page} / {paginated.last_page} ·{' '}
                {paginated.total.toLocaleString('fr-FR')} {itemLabel}
            </span>

            {paginated.links && paginated.links.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {paginated.links.map((link, index) => {
                        if (link.url === null) {
                            return (
                                <span
                                    key={`${link.label}-${index}`}
                                    className="px-2 py-1"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        }

                        if (embedded && onPageClick) {
                            return (
                                <Button
                                    key={`${link.label}-${index}`}
                                    type="button"
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handlePageFromUrl(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        }

                        return (
                            <Button
                                key={`${link.label}-${index}`}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                asChild
                            >
                                <Link
                                    href={link.url}
                                    preserveState
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            </Button>
                        );
                    })}
                </div>
            ) : buildPageUrl ? (
                <div className="flex flex-wrap gap-2">
                    {paginated.current_page > 1 ? (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={buildPageUrl(paginated.current_page - 1)}>
                                Précédent
                            </Link>
                        </Button>
                    ) : null}
                    {paginated.current_page < paginated.last_page ? (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={buildPageUrl(paginated.current_page + 1)}>
                                Suivant
                            </Link>
                        </Button>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}

/** Panneau liste backoffice avec bordure et fond carte. */
export function BackofficeIndexPanel({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('app-panel overflow-hidden', className)}>{children}</div>
    );
}

/** Barre de filtres empilée proprement sur mobile. */
export function BackofficeFiltersBar({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end',
                className,
            )}
        >
            {children}
        </div>
    );
}
