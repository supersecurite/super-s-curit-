import { Video } from 'lucide-react';
import type { GalleryVideoPublic } from '@/types/gallery';
import { cn } from '@/lib/utils';

type VideoGalleryProps = {
    videos: GalleryVideoPublic[];
    className?: string;
};

export default function VideoGallery({ videos, className }: VideoGalleryProps) {
    if (videos.length === 0) {
        return (
            <div className="marketing-card flex flex-col items-center gap-3 py-16 text-center">
                <Video className="size-10 text-super-securite-muted" />
                <p className="text-super-securite-muted">
                    Aucune vidéo disponible pour ce filtre.
                </p>
            </div>
        );
    }

    return (
        <div className={cn('mx-auto max-w-5xl', className)}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {videos.map((video) => (
                    <article
                        key={video.id}
                        className="group flex flex-col overflow-hidden rounded-xl border border-super-securite-border/30 bg-super-securite-surface shadow-md"
                    >
                        <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                            {video.embed_url ? (
                                <iframe
                                    src={video.embed_url}
                                    title={video.title}
                                    loading="lazy"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="absolute inset-0 size-full border-0"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center bg-slate-900">
                                    <Video className="size-10 text-super-securite-muted" />
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <h3 className="line-clamp-1 font-heading text-sm font-semibold text-super-securite-heading sm:text-base">
                                {video.title}
                            </h3>
                            {video.description ? (
                                <p className="mt-1 line-clamp-2 text-xs text-super-securite-muted sm:text-sm">
                                    {video.description}
                                </p>
                            ) : null}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
