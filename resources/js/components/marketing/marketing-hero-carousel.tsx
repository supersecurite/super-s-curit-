import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import MarketingHeroSlide from '@/components/marketing/marketing-hero-slide';
import { useMarketingHeroSlides } from '@/hooks/use-marketing-hero-slides';
import { useTrans } from '@/hooks/use-trans';
import { cn } from '@/lib/utils';

const AUTO_PLAY_MS = 7000;

export default function MarketingHeroCarousel() {
    const { slides, labels, carouselAria } = useMarketingHeroSlides();
    const { t } = useTrans();
    const slideCount = slides.length;
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const goTo = useCallback(
        (index: number) => {
            setActiveIndex((index + slideCount) % slideCount);
        },
        [slideCount],
    );

    const goNext = useCallback(() => {
        goTo(activeIndex + 1);
    }, [activeIndex, goTo]);

    const goPrevious = useCallback(() => {
        goTo(activeIndex - 1);
    }, [activeIndex, goTo]);

    useEffect(() => {
        if (isPaused) {
            return;
        }

        const timer = window.setInterval(goNext, AUTO_PLAY_MS);

        return () => window.clearInterval(timer);
    }, [goNext, isPaused]);

    return (
        <section
            className="marketing-hero-viewport relative min-h-0"
            aria-roledescription="carousel"
            aria-label={carouselAria}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={activeIndex}
                    className="h-full min-h-0 overflow-x-clip"
                    initial={{ opacity: 0, x: 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -28 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                    <MarketingHeroSlide variant={slides[activeIndex]} />
                </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex items-center justify-center px-4 sm:bottom-6">
                <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-super-securite-border/80 bg-super-securite-surface/90 px-3 py-2 shadow-lg shadow-slate-900/10 backdrop-blur-md">
                    <button
                        type="button"
                        onClick={goPrevious}
                        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-super-securite-heading transition-colors duration-200 hover:bg-super-securite-bg focus-visible:ring-2 focus-visible:ring-super-securite-accent focus-visible:outline-none"
                        aria-label={t('common.prev_slide', 'Slide précédente')}
                    >
                        <ChevronLeft className="size-4" aria-hidden />
                    </button>

                    <div
                        className="flex items-center gap-1.5 px-1"
                        role="tablist"
                        aria-label={t('common.slide_selection', 'Sélection de slide')}
                    >
                        {labels.map((label, index) => {
                            const isActive = index === activeIndex;

                            return (
                                <button
                                    key={`${label}-${index}`}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    aria-label={`${label} — slide ${index + 1}`}
                                    onClick={() => goTo(index)}
                                    className={cn(
                                        'cursor-pointer rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-super-securite-accent focus-visible:outline-none',
                                        isActive
                                            ? 'h-2.5 w-8 bg-super-securite-accent'
                                            : 'size-2.5 bg-super-securite-border hover:bg-super-securite-muted/50',
                                    )}
                                />
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={goNext}
                        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-super-securite-heading transition-colors duration-200 hover:bg-super-securite-bg focus-visible:ring-2 focus-visible:ring-super-securite-accent focus-visible:outline-none"
                        aria-label={t('common.next_slide', 'Slide suivante')}
                    >
                        <ChevronRight className="size-4" aria-hidden />
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsPaused((paused) => !paused)}
                        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-super-securite-muted transition-colors duration-200 hover:bg-super-securite-bg hover:text-super-securite-heading focus-visible:ring-2 focus-visible:ring-super-securite-accent focus-visible:outline-none"
                        aria-label={
                            isPaused
                                ? t('common.resume_autoplay', 'Reprendre le défilement automatique')
                                : t('common.pause_autoplay', 'Mettre en pause le défilement automatique')
                        }
                        aria-pressed={isPaused}
                    >
                        {isPaused ? (
                            <Play className="size-3.5" aria-hidden />
                        ) : (
                            <Pause className="size-3.5" aria-hidden />
                        )}
                    </button>
                </div>
            </div>

            <p className="sr-only" aria-live="polite">
                Slide {activeIndex + 1} / {slideCount} : {labels[activeIndex]}
            </p>
        </section>
    );
}
