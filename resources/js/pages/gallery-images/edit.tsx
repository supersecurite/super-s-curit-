import { Head, setLayoutProps, usePage } from '@inertiajs/react';
import GalleryImageForm from '@/components/gallery-images/gallery-image-form';
import { useTrans } from '@/hooks/use-trans';
import { edit, index, update } from '@/routes/gallery-images';
import type { GalleryServiceOption } from '@/types/gallery';

type GalleryImageData = {
    id: number;
    service_id: string;
    alt: string;
    caption: string | null;
    sort_order: number;
    is_published: boolean;
    src: string;
};

type PageProps = {
    errors: Record<string, string>;
    services: GalleryServiceOption[];
    galleryImage: GalleryImageData;
};

export default function GalleryImagesEdit() {
    const { t } = useTrans();
    const { errors, services, galleryImage } = usePage<PageProps>().props;
    const imageLabel =
        galleryImage.alt.trim() ||
        galleryImage.caption?.trim() ||
        `Image #${galleryImage.id}`;

    setLayoutProps({
        breadcrumbs: [
            {
                title: t('gallery_images.title', 'Galerie'),
                href: index.url(),
            },
            {
                title: imageLabel,
                href: edit.url(galleryImage.id),
            },
        ],
    });

    return (
        <>
            <Head title={t('gallery_images.edit', 'Modifier image galerie')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        {t('gallery_images.edit_h1', "Modifier l'image")}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {t(
                            'gallery_images.edit_subtitle',
                            'Mettez à jour les informations ou remplacez le fichier image.',
                        )}
                    </p>
                </div>

                <GalleryImageForm
                    submitUrl={update.url(galleryImage.id)}
                    submitLabel={t('common.save', 'Enregistrer')}
                    cancelHref={index.url()}
                    services={services}
                    errors={errors}
                    method="put"
                    galleryImage={{
                        service_id: galleryImage.service_id,
                        alt: galleryImage.alt,
                        caption: galleryImage.caption,
                        sort_order: galleryImage.sort_order,
                        is_published: galleryImage.is_published,
                        image_url: galleryImage.src,
                    }}
                />
            </div>
        </>
    );
}
