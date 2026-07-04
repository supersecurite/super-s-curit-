import { AnimatePresence, motion } from 'framer-motion';
import { Play, X, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import YoutubePlayer from '@/components/marketing/youtube-player';
import type { GalleryVideoPublic } from '@/types/gallery';
import { cn } from '@/lib/utils';

type VideoCardProps = {
    video: GalleryVideoPublic;
    onSelect: (video: GalleryVideoPublic) => void;
};

function VideoCard({ video, onSelect }: VideoCardProps) {
    return (
        <motion.button
            type="button"
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-super-securite-border/30 bg-super-securite-surface text-left shadow-md"
            whileHover={{ y: -4, scale: 1.01 }}
            onClick={() => onSelect(video)}
        >
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                {video.thumbnail_url ? (
                    <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        loading="lazy"
                        className={cn(
                            'size-full transition-transform duration-500 group-hover:scale-102',
                            video.is_short ? 'object-cover object-center' : 'object-cover',
                        )}
                    />
                ) : (
                    <div className="flex size-full items-center justify-center bg-slate-900">
                        <Video className="size-10 text-super-securite-muted" />
                    </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-100 transition-opacity duration-300 group-hover:bg-black/45">
                    <div className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20 group-hover:text-super-securite-accent">
                        <Play className="ml-0.5 size-5 fill-current" />
                    </div>
                </div>
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
        </motion.button>
    );
}

type VideoGalleryProps = {
    videos: GalleryVideoPublic[];
    className?: string;
};

export default function VideoGallery({ videos, className }: VideoGalleryProps) {
    const [selectedVideo, setSelectedVideo] =
        useState<GalleryVideoPublic | null>(null);

    useEffect(() => {
        if (selectedVideo) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [selectedVideo]);

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
                    <VideoCard
                        key={video.id}
                        video={video}
                        onSelect={setSelectedVideo}
                    />
                ))}
            </div>

            <AnimatePresence>
                {selectedVideo?.youtube_id ? (
                    <motion.div
                        className="fixed inset-0 z-[250] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.div
                            className={cn(
                                'relative w-full overflow-hidden rounded-xl bg-slate-950 shadow-2xl',
                                selectedVideo.is_short
                                    ? 'max-w-[min(100%,360px)]'
                                    : 'max-w-4xl',
                            )}
                            initial={{ scale: 0.95, y: 15 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 15 }}
                            transition={{
                                type: 'spring',
                                stiffness: 350,
                                damping: 25,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <YoutubePlayer video={selectedVideo} autoplay />

                            <button
                                type="button"
                                className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                                onClick={() => setSelectedVideo(null)}
                                aria-label="Fermer la vidéo"
                            >
                                <X className="size-5" />
                            </button>

                            <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
                                <h3 className="font-heading text-base font-semibold sm:text-lg">
                                    {selectedVideo.title}
                                </h3>
                                {selectedVideo.description ? (
                                    <p className="mt-1 text-xs text-white/80 sm:text-sm">
                                        {selectedVideo.description}
                                    </p>
                                ) : null}
                            </div>
                        </motion.div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
