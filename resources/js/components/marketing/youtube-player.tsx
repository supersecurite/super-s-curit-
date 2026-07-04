import { cn } from '@/lib/utils';

type YoutubePlayerSource = {
    title: string;
    youtube_id: string | null;
    embed_url: string | null;
    is_short?: boolean;
};

type YoutubePlayerProps = {
    video: YoutubePlayerSource;
    autoplay?: boolean;
    className?: string;
    iframeClassName?: string;
};

function buildEmbedSrc(
    video: YoutubePlayerSource,
    autoplay: boolean,
): string | null {
    if (!video.youtube_id) {
        return null;
    }

    const url = new URL(
        `https://www.youtube-nocookie.com/embed/${video.youtube_id}`,
    );

    url.searchParams.set('autoplay', autoplay ? '1' : '0');
    url.searchParams.set('rel', '0');
    url.searchParams.set('modestbranding', '1');
    url.searchParams.set('playsinline', '1');
    url.searchParams.set('iv_load_policy', '3');

    if (video.is_short) {
        url.searchParams.set('loop', '1');
        url.searchParams.set('playlist', video.youtube_id);
    }

    return url.toString();
}

export default function YoutubePlayer({
    video,
    autoplay = false,
    className,
    iframeClassName,
}: YoutubePlayerProps) {
    const embedSrc = buildEmbedSrc(video, autoplay);

    if (!embedSrc) {
        return null;
    }

    return (
        <div
            className={cn(
                'relative w-full overflow-hidden bg-slate-950',
                video.is_short
                    ? 'mx-auto aspect-[9/16] max-w-[min(100%,360px)]'
                    : 'aspect-video',
                className,
            )}
        >
            <iframe
                src={embedSrc}
                title={video.title}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className={cn('absolute inset-0 size-full border-0', iframeClassName)}
            />
        </div>
    );
}
