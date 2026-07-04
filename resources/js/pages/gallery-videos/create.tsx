import { Head, usePage } from '@inertiajs/react';
import GalleryVideoForm from '@/components/gallery-videos/gallery-video-form';
import { create, index, store } from '@/routes/gallery-videos';
import type { GalleryServiceOption } from '@/types/gallery';

type PageProps = {
    errors: Record<string, string>;
    services: GalleryServiceOption[];
};

export default function GalleryVideosCreate() {
    const { errors, services } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Nouvelle vidéo galerie" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Nouvelle vidéo
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Ajoutez un lien YouTube à la galerie publique.
                    </p>
                </div>

                <GalleryVideoForm
                    submitUrl={store.url()}
                    submitLabel="Ajouter la vidéo"
                    cancelHref={index.url()}
                    services={services}
                    errors={errors}
                />
            </div>
        </>
    );
}

GalleryVideosCreate.layout = {
    breadcrumbs: [
        { title: 'Vidéos galerie', href: index.url() },
        { title: 'Nouvelle', href: create.url() },
    ],
};
