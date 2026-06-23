import { Head, Link, router, usePage } from '@inertiajs/react';
import { Handshake, Plus, Search, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
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
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type PageProps = {
    partners: PaginatedPartners;
    filters: {
        search?: string;
        status?: string;
    };
    canCreate: boolean;
};

export default function PartnersIndex() {
    const { partners, filters, canCreate } =
        usePage<PageProps>().props;

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

    return (
        <>
            <Head title="Partenaires" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-heading text-2xl font-semibold tracking-tight">
                            Partenaires
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Gérez les partenaires affichés sur le défilement de la page d’accueil.
                        </p>
                    </div>
                    {canCreate ? (
                        <Button asChild>
                            <Link href={create.url()}>
                                <Plus className="size-4" />
                                Ajouter un partenaire
                            </Link>
                        </Button>
                    ) : null}
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                    <div className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            type="search"
                            placeholder="Rechercher par nom..."
                            defaultValue={filters.search ?? ''}
                            onChange={(event) =>
                                debouncedSearch(event.target.value)
                            }
                            className="pl-9"
                        />
                    </div>
                    <select
                        defaultValue={filters.status ?? 'all'}
                        onChange={(event) =>
                            applyFilters({
                                status:
                                    event.target.value === 'all'
                                        ? undefined
                                        : event.target.value,
                            })
                        }
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="published">Actifs</option>
                        <option value="draft">Inactifs</option>
                    </select>
                </div>

                {partners.data.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {partners.data.map((partner) => (
                            <article
                                key={partner.uuid}
                                className="overflow-hidden rounded-xl border bg-card"
                            >
                                <div className="aspect-[2/1] w-full bg-slate-50 flex items-center justify-center p-6 border-b">
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                                <div className="space-y-3 p-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge
                                            variant={
                                                partner.is_published
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                        >
                                            {partner.is_published
                                                ? 'Actif'
                                                : 'Inactif'}
                                        </Badge>
                                        <span className="text-muted-foreground text-xs">
                                            Ordre {partner.sort_order}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg">{partner.name}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {partner.can_update ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={edit.url(partner.uuid)}
                                                >
                                                    Modifier
                                                </Link>
                                            </Button>
                                        ) : null}
                                        {partner.can_delete ? (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            'Supprimer ce partenaire ?',
                                                        )
                                                    ) {
                                                        router.delete(
                                                            destroy.url(
                                                                partner.uuid,
                                                            ),
                                                        );
                                                    }
                                                }}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        ) : null}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
                        <Handshake className="text-muted-foreground size-10" />
                        <p className="text-muted-foreground">
                            Aucun partenaire trouvé.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

PartnersIndex.layout = {
    breadcrumbs: [{ title: 'Partenaires', href: index.url() }],
};
