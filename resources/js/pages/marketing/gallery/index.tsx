import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Images, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import GalleryBentoGrid from '@/components/marketing/gallery-bento-grid';
import { useGalleryLightbox } from '@/components/marketing/gallery-lightbox';
import VideoGallery from '@/components/marketing/video-gallery';
import SeoHead from '@/components/marketing/seo-head';
import { useMarketingPageHero } from '@/hooks/use-marketing-page-hero';
import { useTrans } from '@/hooks/use-trans';
import { index as galerieIndex } from '@/routes/galerie';
import { cn } from '@/lib/utils';
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
    const hero = useMarketingPageHero('galerie');

    const [slideIndex, setSlideIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');

    useEffect(() => {
        setSlideIndex(0);
    }, [images]);

    useEffect(() => {
        if (images.length <= 1) {
            return;
        }
        const interval = setInterval(() => {
            setSlideIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

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
        <>
            <SeoHead />
            <Head title={t('galerie.title')} />

            <section className="marketing-hero-cinematic relative overflow-hidden">
                <div className="relative mx-auto flex min-h-[90dvh] w-full max-w-[1920px] items-end overflow-hidden lg:items-center">
                    {images.length > 0 ? (
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.img
                                key={slideIndex}
                                src={images[slideIndex].src}
                                alt={images[slideIndex].alt}
                                width={1920}
                                height={1080}
                                fetchPriority="high"
                                loading="eager"
                                decoding="async"
                                className="absolute inset-0 size-full max-w-full object-cover"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1, ease: 'easeInOut' }}
                            />
                        </AnimatePresence>
                    ) : (
                        <img
                            src={hero.image}
                            alt={hero.imageAlt}
                            width={1920}
                            height={1080}
                            fetchPriority="high"
                            loading="eager"
                            decoding="async"
                            className="absolute inset-0 size-full max-w-full object-cover"
                        />
                    )}

                    <div
                        className="marketing-hero-overlay-base pointer-events-none absolute inset-0"
                        aria-hidden
                    />
                    <div
                        className="absolute inset-y-0 left-0 w-1 bg-super-securite-accent sm:w-1.5"
                        aria-hidden
                    />
                </div>
            </section>

            <section className="marketing-section-band marketing-below-fold py-14 md:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Tab Switcher */}
                    <div className="mb-10 flex justify-center">
                        <div className="flex rounded-full border border-super-securite-border/30 bg-super-securite-bg p-1 shadow-md">
                            <button
                                type="button"
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

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => applyServiceFilter('all')}
                                className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                                    filters.service === 'all'
                                        ? 'border-super-securite-accent bg-super-securite-accent text-white'
                                        : 'border-super-securite-border bg-white text-super-securite-heading hover:border-super-securite-accent/40'
                                }`}
                            >
                                {t('galerie.all_filter')} (
                                {activeTab === 'photos'
                                    ? totalCount
                                    : totalVideoCount}
                                )
                            </button>
                            <button
                                type="button"
                                onClick={() => applyServiceFilter('general')}
                                className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                                    filters.service === 'general'
                                        ? 'border-super-securite-accent bg-super-securite-accent text-white'
                                        : 'border-super-securite-border bg-white text-super-securite-heading hover:border-super-securite-accent/40'
                                }`}
                            >
                                {t('galerie.general_filter')} (
                                {activeTab === 'photos'
                                    ? (countsByService.general ?? 0)
                                    : (countsVideosByService.general ?? 0)}
                                )
                            </button>
                            {services.map((service) => (
                                <button
                                    key={service.value}
                                    type="button"
                                    onClick={() =>
                                        applyServiceFilter(service.value)
                                    }
                                    className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                                        filters.service === service.value
                                            ? 'border-super-securite-accent bg-super-securite-accent text-white'
                                            : 'border-super-securite-border bg-white text-super-securite-heading hover:border-super-securite-accent/40'
                                    }`}
                                >
                                    {t(
                                        'services.' + service.value + '.title',
                                        service.label,
                                    )}{' '}
                                    (
                                    {activeTab === 'photos'
                                        ? (countsByService[service.value] ?? 0)
                                        : (countsVideosByService[
                                              service.value
                                          ] ?? 0)}
                                    )
                                </button>
                            ))}
                        </div>
                    </div>

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
        </>
    );
}
