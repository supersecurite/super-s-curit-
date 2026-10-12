import { Head, setLayoutProps, usePage } from '@inertiajs/react';
import GalleryImageForm from '@/components/gallery-images/gallery-image-form';
import { useTrans } from '@/hooks/use-trans';
import { create, index, store } from '@/routes/gallery-images';
import type { GalleryServiceOption } from '@/types/gallery';

type PageProps = {
    errors: Record<string, string>;
    services: GalleryServiceOption[];
};

export default function GalleryImagesCreate() {
    const { t } = useTrans();
    const { errors, services } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            {
                title: t('gallery_images.title', 'Galerie'),
                href: index.url(),
            },
            {
                title: t('gallery_images.create_h1', 'Nouvelle image'),
                href: create.url(),
            },
        ],
    });

    return (
        <>
            <Head title={t('gallery_images.create', 'Nouvelle image galerie')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        {t('gallery_images.create_h1', 'Nouvelle image')}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {t(
                            'gallery_images.create_subtitle',
                            'Ajoutez une photo à la galerie publique et à la page service correspondante.',
                        )}
                    </p>
                </div>

                <GalleryImageForm
                    submitUrl={store.url()}
                    submitLabel={t(
                        'gallery_images.submit_add',
                        "Ajouter l'image",
                    )}
                    cancelHref={index.url()}
                    services={services}
                    errors={errors}
                />
            </div>
        </>
    );
}
