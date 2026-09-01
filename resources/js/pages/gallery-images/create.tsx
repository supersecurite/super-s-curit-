import { Head, usePage } from '@inertiajs/react';
import GalleryImageForm from '@/components/gallery-images/gallery-image-form';
import { create, index, store } from '@/routes/gallery-images';
import type { GalleryServiceOption } from '@/types/gallery';

type PageProps = {
    errors: Record<string, string>;
    services: GalleryServiceOption[];
};

export default function GalleryImagesCreate() {
    const { errors, services } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Nouvelle image galerie" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Nouvelle image
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Ajoutez une photo à la galerie publique et à la page
                        service correspondante.
                    </p>
                </div>

                <GalleryImageForm
                    submitUrl={store.url()}
                    submitLabel="Ajouter l’image"
                    cancelHref={index.url()}
                    services={services}
                    errors={errors}
                />
            </div>
        </>
    );
}

GalleryImagesCreate.layout = {
    breadcrumbs: [
        { title: 'Galerie', href: index.url() },
        { title: 'Nouvelle image', href: create.url() },
    ],
};
