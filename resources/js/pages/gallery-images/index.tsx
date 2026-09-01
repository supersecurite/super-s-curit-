import { Head, Link, router, usePage } from '@inertiajs/react';
import { Images, Plus, Search, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import {
    create,
    destroy,
    edit,
    index,
} from '@/routes/gallery-images';
import type { GalleryServiceOption } from '@/types/gallery';

type GalleryImageRow = {
    id: number;
    service_label: string;
    src: string;
    alt: string;
    caption: string | null;
    sort_order: number;
    is_published: boolean;
    can_update: boolean;
    can_delete: boolean;
    updated_at_formatted: string | null;
};

type PaginatedGalleryImages = {
    data: GalleryImageRow[];
    current_page: number;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type PageProps = {
    galleryImages: PaginatedGalleryImages;
    services: GalleryServiceOption[];
    filters: {
        search?: string;
        service?: string;
        status?: string;
    };
    canCreate: boolean;
};

export default function GalleryImagesIndex() {
    const { galleryImages, services, filters, canCreate } =
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
            <Head title="Galerie" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-heading text-2xl font-semibold tracking-tight">
                            Galerie
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Gérez les images affichées sur la page galerie et
                            les pages services.
                        </p>
                    </div>
                    {canCreate ? (
                        <Button asChild>
                            <Link href={create.url()}>
                                <Plus className="size-4" />
                                Ajouter une image
                            </Link>
                        </Button>
                    ) : null}
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                    <div className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            type="search"
                            placeholder="Rechercher par légende ou alt..."
                            defaultValue={filters.search ?? ''}
                            onChange={(event) =>
                                debouncedSearch(event.target.value)
                            }
                            className="pl-9"
                        />
                    </div>
                    <SearchableSelect
                        options={[
                            { value: 'all', label: 'Tous les rattachements' },
                            { value: 'general', label: 'Galerie générale' },
                            ...services.map((service) => ({
                                value: service.value,
                                label: service.label,
                            })),
                        ]}
                        value={filters.service ?? 'all'}
                        onChange={(service) =>
                            applyFilters({
                                service: service === 'all' ? undefined : service,
                            })
                        }
                        placeholder="Rattachement"
                        searchPlaceholder="Rechercher..."
                    />
                    <SearchableSelect
                        options={[
                            { value: 'all', label: 'Tous les statuts' },
                            { value: 'published', label: 'Publiées' },
                            { value: 'draft', label: 'Non publiées' },
                        ]}
                        value={filters.status ?? 'all'}
                        onChange={(status) =>
                            applyFilters({
                                status: status === 'all' ? undefined : status,
                            })
                        }
                        placeholder="Statut"
                        searchPlaceholder="Rechercher..."
                    />
                </div>

                {galleryImages.data.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {galleryImages.data.map((image) => (
                            <article
                                key={image.id}
                                className="overflow-hidden rounded-xl border bg-card"
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="aspect-[4/3] w-full object-cover"
                                />
                                <div className="space-y-3 p-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="secondary">
                                            {image.service_label}
                                        </Badge>
                                        <Badge
                                            variant={
                                                image.is_published
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                        >
                                            {image.is_published
                                                ? 'Publiée'
                                                : 'Brouillon'}
                                        </Badge>
                                        <span className="text-muted-foreground text-xs">
                                            Ordre {image.sort_order}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{image.alt}</p>
                                        {image.caption ? (
                                            <p className="text-muted-foreground mt-1 text-sm">
                                                {image.caption}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="flex gap-2">
                                        {image.can_update ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={edit.url(image.id)}
                                                >
                                                    Modifier
                                                </Link>
                                            </Button>
                                        ) : null}
                                        {image.can_delete ? (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            'Supprimer cette image ?',
                                                        )
                                                    ) {
                                                        router.delete(
                                                            destroy.url(
                                                                image.id,
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
                        <Images className="text-muted-foreground size-10" />
                        <p className="text-muted-foreground">
                            Aucune image dans la galerie.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

GalleryImagesIndex.layout = {
    breadcrumbs: [{ title: 'Galerie', href: index.url() }],
};
