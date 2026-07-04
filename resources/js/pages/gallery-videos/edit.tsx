import { Head, usePage } from '@inertiajs/react';
import GalleryVideoForm from '@/components/gallery-videos/gallery-video-form';
import { index, update } from '@/routes/gallery-videos';
import type { GalleryServiceOption } from '@/types/gallery';

type GalleryVideoData = {
    id: number;
    service_id: string | null;
    youtube_url: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    sort_order: number;
    is_published: boolean;
};

type PageProps = {
    galleryVideo: GalleryVideoData;
    services: GalleryServiceOption[];
    errors: Record<string, string>;
};

export default function GalleryVideosEdit() {
    const { galleryVideo, services, errors } = usePage<PageProps>().props;

    return (
        <>
            <Head title={`Modifier — ${galleryVideo.title}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Modifier la vidéo
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {galleryVideo.title}
                    </p>
                </div>

                <GalleryVideoForm
                    submitUrl={update.url(galleryVideo.id)}
                    submitLabel="Enregistrer"
                    cancelHref={index.url()}
                    services={services}
                    errors={errors}
                    galleryVideo={galleryVideo}
                    method="put"
                />
            </div>
        </>
    );
}

GalleryVideosEdit.layout = {
    breadcrumbs: [
        { title: 'Vidéos galerie', href: index.url() },
        { title: 'Modifier', href: '#' },
    ],
};
