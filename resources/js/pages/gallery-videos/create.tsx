import { Head, setLayoutProps, usePage } from '@inertiajs/react';
import GalleryVideoForm from '@/components/gallery-videos/gallery-video-form';
import { useTrans } from '@/hooks/use-trans';
import { create, index, store } from '@/routes/gallery-videos';
import type { GalleryServiceOption } from '@/types/gallery';

type PageProps = {
    errors: Record<string, string>;
    services: GalleryServiceOption[];
};

export default function GalleryVideosCreate() {
    const { t } = useTrans();
    const { errors, services } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            {
                title: t('gallery_videos.title', 'Vidéos galerie'),
                href: index.url(),
            },
            {
                title: t('gallery_videos.create_h1', 'Nouvelle vidéo'),
                href: create.url(),
            },
        ],
    });

    return (
        <>
            <Head title={t('gallery_videos.create', 'Nouvelle vidéo galerie')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        {t('gallery_videos.create_h1', 'Nouvelle vidéo')}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {t(
                            'gallery_videos.create_subtitle',
                            'Ajoutez un lien YouTube à la galerie publique.',
                        )}
                    </p>
                </div>

                <GalleryVideoForm
                    submitUrl={store.url()}
                    submitLabel={t(
                        'gallery_videos.submit_add',
                        'Ajouter la vidéo',
                    )}
                    cancelHref={index.url()}
                    services={services}
                    errors={errors}
                />
            </div>
        </>
    );
}
