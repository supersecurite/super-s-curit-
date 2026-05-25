import { type CSSProperties, type ReactNode } from 'react';
import Reveal from '@/components/marketing/reveal';
import { cn } from '@/lib/utils';

type PageHeroProps = {
    label?: string;
    title: ReactNode;
    description?: ReactNode;
    children?: ReactNode;
    media?: ReactNode;
    className?: string;
    align?: 'left' | 'center';
};

export default function PageHero({
    label,
    title,
    description,
    children,
    media,
    className,
    align = 'left',
}: PageHeroProps) {
    return (
        <section
            className={cn(
                'marketing-grid-bg relative overflow-hidden border-b border-aristech-border',
                className,
            )}
        >
            <div
                className="marketing-blob bg-aristech-accent"
                style={
                    {
                        top: '-6rem',
                        left: '-4rem',
                        width: '24rem',
                        height: '24rem',
                        opacity: 0.15,
                    } as CSSProperties
                }
                aria-hidden
            />
            <div
                className="marketing-blob bg-sky-400"
                style={
                    {
                        bottom: '-8rem',
                        right: '-4rem',
                        width: '22rem',
                        height: '22rem',
                        opacity: 0.14,
                        animationDelay: '-6s',
                    } as CSSProperties
                }
                aria-hidden
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-aristech-bg" />

            <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
                <div
                    className={cn(
                        media
                            ? 'grid items-center gap-12 lg:grid-cols-2 lg:gap-16'
                            : align === 'center'
                              ? 'flex flex-col items-center text-center'
                              : '',
                    )}
                >
                    <div>
                        {label && (
                            <Reveal>
                                <p className="marketing-label mb-4">{label}</p>
                            </Reveal>
                        )}

                        <Reveal delay={120}>
                            <h1 className="font-heading text-4xl leading-[1.1] font-bold tracking-tight text-aristech-heading md:text-5xl lg:text-6xl">
                                {title}
                            </h1>
                        </Reveal>

                        {description && (
                            <Reveal delay={240}>
                                <p
                                    className={cn(
                                        'mt-6 max-w-2xl text-base leading-relaxed md:text-lg',
                                        align === 'center' &&
                                            !media &&
                                            'mx-auto',
                                    )}
                                >
                                    {description}
                                </p>
                            </Reveal>
                        )}

                        {children && (
                            <Reveal delay={360} className="mt-10">
                                {children}
                            </Reveal>
                        )}
                    </div>

                    {media && (
                        <Reveal delay={300} variant="fade">
                            {media}
                        </Reveal>
                    )}
                </div>
            </div>
        </section>
    );
}
