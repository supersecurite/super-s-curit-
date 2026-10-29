import MarketingContentImage from '@/components/marketing/marketing-content-image';
import Reveal from '@/components/marketing/reveal';
import { useTrans } from '@/hooks/use-trans';
import { cn } from '@/lib/utils';
import type { GalleryImagePublic } from '@/types/gallery';

const BENTO_SPANS = [
    'sm:col-span-2 row-span-4',
    'row-span-3',
    'row-span-2',
    'row-span-2',
    'sm:col-span-2 row-span-3',
    'row-span-2',
    'row-span-3',
    'sm:col-span-2 row-span-2',
] as const;

type GalleryBentoGridProps = {
    images: readonly GalleryImagePublic[];
    onImageClick: (index: number) => void;
};

export default function GalleryBentoGrid({
    images,
    onImageClick,
}: GalleryBentoGridProps) {
    const { t } = useTrans();

    return (
        <div className="mx-auto grid max-w-5xl auto-rows-[60px] grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image, index) => (
                <Reveal
                    key={image.id}
                    delay={index * 40}
                    className={cn(
                        'overflow-hidden rounded-xl',
                        BENTO_SPANS[index % BENTO_SPANS.length],
                    )}
                >
                    <button
                        type="button"
                        onClick={() => onImageClick(index)}
                        className="group relative size-full cursor-zoom-in overflow-hidden"
                        aria-label={t('enterprise_v2.enlarge', {
                            image: image.alt,
                        })}
                    >
                        <MarketingContentImage
                            src={image.src}
                            source={image.image_source}
                            alt={image.alt}
                            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </button>
                </Reveal>
            ))}
        </div>
    );
}
