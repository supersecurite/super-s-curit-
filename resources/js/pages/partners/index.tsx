import { Head, Link, router, usePage } from '@inertiajs/react';
import { Handshake, Plus, Search, Trash2 } from 'lucide-react';
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
import { withIndexTableQuery } from '@/lib/index-table-query';
import {
    create,
    destroy,
    edit,
    index,
} from '@/routes/partners';

type PartnerRow = {
    id: number;
    uuid: string;
    name: string;
    logo: string;
    logo_path: string;
    sort_order: number;
    is_published: boolean;
    can_update: boolean;
    can_delete: boolean;
    updated_at_formatted: string | null;
};

type PaginatedPartners = {
    data: PartnerRow[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type PageProps = {
    partners: PaginatedPartners;
    filters: TableSortState & {
        search?: string;
        status?: string;
    };
    canCreate: boolean;
};

export default function PartnersIndex() {
    const { partners, filters, canCreate } = usePage<PageProps>().props;

    const applyFilters = (
        updates: Partial<TableSortState & { search?: string; status?: string; page?: number }>,
    ) => {
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

    const columns = useMemo((): ResponsiveColumn<PartnerRow>[] => {
        const renderActions = (partner: PartnerRow) => (
            <>
                {partner.can_update ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={edit.url(partner.uuid)}>Modifier</Link>
                    </Button>
                ) : null}
                {partner.can_delete ? (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                            if (confirm('Supprimer ce partenaire ?')) {
                                router.delete(destroy.url(partner.uuid));
                            }
                        }}
                    >
                        <Trash2 className="size-4" aria-hidden />
                        Supprimer
                    </Button>
                ) : null}
            </>
        );

        return [
            {
                id: 'logo',
                header: 'Logo',
                mobileRole: 'meta',
                cell: (partner) => (
                    <div className="flex h-12 w-24 items-center justify-center rounded-md border bg-muted/30 p-2">
                        <img
                            src={partner.logo}
                            alt=""
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                ),
            },
            {
                id: 'name',
                header: 'Nom',
                sortKey: 'name',
                sortable: true,
                mobileRole: 'title',
                cell: (partner) => partner.name,
            },
            {
                id: 'status',
                header: 'Statut',
                mobileRole: 'meta',
                cell: (partner) => (
                    <Badge variant={partner.is_published ? 'default' : 'outline'}>
                        {partner.is_published ? 'Actif' : 'Inactif'}
                    </Badge>
                ),
            },
            {
                id: 'sort_order',
                header: 'Ordre',
                sortKey: 'sort_order',
                sortable: true,
                mobileRole: 'meta',
                className: 'text-muted-foreground',
                cell: (partner) => partner.sort_order,
            },
            {
                id: 'updated_at',
                header: 'Modifié le',
                sortKey: 'updated_at',
                sortable: true,
                mobileRole: 'meta',
                className: 'text-muted-foreground whitespace-nowrap',
                cell: (partner) => partner.updated_at_formatted ?? '—',
            },
            {
                id: 'actions',
                header: 'Actions',
                mobileRole: 'actions',
                headerClassName: 'text-right',
                className: 'text-right',
                cell: renderActions,
            },
        ];
    }, []);

    return (
        <>
            <Head title="Partenaires" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-heading flex items-center gap-2 text-2xl font-semibold tracking-tight">
                            <Handshake className="size-6" aria-hidden />
                            Partenaires
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Gérez les partenaires affichés sur le défilement de la page
                            d&apos;accueil.
                        </p>
                    </div>
                    {canCreate ? (
                        <Button asChild>
                            <Link href={create.url()}>
                                <Plus className="size-4" aria-hidden />
                                Ajouter un partenaire
                            </Link>
                        </Button>
                    ) : null}
                </div>

                <BackofficeFiltersBar>
                    <div className="relative min-w-0 flex-1">
                        <Label htmlFor="partners-search" className="sr-only">
                            Recherche
                        </Label>
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            id="partners-search"
                            type="search"
                            placeholder="Rechercher par nom…"
                            defaultValue={filters.search ?? ''}
                            onChange={(event) =>
                                debouncedSearch(event.target.value)
                            }
                            className="pl-9"
                        />
                    </div>
                    <div className="min-w-0 sm:max-w-xs">
                        <Label className="mb-1 block text-sm">Statut</Label>
                        <SearchableSelect
                            options={[
                                { value: 'all', label: 'Tous les statuts' },
                                { value: 'published', label: 'Actifs' },
                                { value: 'draft', label: 'Inactifs' },
                            ]}
                            value={filters.status ?? 'all'}
                            onChange={(status) =>
                                applyFilters({
                                    status: status === 'all' ? undefined : status,
                                })
                            }
                            placeholder="Statut"
                            searchPlaceholder="Rechercher…"
                        />
                    </div>
                </BackofficeFiltersBar>

                <BackofficeIndexPanel>
                    <ResponsiveDataTable
                        rows={partners.data}
                        columns={columns}
                        getRowKey={(partner) => partner.uuid}
                        emptyMessage={
                            <span className="inline-flex flex-col items-center gap-2">
                                <Handshake className="size-8 opacity-60" />
                                Aucun partenaire trouvé.
                            </span>
                        }
                        minWidth="760px"
                        sort={filters}
                        onSort={handleSort}
                    />
                </BackofficeIndexPanel>

                <IndexTablePagination
                    paginated={partners}
                    itemLabel="partenaire(s)"
                    buildPageUrl={buildPageUrl}
                />
            </div>
        </>
    );
}

PartnersIndex.layout = {
    breadcrumbs: [{ title: 'Partenaires', href: index.url() }],
};
