import type { GalleryVideoPublic } from '@/types/gallery';
import { cn } from '@/lib/utils';

type MarketingYoutubeEmbedProps = {
    video: GalleryVideoPublic;
    className?: string;
    title?: string;
    description?: string;
};

export default function MarketingYoutubeEmbed({
    video,
    className,
    title,
    description,
}: MarketingYoutubeEmbedProps) {
    if (!video.embed_url) {
        return null;
    }

    return (
        <div className={cn('space-y-4', className)}>
            {(title ?? video.title) ? (
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="marketing-heading-section">
                        {title ?? video.title}
                    </h2>
                    {(description ?? video.description) ? (
                        <p className="mt-3 text-sm text-super-securite-muted sm:text-base">
                            {description ?? video.description}
                        </p>
                    ) : null}
                </div>
            ) : null}

            <div className="overflow-hidden rounded-2xl border border-super-securite-border/40 bg-slate-950 shadow-lg shadow-slate-900/10">
                <div className="relative aspect-video w-full">
                    <iframe
                        src={video.embed_url}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 size-full border-0"
                    />
                </div>
            </div>
        </div>
    );
}
