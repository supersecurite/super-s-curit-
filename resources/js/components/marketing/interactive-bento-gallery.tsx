import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type BentoGalleryMediaItem = {
    id: number;
    type: 'image' | 'video';
    title: string;
    desc: string;
    url: string;
    span: string;
};

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

export function galleryImagesToBentoItems(
    images: readonly {
        id: number;
        src: string;
        alt: string;
        caption?: string | null;
    }[],
): BentoGalleryMediaItem[] {
    return images.map((image, index) => ({
        id: image.id,
        type: 'image',
        title: image.alt,
        desc: image.caption ?? '',
        url: image.src,
        span: BENTO_SPANS[index % BENTO_SPANS.length],
    }));
}

function MediaItem({
    item,
    className,
    onClick,
}: {
    item: BentoGalleryMediaItem;
    className?: string;
    onClick?: () => void;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [isBuffering, setIsBuffering] = useState(true);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                setIsInView(entry.isIntersecting);
            });
        }, options);

        const videoElement = videoRef.current;

        if (videoElement) {
            observer.observe(videoElement);
        }

        return () => {
            if (videoElement) {
                observer.unobserve(videoElement);
            }
        };
    }, []);

    useEffect(() => {
        let mounted = true;

        const handleVideoPlay = async () => {
            if (!videoRef.current || !isInView || !mounted) {
                return;
            }

            try {
                if (videoRef.current.readyState >= 3) {
                    setIsBuffering(false);
                    await videoRef.current.play();
                } else {
                    setIsBuffering(true);
                    await new Promise((resolve) => {
                        if (videoRef.current) {
                            videoRef.current.oncanplay = resolve;
                        }
                    });
                    if (mounted) {
                        setIsBuffering(false);
                        await videoRef.current.play();
                    }
                }
            } catch {
                // Autoplay may be blocked by the browser.
            }
        };

        if (isInView) {
            handleVideoPlay();
        } else if (videoRef.current) {
            videoRef.current.pause();
        }

        return () => {
            mounted = false;
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.removeAttribute('src');
                videoRef.current.load();
            }
        };
    }, [isInView]);

    if (item.type === 'video') {
        return (
            <div className={cn('relative overflow-hidden', className)}>
                <video
                    ref={videoRef}
                    className="size-full object-cover"
                    onClick={onClick}
                    playsInline
                    muted
                    loop
                    preload="auto"
                    style={{
                        opacity: isBuffering ? 0.8 : 1,
                        transition: 'opacity 0.2s',
                        transform: 'translateZ(0)',
                        willChange: 'transform',
                    }}
                >
                    <source src={item.url} type="video/mp4" />
                </video>
                {isBuffering ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <div className="size-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    </div>
                ) : null}
            </div>
        );
    }

    return (
        <img
            src={item.url}
            alt={item.title}
            className={cn(className, 'cursor-pointer object-cover')}
            onClick={onClick}
            loading="lazy"
            decoding="async"
        />
    );
}

function GalleryModal({
    selectedItem,
    isOpen,
    onClose,
    setSelectedItem,
    mediaItems,
    showItemLabels,
}: {
    selectedItem: BentoGalleryMediaItem;
    isOpen: boolean;
    onClose: () => void;
    setSelectedItem: (item: BentoGalleryMediaItem | null) => void;
    mediaItems: BentoGalleryMediaItem[];
    showItemLabels: boolean;
}) {
    const { t: uiText } = useUiTranslations();

    const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 });

    if (!isOpen) {
        return null;
    }

    return (
        <>
            <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.98 }}
                transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                }}
                className="fixed inset-0 z-40 min-h-screen w-full overflow-hidden rounded-none bg-black/80 backdrop-blur-lg sm:h-[90vh] sm:rounded-lg md:h-[600px] md:rounded-xl"
            >
                <div className="flex h-full flex-col">
                    <div className="flex flex-1 items-center justify-center bg-black/20 p-2 sm:p-3 md:p-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedItem.id}
                                className="relative aspect-[16/9] h-auto max-h-[70vh] w-full max-w-[95%] overflow-hidden rounded-lg shadow-md sm:max-w-[85%] md:max-w-3xl"
                                initial={{ y: 20, scale: 0.97 }}
                                animate={{
                                    y: 0,
                                    scale: 1,
                                    transition: {
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 30,
                                        mass: 0.5,
                                    },
                                }}
                                exit={{
                                    y: 20,
                                    scale: 0.97,
                                    transition: { duration: 0.15 },
                                }}
                                onClick={onClose}
                            >
                                <MediaItem
                                    item={selectedItem}
                                    className="size-full bg-black/20 object-contain"
                                    onClick={onClose}
                                />
                                {showItemLabels ? (
                                    <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/50 to-transparent p-2 sm:p-3 md:p-4">
                                        <h3 className="text-base font-semibold text-white sm:text-lg md:text-xl">
                                            {selectedItem.title}
                                        </h3>
                                        {selectedItem.desc ? (
                                            <p className="mt-1 text-xs text-white/80 sm:text-sm">
                                                {selectedItem.desc}
                                            </p>
                                        ) : null}
                                    </div>
                                ) : null}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <motion.button
                    type="button"
                    className="absolute top-2 right-2 rounded-full bg-white/15 p-2 text-white backdrop-blur-sm sm:top-2.5 sm:right-2.5 md:top-3 md:right-3"
                    onClick={onClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={uiText(
                        'ui.components.text_c207d22f6253',
                        'Fermer la galerie',
                    )}
                >
                    <X className="size-4" aria-hidden />
                </motion.button>
            </motion.div>

            <motion.div
                drag
                dragMomentum={false}
                dragElastic={0.1}
                initial={false}
                animate={{ x: dockPosition.x, y: dockPosition.y }}
                onDragEnd={(_, info) => {
                    setDockPosition((prev) => ({
                        x: prev.x + info.offset.x,
                        y: prev.y + info.offset.y,
                    }));
                }}
                className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 touch-none"
            >
                <motion.div className="relative cursor-grab rounded-xl border border-white/20 bg-black/40 shadow-lg backdrop-blur-xl active:cursor-grabbing">
                    <div className="flex items-center -space-x-2 px-3 py-2">
                        {mediaItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setSelectedItem(item);
                                }}
                                style={{
                                    zIndex:
                                        selectedItem.id === item.id
                                            ? 30
                                            : mediaItems.length - index,
                                }}
                                className={cn(
                                    'group relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-lg sm:h-9 sm:w-9 md:h-10 md:w-10',
                                    selectedItem.id === item.id
                                        ? 'shadow-lg ring-2 ring-white/70'
                                        : 'hover:ring-2 hover:ring-white/30',
                                )}
                                initial={{
                                    rotate: index % 2 === 0 ? -15 : 15,
                                }}
                                animate={{
                                    scale:
                                        selectedItem.id === item.id ? 1.2 : 1,
                                    rotate:
                                        selectedItem.id === item.id
                                            ? 0
                                            : index % 2 === 0
                                              ? -15
                                              : 15,
                                    y: selectedItem.id === item.id ? -8 : 0,
                                }}
                                whileHover={{
                                    scale: 1.3,
                                    rotate: 0,
                                    y: -10,
                                    transition: {
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 25,
                                    },
                                }}
                            >
                                <MediaItem
                                    item={item}
                                    className="size-full"
                                    onClick={() => setSelectedItem(item)}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20" />
                                {selectedItem.id === item.id ? (
                                    <motion.div
                                        layoutId="activeGlow"
                                        className="absolute -inset-2 bg-white/20 blur-xl"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                ) : null}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}

type InteractiveBentoGalleryProps = {
    mediaItems: BentoGalleryMediaItem[];
    title?: string;
    description?: string;
    showItemLabels?: boolean;
    enableReorder?: boolean;
    className?: string;
};

export default function InteractiveBentoGallery({
    mediaItems,
    title,
    description,
    showItemLabels = true,
    enableReorder = false,
    className,
}: InteractiveBentoGalleryProps) {
    const [selectedItem, setSelectedItem] =
        useState<BentoGalleryMediaItem | null>(null);
    const [items, setItems] = useState(mediaItems);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        setItems(mediaItems);
        setSelectedItem(null);
    }, [mediaItems]);

    const showHeader = Boolean(title || description);

    return (
        <div className={cn('mx-auto max-w-5xl', className)}>
            {showHeader ? (
                <div className="mb-8 text-center">
                    {title ? (
                        <motion.h2
                            className="font-heading text-2xl font-bold text-super-securite-heading sm:text-3xl md:text-4xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {title}
                        </motion.h2>
                    ) : null}
                    {description ? (
                        <motion.p
                            className="mt-2 text-sm text-super-securite-muted sm:text-base"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {description}
                        </motion.p>
                    ) : null}
                </div>
            ) : null}

            <AnimatePresence mode="wait">
                {selectedItem ? (
                    <GalleryModal
                        selectedItem={selectedItem}
                        isOpen
                        onClose={() => setSelectedItem(null)}
                        setSelectedItem={setSelectedItem}
                        mediaItems={items}
                        showItemLabels={showItemLabels}
                    />
                ) : null}
            </AnimatePresence>

            <motion.div
                className="grid auto-rows-[60px] grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 },
                    },
                }}
            >
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        layoutId={`media-${item.id}`}
                        className={cn(
                            'relative cursor-pointer overflow-hidden rounded-xl',
                            item.span,
                        )}
                        onClick={() => !isDragging && setSelectedItem(item)}
                        variants={{
                            hidden: { y: 50, scale: 0.9, opacity: 0 },
                            visible: {
                                y: 0,
                                scale: 1,
                                opacity: 1,
                                transition: {
                                    type: 'spring',
                                    stiffness: 350,
                                    damping: 25,
                                    delay: index * 0.05,
                                },
                            },
                        }}
                        whileHover={{ scale: 1.02 }}
                        drag={enableReorder}
                        dragConstraints={
                            enableReorder
                                ? { left: 0, right: 0, top: 0, bottom: 0 }
                                : false
                        }
                        dragElastic={enableReorder ? 1 : 0}
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={(_, info) => {
                            setIsDragging(false);

                            if (!enableReorder) {
                                return;
                            }

                            const moveDistance = info.offset.x + info.offset.y;

                            if (Math.abs(moveDistance) > 50) {
                                const newItems = [...items];
                                const draggedItem = newItems[index];
                                const targetIndex =
                                    moveDistance > 0
                                        ? Math.min(index + 1, items.length - 1)
                                        : Math.max(index - 1, 0);
                                newItems.splice(index, 1);
                                newItems.splice(targetIndex, 0, draggedItem);
                                setItems(newItems);
                            }
                        }}
                    >
                        <MediaItem
                            item={item}
                            className="absolute inset-0 size-full"
                            onClick={() => !isDragging && setSelectedItem(item)}
                        />
                        {showItemLabels ? (
                            <motion.div
                                className="absolute inset-0 flex flex-col justify-end p-2 sm:p-3 md:p-4"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                <h3 className="relative line-clamp-1 text-xs font-medium text-white sm:text-sm md:text-base">
                                    {item.title}
                                </h3>
                                {item.desc ? (
                                    <p className="relative mt-0.5 line-clamp-2 text-[10px] text-white/70 sm:text-xs md:text-sm">
                                        {item.desc}
                                    </p>
                                ) : null}
                            </motion.div>
                        ) : null}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
