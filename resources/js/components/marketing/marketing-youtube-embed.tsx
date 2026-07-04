import YoutubePlayer from '@/components/marketing/youtube-player';
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
    if (!video.youtube_id) {
        return null;
    }

    return (
        <div className={cn('space-y-4', className)}>

            <div className="overflow-hidden rounded-2xl border border-super-securite-border/40 bg-slate-950 shadow-lg shadow-slate-900/10">
                <YoutubePlayer video={video} />
            </div>
        </div>
    );
}
