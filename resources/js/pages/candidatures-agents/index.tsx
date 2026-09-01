import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, LayoutList, MapPin, Search, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    BackofficeFiltersBar,
    BackofficeIndexPanel,
    IndexTablePagination,
    ResponsiveDataTable,
    type ResponsiveColumn,
} from '@/components/backoffice/responsive-data-table';
import LocationCascadingSelects, {
    type LocationValues,
} from '@/components/marketing/location-cascading-selects';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { useIndexTableSort, type TableSortState } from '@/hooks/use-index-table-sort';
import { index, show } from '@/routes/candidatures-agents';

type ApplicationRow = {
    id: number;
    uuid: string;
    full_name: string;
    phone: string;
    email: string | null;
    post_label: string | null;
    location_summary: string;
    status: string;
    status_label: string;
    availability_label: string | null;
    experience_years: number | null;
    created_at_formatted: string | null;
};

type StatusOption = { value: string; label: string };
type PostOption = { value: string; label: string };

type PaginatedApplications = {
    data: ApplicationRow[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type PageProps = {
    applications: PaginatedApplications;
    filters: TableSortState & {
        search?: string;
        status?: string;
        post?: string;
        region_id?: string;
        prefecture_id?: string;
        commune_id?: string;
    };
    pendingCount: number;
    statuses: StatusOption[];
    posts: PostOption[];
};

function statusBadgeVariant(
    status: string,
): 'default' | 'secondary' | 'outline' | 'destructive' {
    if (status === 'recruited') {
        return 'default';
    }
    if (status === 'pending') {
        return 'secondary';
    }
    if (status === 'rejected') {
        return 'destructive';
    }
    return 'outline';
}

export default function CandidaturesAgentsIndex() {
    const { applications, filters, pendingCount, statuses, posts } =
        usePage<PageProps>().props;

    const initialLocation = useMemo<LocationValues>(
        () => ({
            region_id: filters.region_id ?? '',
            prefecture_id: filters.prefecture_id ?? '',
            commune_id: filters.commune_id ?? '',
        }),
        [filters.region_id, filters.prefecture_id, filters.commune_id],
    );

    const [location, setLocation] = useState<LocationValues>(initialLocation);

    const applyFilters = (
        updates: Partial<PageProps['filters'] & { page?: number }>,
    ) => {
        const next = { ...filters, ...updates };

        Object.keys(next).forEach((key) => {
            if (next[key as keyof typeof next] === undefined) {
                delete next[key as keyof typeof next];
            }
        });

        router.get(index.url(), next, { preserveState: true, replace: true });
    };

    const handleSort = useIndexTableSort(filters, applyFilters);

    const debouncedSearch = useDebouncedCallback((search: string) => {
        applyFilters({ search: search || undefined, page: 1 });
    });

    const applyLocationFilters = (nextLocation: LocationValues) => {
        setLocation(nextLocation);
        applyFilters({
            region_id: nextLocation.region_id || undefined,
            prefecture_id: nextLocation.prefecture_id || undefined,
            commune_id: nextLocation.commune_id || undefined,
        });
    };

    const columns = useMemo((): ResponsiveColumn<ApplicationRow>[] => {
        return [
            {
                id: 'name',
                header: 'Candidat',
                sortKey: 'full_name',
                sortable: true,
                mobileRole: 'title',
                cell: (application) => application.full_name,
            },
            {
                id: 'post',
                header: 'Poste',
                sortKey: 'post',
                sortable: true,
                mobileRole: 'subtitle',
                className: 'text-muted-foreground',
                cell: (application) => application.post_label ?? '—',
            },
            {
                id: 'phone',
                header: 'Téléphone',
                sortKey: 'phone',
                sortable: true,
                mobileRole: 'meta',
                cell: (application) => application.phone,
            },
            {
                id: 'email',
                header: 'E-mail',
                sortKey: 'email',
                sortable: true,
                mobileRole: 'meta',
                className: 'text-muted-foreground',
                cell: (application) => application.email ?? '—',
            },
            {
                id: 'location',
                header: 'Localisation',
                sortKey: 'location',
                sortable: true,
                mobileRole: 'meta',
                className: 'text-muted-foreground max-w-[14rem]',
                cell: (application) => (
                    <span className="line-clamp-2">
                        {application.location_summary}
                    </span>
                ),
            },
            {
                id: 'status',
                header: 'Statut',
                sortKey: 'status',
                sortable: true,
                mobileRole: 'meta',
                cell: (application) => (
                    <Badge variant={statusBadgeVariant(application.status)}>
                        {application.status_label}
                    </Badge>
                ),
            },
            {
                id: 'experience',
                header: 'Expérience',
                sortKey: 'experience_years',
                sortable: true,
                mobileRole: 'meta',
                className: 'text-muted-foreground',
                cell: (application) =>
                    application.experience_years !== null
                        ? `${application.experience_years} an(s)`
                        : '—',
            },
            {
                id: 'availability',
                header: 'Disponibilité',
                sortKey: 'availability',
                sortable: true,
                mobileRole: 'meta',
                className: 'text-muted-foreground',
                cell: (application) => application.availability_label ?? '—',
            },
            {
                id: 'date',
                header: 'Date',
                sortKey: 'created_at',
                sortable: true,
                mobileRole: 'meta',
                className: 'text-muted-foreground whitespace-nowrap',
                cell: (application) => application.created_at_formatted ?? '—',
            },
            {
                id: 'actions',
                header: 'Actions',
                mobileRole: 'actions',
                headerClassName: 'text-right',
                className: 'text-right',
                cell: (application) => (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={show.url(application.uuid)}>
                            <Eye className="size-4" aria-hidden />
                            Voir la fiche
                        </Link>
                    </Button>
                ),
            },
        ];
    }, []);

    return (
        <>
            <Head title="Candidatures agents" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading flex flex-wrap items-center gap-2 text-2xl font-semibold tracking-tight">
                        <UserPlus className="size-6" aria-hidden />
                        Candidatures agents
                        {pendingCount > 0 ? (
                            <Badge variant="destructive" className="text-xs">
                                {pendingCount} en attente
                            </Badge>
                        ) : null}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Consultez et suivez les agents inscrits sur la plateforme.
                    </p>
                </div>

                <div className="app-panel space-y-4 p-4">
                    <BackofficeFiltersBar>
                        <div className="relative min-w-0 flex-1 sm:col-span-2">
                            <Label htmlFor="candidatures-search" className="sr-only">
                                Recherche
                            </Label>
                            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input
                                id="candidatures-search"
                                className="pl-9"
                                placeholder="Rechercher par nom, téléphone, e-mail, poste…"
                                defaultValue={filters.search ?? ''}
                                onChange={(event) =>
                                    debouncedSearch(event.target.value)
                                }
                            />
                        </div>
                        <div className="min-w-0">
                            <Label className="mb-1 block text-sm">Statut</Label>
                            <SearchableSelect
                                options={[
                                    { value: 'all', label: 'Tous les statuts' },
                                    ...statuses.map((status) => ({
                                        value: status.value,
                                        label: status.label,
                                    })),
                                ]}
                                value={filters.status ?? 'all'}
                                onChange={(status) =>
                                    applyFilters({
                                        status:
                                            status === 'all' ? undefined : status,
                                    })
                                }
                                placeholder="Statut"
                                searchPlaceholder="Rechercher un statut…"
                            />
                        </div>
                        <div className="min-w-0">
                            <Label className="mb-1 block text-sm">Poste</Label>
                            <SearchableSelect
                                options={[
                                    { value: 'all', label: 'Tous les postes' },
                                    ...posts.map((post) => ({
                                        value: post.value,
                                        label: post.label,
                                    })),
                                ]}
                                value={filters.post ?? 'all'}
                                onChange={(post) =>
                                    applyFilters({
                                        post: post === 'all' ? undefined : post,
                                    })
                                }
                                placeholder="Poste"
                                searchPlaceholder="Rechercher un poste…"
                            />
                        </div>
                    </BackofficeFiltersBar>

                    <div>
                        <p className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium">
                            <MapPin className="size-4" />
                            Filtrer par localisation
                        </p>
                        <LocationCascadingSelects
                            values={location}
                            onChange={applyLocationFilters}
                        />
                    </div>
                </div>

                <BackofficeIndexPanel>
                    <ResponsiveDataTable
                        rows={applications.data}
                        columns={columns}
                        getRowKey={(application) => String(application.id)}
                        emptyMessage={
                            <span className="inline-flex flex-col items-center gap-2">
                                <LayoutList className="size-8 opacity-60" />
                                Aucune candidature trouvée
                            </span>
                        }
                        minWidth="960px"
                        sort={filters}
                        onSort={handleSort}
                    />
                </BackofficeIndexPanel>

                <IndexTablePagination
                    paginated={applications}
                    itemLabel="candidature(s)"
                />
            </div>
        </>
    );
}

CandidaturesAgentsIndex.layout = {
    breadcrumbs: [{ title: 'Candidatures agents', href: index.url() }],
};
