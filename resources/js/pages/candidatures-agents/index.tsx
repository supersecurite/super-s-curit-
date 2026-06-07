import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, LayoutList, MapPin, Search, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LocationCascadingSelects, {
    type LocationValues,
} from '@/components/marketing/location-cascading-selects';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { index, show } from '@/routes/candidatures-agents';
import { useMemo, useState } from 'react';

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
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type PageProps = {
    applications: PaginatedApplications;
    filters: {
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

    const applyFilters = (updates: Record<string, string | undefined>) => {
        const next = { ...filters, ...updates };

        Object.keys(next).forEach((key) => {
            if (next[key as keyof typeof next] === undefined) {
                delete next[key as keyof typeof next];
            }
        });

        router.get(index.url(), next, { preserveState: true, replace: true });
    };

    const debouncedSearch = useDebouncedCallback((search: string) => {
        applyFilters({ search: search || undefined });
    });

    const applyLocationFilters = (nextLocation: LocationValues) => {
        setLocation(nextLocation);
        applyFilters({
            region_id: nextLocation.region_id || undefined,
            prefecture_id: nextLocation.prefecture_id || undefined,
            commune_id: nextLocation.commune_id || undefined,
        });
    };

    return (
        <>
            <Head title="Candidatures agents" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading flex items-center gap-2 text-2xl font-semibold tracking-tight">
                        <UserPlus className="size-6" aria-hidden />
                        Candidatures agents
                        {pendingCount > 0 ? (
                            <Badge variant="destructive" className="text-xs">
                                {pendingCount} en attente
                            </Badge>
                        ) : null}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Consultez et suivez les agents inscrits sur la
                        plateforme.
                    </p>
                </div>

                <div className="app-panel space-y-4 p-4">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="relative md:col-span-2">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input
                                className="pl-9"
                                placeholder="Rechercher par nom, téléphone, e-mail, poste..."
                                defaultValue={filters.search ?? ''}
                                onChange={(e) => debouncedSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                            defaultValue={filters.status ?? 'all'}
                            onChange={(e) =>
                                applyFilters({
                                    status:
                                        e.target.value === 'all'
                                            ? undefined
                                            : e.target.value,
                                })
                            }
                        >
                            <option value="all">Tous les statuts</option>
                            {statuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                        <select
                            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                            defaultValue={filters.post ?? 'all'}
                            onChange={(e) =>
                                applyFilters({
                                    post:
                                        e.target.value === 'all'
                                            ? undefined
                                            : e.target.value,
                                })
                            }
                        >
                            <option value="all">Tous les postes</option>
                            {posts.map((post) => (
                                <option key={post.value} value={post.value}>
                                    {post.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <p className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium">
                            <MapPin className="size-4" />
                            Filtrer par localisation
                        </p>
                        <LocationCascadingSelects
                            values={location}
                            onChange={applyLocationFilters}
                            fieldClassName="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                        />
                    </div>
                </div>

                <div className="app-panel overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[960px] text-left text-sm">
                            <thead className="bg-muted/50 border-b text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Candidat
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Poste
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Téléphone
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        E-mail
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Localisation
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Statut
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Expérience
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Disponibilité
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={10}
                                            className="text-muted-foreground px-4 py-8 text-center"
                                        >
                                            <LayoutList className="mx-auto mb-2 size-8 opacity-60" />
                                            Aucune candidature trouvée
                                        </td>
                                    </tr>
                                ) : (
                                    applications.data.map((application) => (
                                        <tr
                                            key={application.id}
                                            className="border-b transition-colors last:border-b-0 hover:bg-muted/60"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {application.full_name}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {application.post_label ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {application.phone}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {application.email ?? '—'}
                                            </td>
                                            <td className="text-muted-foreground max-w-[14rem] px-4 py-3">
                                                <span className="line-clamp-2">
                                                    {
                                                        application.location_summary
                                                    }
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={statusBadgeVariant(
                                                        application.status,
                                                    )}
                                                >
                                                    {
                                                        application.status_label
                                                    }
                                                </Badge>
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {application.experience_years !==
                                                null
                                                    ? `${application.experience_years} an(s)`
                                                    : '—'}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {application.availability_label ??
                                                    '—'}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3 whitespace-nowrap">
                                                {application.created_at_formatted ??
                                                    '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={show.url(
                                                                application.uuid,
                                                            )}
                                                            aria-label={`Voir la fiche de ${application.full_name}`}
                                                        >
                                                            <Eye
                                                                className="size-4"
                                                                aria-hidden
                                                            />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {applications.last_page > 1 ? (
                    <div className="flex flex-wrap justify-center gap-2">
                        {applications.links.map((link, linkIndex) => (
                            <Button
                                key={linkIndex}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => {
                                    if (link.url) {
                                        router.get(link.url, {}, {
                                            preserveState: true,
                                        });
                                    }
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}
                    </div>
                ) : null}
            </div>
        </>
    );
}

CandidaturesAgentsIndex.layout = {
    breadcrumbs: [{ title: 'Candidatures agents', href: index.url() }],
};
