import { Head, Link, router, setLayoutProps, usePage } from '@inertiajs/react';
import { List, Pencil, Plus, Search } from 'lucide-react';
import { useMemo } from 'react';
import {
    BackofficeFiltersBar,
    BackofficeIndexPanel,
    IndexTablePagination,
    ResponsiveDataTable,
    type ResponsiveColumn,
} from '@/components/backoffice/responsive-data-table';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { useTrans } from '@/hooks/use-trans';
import { useIndexTableSort, type TableSortState } from '@/hooks/use-index-table-sort';
import { withIndexTableQuery } from '@/lib/index-table-query';
import {
    create,
    destroy,
    edit,
    index,
    show,
} from '@/routes/marketing-lists';

type ListRow = {
    uuid: string;
    name: string;
    description: string | null;
    contacts_count: number;
    can_update: boolean;
    can_delete: boolean;
};

type PaginatedLists = {
    data: ListRow[];
    current_page: number;
    last_page: number;
    total: number;
};

type PageProps = {
    lists: PaginatedLists;
    filters: TableSortState & { search?: string };
    canCreate: boolean;
};

export default function MarketingListsIndex() {
    const { t } = useTrans();
    const { lists, filters, canCreate } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            {
                title: t('marketing_lists.title', 'Groupes'),
                href: index.url(),
            },
        ],
    });

    const applyFilters = (updates: Partial<TableSortState & { search?: string; page?: number }>) => {
        const next = { ...filters, ...updates };
        Object.keys(next).forEach((key) => {
            if (next[key as keyof typeof next] === undefined || next[key as keyof typeof next] === '') {
                delete next[key as keyof typeof next];
            }
        });
        router.get(index.url(), next, { preserveState: true, replace: true });
    };

    const handleSort = useIndexTableSort(filters, applyFilters);

    const debouncedSearch = useDebouncedCallback((search: string) => {
        applyFilters({ search: search || undefined, page: 1 });
    });

    const buildPageUrl = (page: number) =>
        index.url({ query: withIndexTableQuery(filters, page) });

    const columns = useMemo((): ResponsiveColumn<ListRow>[] => {
        const renderActions = (list: ListRow) => (
            <>
                <Button variant="outline" size="sm" asChild>
                    <Link href={show.url(list.uuid)}>
                        {t('common.view', 'Voir')}
                    </Link>
                </Button>
                {list.can_update ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={edit.url(list.uuid)}>
                            <Pencil className="size-4" aria-hidden />
                            {t('common.modify', 'Modifier')}
                        </Link>
                    </Button>
                ) : null}
                {list.can_delete ? (
                    <ConfirmDeleteDialog
                        title={t(
                            'marketing_lists.delete_confirm',
                            'Supprimer ce groupe ?',
                        )}
                        description={t(
                            'marketing_lists.delete_description',
                            'Le groupe « :name » sera supprimé.',
                            { name: list.name },
                        )}
                        deleteUrl={destroy.url(list.uuid)}
                        triggerSize="sm"
                        triggerVariant="outline"
                        triggerClassName="text-destructive hover:text-destructive"
                        aria-label={t(
                            'marketing_lists.delete_aria',
                            'Supprimer :name',
                            { name: list.name },
                        )}
                    />
                ) : null}
            </>
        );

        return [
            {
                id: 'name',
                header: t('common.name', 'Nom'),
                sortKey: 'name',
                sortable: true,
                mobileRole: 'title',
                cell: (list) => (
                    <Link
                        href={show.url(list.uuid)}
                        className="hover:text-primary hover:underline"
                    >
                        {list.name}
                    </Link>
                ),
            },
            {
                id: 'description',
                header: t('common.description', 'Description'),
                sortKey: 'description',
                sortable: true,
                mobileRole: 'subtitle',
                className: 'text-muted-foreground',
                cell: (list) => list.description ?? '—',
            },
            {
                id: 'contacts',
                header: t('nav.contacts', 'Contacts'),
                sortKey: 'contacts_count',
                sortable: true,
                mobileRole: 'meta',
                cell: (list) => list.contacts_count,
            },
            {
                id: 'actions',
                header: t('common.actions', 'Actions'),
                mobileRole: 'actions',
                headerClassName: 'text-right',
                className: 'text-right',
                cell: renderActions,
            },
        ];
    }, [t]);

    return (
        <>
            <Head title={t('marketing_lists.title', 'Groupes')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
                            <List className="size-6" aria-hidden />
                            {t('marketing_lists.title', 'Groupes')}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {t(
                                'marketing_lists.subtitle',
                                'Organisez vos contacts en audiences pour les campagnes.',
                            )}
                        </p>
                    </div>
                    {canCreate ? (
                        <Button asChild>
                            <Link href={create.url()}>
                                <Plus className="size-4" aria-hidden />
                                {t('marketing_lists.create', 'Nouveau groupe')}
                            </Link>
                        </Button>
                    ) : null}
                </div>

                <BackofficeFiltersBar>
                    <div className="relative min-w-0 flex-1 lg:min-w-[240px]">
                        <Label htmlFor="lists-search" className="sr-only">
                            Recherche
                        </Label>
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            id="lists-search"
                            type="search"
                            placeholder={t(
                                'marketing_lists.search_placeholder',
                                'Rechercher un groupe…',
                            )}
                            defaultValue={filters.search ?? ''}
                            onChange={(event) =>
                                debouncedSearch(event.target.value)
                            }
                            className="pl-9"
                        />
                    </div>
                </BackofficeFiltersBar>

                <BackofficeIndexPanel>
                    <ResponsiveDataTable
                        rows={lists.data}
                        columns={columns}
                        getRowKey={(list) => list.uuid}
                        emptyMessage={t(
                            'marketing_lists.empty',
                            'Aucun groupe pour le moment.',
                        )}
                        minWidth="640px"
                        sort={filters}
                        onSort={handleSort}
                    />
                </BackofficeIndexPanel>

                <IndexTablePagination
                    paginated={lists}
                    itemLabel="groupe(s)"
                    buildPageUrl={buildPageUrl}
                />
            </div>
        </>
    );
}
