import { cn } from '@/lib/utils';

export type MarketingContentImageSource = 'storage' | 'public' | 'external';

type MarketingContentImageProps = {
    src: string | null;
    source?: MarketingContentImageSource | null;
    alt: string;
    className?: string;
};

export default function MarketingContentImage({
    src,
    source,
    alt,
    className,
}: MarketingContentImageProps) {
    if (!src) {
        return null;
    }

    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            data-image-source={source ?? undefined}
            className={cn(className)}
        />
    );
}
