import { Head, Link, router, setLayoutProps, usePage } from '@inertiajs/react';
import { Briefcase, Plus, Power, Search, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import {
    BackofficeFiltersBar,
    BackofficeIndexPanel,
    IndexTablePagination,
    ResponsiveDataTable,
    type ResponsiveColumn,
} from '@/components/backoffice/responsive-data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { useIndexTableSort, type TableSortState } from '@/hooks/use-index-table-sort';
import { useTrans } from '@/hooks/use-trans';
import { withIndexTableQuery } from '@/lib/index-table-query';
import {
    create,
    destroy,
    edit,
    index,
    toggle,
} from '@/routes/offres-emploi';

type OfferRow = {
    id: number;
    uuid: string;
    title: string;
    location: string;
    contract_type: string;
    is_active: boolean;
    applications_count: number;
    can_update: boolean;
    can_delete: boolean;
    updated_at_formatted: string | null;
};

type PaginatedOffers = {
    data: OfferRow[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type PageProps = {
    offers: PaginatedOffers;
    filters: TableSortState & {
        search?: string;
        status?: string;
    };
    canCreate: boolean;
};

export default function JobOffersIndex() {
    const { t } = useTrans();
    const { offers, filters, canCreate } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            { title: t('job_offers.title', "Offres d'emploi"), href: index.url() },
        ],
    });

    const applyFilters = (
        updates: Partial<
            TableSortState & { search?: string; status?: string; page?: number }
        >,
    ) => {
        const next = { ...filters, ...updates };
        Object.keys(next).forEach((key) => {
            if (
                next[key as keyof typeof next] === undefined ||
                next[key as keyof typeof next] === ''
            ) {
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

    const columns = useMemo((): ResponsiveColumn<OfferRow>[] => {
        const renderActions = (offer: OfferRow) => (
            <>
                {offer.can_update ? (
                    <>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={edit.url(offer.uuid)}>
                                {t('common.modify', 'Modifier')}
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                router.post(toggle.url(offer.uuid));
                            }}
                        >
                            <Power className="size-4" aria-hidden />
                            {offer.is_active
                                ? t('job_offers.deactivate', 'Désactiver')
                                : t('job_offers.activate', 'Activer')}
                        </Button>
                    </>
                ) : null}
                {offer.can_delete ? (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                            if (
                                confirm(
                                    t('job_offers.delete_confirm', {
                                        title: offer.title,
                                        defaultValue:
                                            'Supprimer l’offre « :title » ?',
                                    }),
                                )
                            ) {
                                router.delete(destroy.url(offer.uuid));
                            }
                        }}
                    >
                        <Trash2 className="size-4" aria-hidden />
                        {t('common.delete', 'Supprimer')}
                    </Button>
                ) : null}
            </>
        );

        return [
            {
                id: 'title',
                header: t('job_offers.field_title', 'Intitulé'),
                sortKey: 'title',
                sortable: true,
                mobileRole: 'title',
                cell: (offer) => offer.title,
            },
            {
                id: 'location',
                header: t('job_offers.field_location', 'Lieu'),
                sortKey: 'location',
                sortable: true,
                mobileRole: 'meta',
                cell: (offer) => offer.location,
            },
            {
                id: 'contract_type',
                header: t('job_offers.field_contract', 'Contrat'),
                sortKey: 'contract_type',
                sortable: true,
                mobileRole: 'meta',
                cell: (offer) => offer.contract_type,
            },
            {
                id: 'status',
                header: t('common.status', 'Statut'),
                sortKey: 'is_active',
                sortable: true,
                mobileRole: 'meta',
                cell: (offer) => (
                    <Badge variant={offer.is_active ? 'default' : 'outline'}>
                        {offer.is_active
                            ? t('common.active', 'Actif')
                            : t('common.inactive', 'Inactif')}
                    </Badge>
                ),
            },
            {
                id: 'applications_count',
                header: t('job_offers.applications', 'Candidatures'),
                sortKey: 'applications_count',
                sortable: true,
                mobileRole: 'meta',
                cell: (offer) => offer.applications_count,
            },
            {
                id: 'updated_at',
                header: t('common.updated_at', 'Modifié le'),
                sortKey: 'updated_at',
                sortable: true,
                mobileRole: 'meta',
                className: 'text-muted-foreground whitespace-nowrap',
                cell: (offer) => offer.updated_at_formatted ?? '—',
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
            <Head title={t('job_offers.title', "Offres d'emploi")} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-heading flex items-center gap-2 text-2xl font-semibold tracking-tight">
                            <Briefcase className="size-6" aria-hidden />
                            {t('job_offers.title', "Offres d'emploi")}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {t(
                                'job_offers.subtitle',
                                'Gérez les offres visibles sur la page Carrières.',
                            )}
                        </p>
                    </div>
                    {canCreate ? (
                        <Button asChild>
                            <Link href={create.url()}>
                                <Plus className="size-4" aria-hidden />
                                {t('job_offers.create', 'Nouvelle offre')}
                            </Link>
                        </Button>
                    ) : null}
                </div>

                <BackofficeFiltersBar>
                    <div className="relative min-w-0 flex-1">
                        <Label htmlFor="job-offers-search" className="sr-only">
                            {t('common.search', 'Rechercher')}
                        </Label>
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            id="job-offers-search"
                            type="search"
                            placeholder={t(
                                'job_offers.search_placeholder',
                                'Rechercher une offre…',
                            )}
                            defaultValue={filters.search ?? ''}
                            onChange={(event) =>
                                debouncedSearch(event.target.value)
                            }
                            className="pl-9"
                        />
                    </div>
                    <div className="min-w-0 sm:max-w-xs">
                        <Label className="mb-1 block text-sm">
                            {t('common.status', 'Statut')}
                        </Label>
                        <SearchableSelect
                            options={[
                                {
                                    value: 'all',
                                    label: t(
                                        'common.all_statuses',
                                        'Tous les statuts',
                                    ),
                                },
                                {
                                    value: 'active',
                                    label: t('common.active_plural', 'Actifs'),
                                },
                                {
                                    value: 'inactive',
                                    label: t(
                                        'common.inactive_plural',
                                        'Inactifs',
                                    ),
                                },
                            ]}
                            value={filters.status ?? 'all'}
                            onChange={(status) =>
                                applyFilters({
                                    status:
                                        status === 'all' ? undefined : status,
                                })
                            }
                            placeholder={t('common.status', 'Statut')}
                            searchPlaceholder={t(
                                'common.search_ellipsis',
                                'Rechercher…',
                            )}
                        />
                    </div>
                </BackofficeFiltersBar>

                <BackofficeIndexPanel>
                    <ResponsiveDataTable
                        rows={offers.data}
                        columns={columns}
                        getRowKey={(offer) => offer.uuid}
                        emptyMessage={
                            <span className="inline-flex flex-col items-center gap-2">
                                <Briefcase className="size-8 opacity-60" />
                                {t(
                                    'job_offers.empty',
                                    'Aucune offre pour le moment.',
                                )}
                            </span>
                        }
                        minWidth="860px"
                        sort={filters}
                        onSort={handleSort}
                    />
                </BackofficeIndexPanel>

                <IndexTablePagination
                    paginated={offers}
                    itemLabel="offre(s)"
                    buildPageUrl={buildPageUrl}
                />
            </div>
        </>
    );
}
