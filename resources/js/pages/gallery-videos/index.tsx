import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Search, Trash2, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import {
    create,
    destroy,
    edit,
    index,
} from '@/routes/gallery-videos';
import type { GalleryServiceOption } from '@/types/gallery';

type GalleryVideoRow = {
    id: number;
    service_label: string;
    title: string;
    description: string | null;
    youtube_url: string;
    thumbnail_url: string | null;
    sort_order: number;
    is_published: boolean;
    can_update: boolean;
    can_delete: boolean;
    updated_at_formatted: string | null;
};

type PaginatedGalleryVideos = {
    data: GalleryVideoRow[];
    current_page: number;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type PageProps = {
    galleryVideos: PaginatedGalleryVideos;
    services: GalleryServiceOption[];
    filters: {
        search?: string;
        service?: string;
        status?: string;
    };
    canCreate: boolean;
};

export default function GalleryVideosIndex() {
    const { galleryVideos, services, filters, canCreate } =
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
            <Head title="Vidéos galerie" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-heading text-2xl font-semibold tracking-tight">
                            Vidéos galerie
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Gérez les vidéos YouTube affichées sur la page
                            galerie publique.
                        </p>
                    </div>
                    {canCreate ? (
                        <Button asChild>
                            <Link href={create.url()}>
                                <Plus className="size-4" />
                                Ajouter une vidéo
                            </Link>
                        </Button>
                    ) : null}
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                    <div className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            type="search"
                            placeholder="Rechercher par titre ou description..."
                            defaultValue={filters.search ?? ''}
                            onChange={(event) =>
                                debouncedSearch(event.target.value)
                            }
                            className="pl-9"
                        />
                    </div>
                    <select
                        defaultValue={filters.service ?? 'all'}
                        onChange={(event) =>
                            applyFilters({
                                service:
                                    event.target.value === 'all'
                                        ? undefined
                                        : event.target.value,
                            })
                        }
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                        <option value="all">Tous les rattachements</option>
                        <option value="general">Galerie générale</option>
                        {services.map((service) => (
                            <option key={service.value} value={service.value}>
                                {service.label}
                            </option>
                        ))}
                    </select>
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
                        <option value="published">Publiées</option>
                        <option value="draft">Non publiées</option>
                    </select>
                </div>

                {galleryVideos.data.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {galleryVideos.data.map((video) => (
                            <article
                                key={video.id}
                                className="overflow-hidden rounded-xl border bg-card"
                            >
                                {video.thumbnail_url ? (
                                    <img
                                        src={video.thumbnail_url}
                                        alt={video.title}
                                        className="aspect-video w-full object-cover"
                                    />
                                ) : (
                                    <div className="bg-muted flex aspect-video items-center justify-center">
                                        <Video className="text-muted-foreground size-10" />
                                    </div>
                                )}
                                <div className="space-y-3 p-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="secondary">
                                            {video.service_label}
                                        </Badge>
                                        <Badge
                                            variant={
                                                video.is_published
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                        >
                                            {video.is_published
                                                ? 'Publiée'
                                                : 'Brouillon'}
                                        </Badge>
                                        <span className="text-muted-foreground text-xs">
                                            Ordre {video.sort_order}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {video.title}
                                        </p>
                                        {video.description ? (
                                            <p className="text-muted-foreground mt-1 text-sm">
                                                {video.description}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="flex gap-2">
                                        {video.can_update ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={edit.url(video.id)}
                                                >
                                                    Modifier
                                                </Link>
                                            </Button>
                                        ) : null}
                                        {video.can_delete ? (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            'Supprimer cette vidéo ?',
                                                        )
                                                    ) {
                                                        router.delete(
                                                            destroy.url(
                                                                video.id,
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
                        <Video className="text-muted-foreground size-10" />
                        <p className="text-muted-foreground">
                            Aucune vidéo dans la galerie.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

GalleryVideosIndex.layout = {
    breadcrumbs: [{ title: 'Vidéos galerie', href: index.url() }],
};
