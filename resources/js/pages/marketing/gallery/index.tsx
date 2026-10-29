import { Head, router, usePage } from '@inertiajs/react';
import { Images, Video } from 'lucide-react';
import { useState } from 'react';
import GalleryBentoGrid from '@/components/marketing/gallery-bento-grid';
import { useGalleryLightbox } from '@/components/marketing/gallery-lightbox';
import ResourcesV2Header from '@/components/marketing/resources-v2-header';
import SeoHead from '@/components/marketing/seo-head';
import VideoGallery from '@/components/marketing/video-gallery';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';
import { cn } from '@/lib/utils';
import { index as galerieIndex } from '@/routes/galerie';
import type {
    GalleryImagePublic,
    GalleryServiceOption,
    GalleryVideoPublic,
} from '@/types/gallery';

type PageProps = {
    images: GalleryImagePublic[];
    videos: GalleryVideoPublic[];
    services: GalleryServiceOption[];
    countsByService: Record<string, number>;
    countsVideosByService: Record<string, number>;
    filters: {
        service: string;
    };
};

export default function MarketingGalleryIndex() {
    const {
        images,
        videos,
        services,
        countsByService,
        countsVideosByService,
        filters,
    } = usePage<PageProps>().props;
    const { t } = useTrans();
    const lp = useLocalizedUrl();

    const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');

    const totalVideoCount = Object.values(countsVideosByService).reduce(
        (sum, count) => sum + count,
        0,
    );

    const lightboxImages = images.map((image) => ({
        src: image.src,
        alt: image.alt,
        caption: image.caption,
    }));
    const { openAt, lightbox } = useGalleryLightbox(lightboxImages);

    const totalCount = Object.values(countsByService).reduce(
        (sum, count) => sum + count,
        0,
    );

    const applyServiceFilter = (service: string) => {
        router.get(
            lp(galerieIndex.url()),
            service === 'all' ? {} : { service },
            { preserveState: true, replace: true },
        );
    };

    return (
        <div className="resources-v2 resources-v2-gallery">
            <SeoHead />
            <Head title={t('galerie.title')} />

            <ResourcesV2Header active="gallery" />

            <section className="resources-v2-list">
                <div className="resources-v2-container">
                    {/* Tab Switcher */}
                    <div className="resources-v2-media-switch mb-6 flex justify-start">
                        <div className="flex rounded-full border border-super-securite-border/30 bg-super-securite-bg p-1 shadow-md">
                            <button
                                type="button"
                                aria-pressed={activeTab === 'photos'}
                                onClick={() => setActiveTab('photos')}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300',
                                    activeTab === 'photos'
                                        ? 'bg-super-securite-accent text-white shadow-sm'
                                        : 'text-super-securite-heading hover:text-super-securite-accent',
                                )}
                            >
                                <Images className="size-4" />
                                {t('galerie.photos_tab', 'Photos')} (
                                {images.length})
                            </button>
                            <button
                                type="button"
                                aria-pressed={activeTab === 'videos'}
                                onClick={() => setActiveTab('videos')}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300',
                                    activeTab === 'videos'
                                        ? 'bg-super-securite-accent text-white shadow-sm'
                                        : 'text-super-securite-heading hover:text-super-securite-accent',
                                )}
                            >
                                <Video className="size-4" />
                                {t('galerie.videos_tab', 'Vidéos')} (
                                {videos.length})
                            </button>
                        </div>
                    </div>

                    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="marketing-label mb-2">
                                {t('galerie.filter_label', 'Filtrer')}
                            </p>
                            <p className="text-sm text-super-securite-muted">
                                {activeTab === 'photos' ? (
                                    <>
                                        {t(
                                            images.length === 1
                                                ? 'galerie.photo_count_singular'
                                                : 'galerie.photo_count_plural',
                                            {
                                                count: images.length,
                                                total: totalCount,
                                            },
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {t(
                                            videos.length === 1
                                                ? 'galerie.video_count_singular'
                                                : 'galerie.video_count_plural',
                                            {
                                                count: videos.length,
                                                total: totalVideoCount,
                                            },
                                        )}
                                    </>
                                )}
                            </p>
                        </div>

                        <label className="resources-v2-service-filter">
                            <span className="sr-only">
                                {t('resources_v2.all_services')}
                            </span>
                            <select
                                value={filters.service}
                                onChange={(event) =>
                                    applyServiceFilter(event.target.value)
                                }
                            >
                                <option value="all">
                                    {t('resources_v2.all_services')} (
                                    {activeTab === 'photos'
                                        ? totalCount
                                        : totalVideoCount}
                                    )
                                </option>
                                <option value="general">
                                    {t('galerie.general_filter')} (
                                    {activeTab === 'photos'
                                        ? (countsByService.general ?? 0)
                                        : (countsVideosByService.general ?? 0)}
                                    )
                                </option>
                                {services.map((service) => (
                                    <option
                                        key={service.value}
                                        value={service.value}
                                    >
                                        {t(
                                            'services.' +
                                                service.value +
                                                '.title',
                                            service.label,
                                        )}{' '}
                                        (
                                        {activeTab === 'photos'
                                            ? (countsByService[service.value] ??
                                              0)
                                            : (countsVideosByService[
                                                  service.value
                                              ] ?? 0)}
                                        )
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <h2 className="resource-v2-section-title">
                        {t('resources_v2.gallery_title')}
                    </h2>

                    {activeTab === 'photos' ? (
                        images.length > 0 ? (
                            <GalleryBentoGrid
                                images={images}
                                onImageClick={openAt}
                            />
                        ) : (
                            <div className="marketing-card flex flex-col items-center gap-3 py-16 text-center">
                                <Images className="size-10 text-super-securite-muted" />
                                <p className="text-super-securite-muted">
                                    {t('galerie.no_photos')}
                                </p>
                            </div>
                        )
                    ) : (
                        <VideoGallery videos={videos} />
                    )}
                </div>
            </section>
            {lightbox}
        </div>
    );
}
