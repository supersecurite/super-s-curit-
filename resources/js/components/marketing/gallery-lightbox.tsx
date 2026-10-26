import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import {
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    X,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
    type WheelEvent as ReactWheelEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export type GalleryLightboxImage = {
    src: string;
    alt: string;
    caption?: string | null;
};

type GalleryLightboxProps = {
    images: readonly GalleryLightboxImage[];
    open: boolean;
    index: number;
    onClose: () => void;
    onIndexChange: (index: number) => void;
};

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const SCALE_STEP = 0.25;

function clampScale(value: number): number {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

export function useGalleryLightbox(images: readonly GalleryLightboxImage[]) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const openAt = useCallback((nextIndex: number) => {
        setIndex(nextIndex);
        setOpen(true);
    }, []);

    const close = useCallback(() => {
        setOpen(false);
    }, []);

    return {
        open,
        index,
        openAt,
        close,
        setIndex,
        lightbox: (
            <GalleryLightbox
                images={images}
                open={open}
                index={index}
                onClose={close}
                onIndexChange={setIndex}
            />
        ),
    };
}

export default function GalleryLightbox({
    images,
    open,
    index,
    onClose,
    onIndexChange,
}: GalleryLightboxProps) {
    const { t: uiText } = useUiTranslations();

    const [scale, setScale] = useState(MIN_SCALE);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragOrigin = useRef({ x: 0, y: 0, originX: 0, originY: 0 });
    const touchStartX = useRef<number | null>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const currentImage = images[index];
    const hasMultiple = images.length > 1;

    const resetTransform = useCallback(() => {
        setScale(MIN_SCALE);
        setPosition({ x: 0, y: 0 });
    }, []);

    const goToPrevious = useCallback(() => {
        if (!hasMultiple) {
            return;
        }

        onIndexChange(index === 0 ? images.length - 1 : index - 1);
    }, [hasMultiple, images.length, index, onIndexChange]);

    const goToNext = useCallback(() => {
        if (!hasMultiple) {
            return;
        }

        onIndexChange(index === images.length - 1 ? 0 : index + 1);
    }, [hasMultiple, images.length, index, onIndexChange]);

    const zoomIn = useCallback(() => {
        setScale((current) => clampScale(current + SCALE_STEP));
    }, []);

    const zoomOut = useCallback(() => {
        setScale((current) => {
            const next = clampScale(current - SCALE_STEP);

            if (next === MIN_SCALE) {
                setPosition({ x: 0, y: 0 });
            }

            return next;
        });
    }, []);

    useEffect(() => {
        resetTransform();
    }, [index, open, resetTransform]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }

            if (event.key === 'ArrowLeft') {
                goToPrevious();
            }

            if (event.key === 'ArrowRight') {
                goToNext();
            }

            if (event.key === '+' || event.key === '=') {
                zoomIn();
            }

            if (event.key === '-') {
                zoomOut();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onClose, goToPrevious, goToNext, zoomIn, zoomOut]);

    const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
        event.preventDefault();

        setScale((current) => {
            const delta = event.deltaY < 0 ? SCALE_STEP : -SCALE_STEP;
            const next = clampScale(current + delta);

            if (next === MIN_SCALE) {
                setPosition({ x: 0, y: 0 });
            }

            return next;
        });
    };

    const handleDoubleClick = () => {
        if (scale > MIN_SCALE) {
            resetTransform();
            return;
        }

        setScale(2);
    };

    const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (scale <= MIN_SCALE) {
            return;
        }

        setIsDragging(true);
        dragOrigin.current = {
            x: event.clientX,
            y: event.clientY,
            originX: position.x,
            originY: position.y,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!isDragging) {
            return;
        }

        setPosition({
            x:
                dragOrigin.current.originX +
                (event.clientX - dragOrigin.current.x),
            y:
                dragOrigin.current.originY +
                (event.clientY - dragOrigin.current.y),
        });
    };

    const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
        setIsDragging(false);
        event.currentTarget.releasePointerCapture(event.pointerId);
    };

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        if (scale > MIN_SCALE) {
            return;
        }

        touchStartX.current = event.touches[0]?.clientX ?? null;
    };

    const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        if (scale > MIN_SCALE || touchStartX.current === null) {
            return;
        }

        const touchEndX = event.changedTouches[0]?.clientX;

        if (touchEndX === undefined) {
            return;
        }

        const delta = touchEndX - touchStartX.current;

        if (delta > 60) {
            goToPrevious();
        } else if (delta < -60) {
            goToNext();
        }

        touchStartX.current = null;
    };

    if (!open || !currentImage || typeof document === 'undefined') {
        return null;
    }

    const controlButtonClass =
        'pointer-events-auto inline-flex items-center justify-center rounded-full bg-black/50 text-white shadow-lg shadow-black/30 backdrop-blur-md transition-colors hover:bg-black/70 disabled:opacity-40';

    return createPortal(
        <div
            className="fixed inset-0 z-[200] bg-black/95"
            role="dialog"
            aria-modal="true"
            aria-label={uiText(
                'ui.components.text_3f51af0d8de0',
                "Visionneuse d'images",
            )}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    ref={imageContainerRef}
                    className={cn(
                        'flex size-full max-h-full max-w-full items-center justify-center p-4 sm:p-6',
                        scale > MIN_SCALE ? 'cursor-grab' : 'cursor-zoom-in',
                        isDragging && 'cursor-grabbing',
                    )}
                    onWheel={handleWheel}
                    onDoubleClick={handleDoubleClick}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <img
                        src={currentImage.src}
                        alt={currentImage.alt}
                        draggable={false}
                        className="max-h-[100dvh] max-w-full object-contain transition-transform duration-150 ease-out select-none"
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        }}
                    />
                </div>
            </div>

            <div className="pointer-events-none absolute inset-0 z-30 flex flex-col">
                <div className="pointer-events-none flex items-center justify-between gap-3 bg-gradient-to-b from-black/70 via-black/25 to-transparent px-4 py-3 text-white sm:px-6 sm:py-4">
                    <p className="pointer-events-auto text-sm font-medium text-white/90 drop-shadow-sm">
                        {index + 1} / {images.length}
                    </p>

                    <div className="pointer-events-auto flex items-center gap-1 sm:gap-2">
                        <button
                            type="button"
                            onClick={zoomOut}
                            disabled={scale <= MIN_SCALE}
                            className={cn(controlButtonClass, 'size-10')}
                            aria-label={uiText(
                                'ui.components.text_a1388f905238',
                                'Dézoomer',
                            )}
                        >
                            <ZoomOut className="size-5" aria-hidden />
                        </button>
                        <button
                            type="button"
                            onClick={zoomIn}
                            disabled={scale >= MAX_SCALE}
                            className={cn(controlButtonClass, 'size-10')}
                            aria-label={uiText(
                                'ui.components.text_c9c4547ae630',
                                'Zoomer',
                            )}
                        >
                            <ZoomIn className="size-5" aria-hidden />
                        </button>
                        <button
                            type="button"
                            onClick={resetTransform}
                            disabled={scale <= MIN_SCALE}
                            className={cn(controlButtonClass, 'size-10')}
                            aria-label={uiText(
                                'ui.components.text_e3eb8fab573d',
                                'Réinitialiser le zoom',
                            )}
                        >
                            <RotateCcw className="size-5" aria-hidden />
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className={cn(controlButtonClass, 'size-10')}
                            aria-label={uiText(
                                'ui.components.text_c207d22f6253',
                                'Fermer la galerie',
                            )}
                        >
                            <X className="size-5" aria-hidden />
                        </button>
                    </div>
                </div>

                <div className="relative min-h-0 flex-1">
                    {hasMultiple ? (
                        <button
                            type="button"
                            onClick={goToPrevious}
                            className={cn(
                                controlButtonClass,
                                'absolute top-1/2 left-2 size-11 -translate-y-1/2 sm:left-4 sm:size-12',
                            )}
                            aria-label={uiText(
                                'ui.components.text_fe0cc279c539',
                                'Image précédente',
                            )}
                        >
                            <ChevronLeft className="size-6" aria-hidden />
                        </button>
                    ) : null}

                    {hasMultiple ? (
                        <button
                            type="button"
                            onClick={goToNext}
                            className={cn(
                                controlButtonClass,
                                'absolute top-1/2 right-2 size-11 -translate-y-1/2 sm:right-4 sm:size-12',
                            )}
                            aria-label={uiText(
                                'ui.components.text_0611f50252d8',
                                'Image suivante',
                            )}
                        >
                            <ChevronRight className="size-6" aria-hidden />
                        </button>
                    ) : null}
                </div>

                <div className="pointer-events-none space-y-1 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pt-10 pb-5 text-center text-white sm:px-6 sm:pb-6">
                    <p className="pointer-events-auto font-heading text-base font-semibold drop-shadow-sm sm:text-lg">
                        {currentImage.alt}
                    </p>
                    {currentImage.caption ? (
                        <p className="pointer-events-auto text-sm text-white/85 drop-shadow-sm">
                            {currentImage.caption}
                        </p>
                    ) : null}
                </div>
            </div>
        </div>,
        document.body,
    );
}
