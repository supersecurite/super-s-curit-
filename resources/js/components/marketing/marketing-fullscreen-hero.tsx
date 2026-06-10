import { type ReactNode } from 'react';
import HeroTitleUnderline from '@/components/marketing/hero-title-underline';
import Reveal from '@/components/marketing/reveal';
import type { MarketingPageHeroConfig } from '@/data/marketing-page-heroes';
import { cn } from '@/lib/utils';

type MarketingFullscreenHeroProps = Pick<
    MarketingPageHeroConfig,
    | 'id'
    | 'titleLead'
    | 'titleHighlight'
    | 'titleTrail'
    | 'description'
    | 'image'
    | 'imageAlt'
    | 'stats'
    | 'underline'
> & {
    label?: string;
    className?: string;
    children?: ReactNode;
    headingLevel?: 'h1' | 'h2';
};

export default function MarketingFullscreenHero({
    id,
    label,
    titleLead,
    titleHighlight,
    titleTrail,
    description,
    image,
    imageAlt,
    stats,
    underline,
    className,
    children,
    headingLevel = 'h1',
}: MarketingFullscreenHeroProps) {
    const underlineGradientId = `fullscreen-hero-underline-${id}`;
    const Heading = headingLevel;

    return (
        <section
            className={cn(
                'marketing-hero-cinematic relative overflow-hidden',
                className,
            )}
        >
            <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1920px] items-end overflow-hidden lg:items-center">
                <img
                    src={image}
                    alt={imageAlt}
                    width={1920}
                    height={1080}
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 size-full max-w-full object-cover"
                />

                <div
                    className="marketing-hero-overlay-side pointer-events-none absolute inset-0"
                    aria-hidden
                />
                <div
                    className="marketing-hero-overlay-base pointer-events-none absolute inset-0"
                    aria-hidden
                />
                <div
                    className="absolute inset-y-0 left-0 w-1 bg-super-securite-accent sm:w-1.5"
                    aria-hidden
                />

                <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl px-4 pt-28 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:py-28">
                    <div className="max-w-2xl min-w-0">
                        {label ? (
                            <Reveal delay={80}>
                                <p className="marketing-label mb-3 flex items-center gap-2 text-white/80 before:block before:h-px before:w-6 before:bg-super-securite-accent">
                                    {label}
                                </p>
                            </Reveal>
                        ) : null}

                        <Reveal delay={120}>
                            <Heading className="font-heading text-3xl leading-[1.05] font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                                {titleLead}{' '}
                                <span className="relative inline-block text-super-securite-accent">
                                    {titleHighlight}
                                    <HeroTitleUnderline
                                        variant={underline}
                                        gradientId={underlineGradientId}
                                        tone="dark"
                                    />
                                </span>
                                {titleTrail ? (
                                    <>
                                        {' '}
                                        <span className="text-white">
                                            {titleTrail}
                                        </span>
                                    </>
                                ) : null}
                            </Heading>
                        </Reveal>

                        <Reveal delay={260} className="mt-5 max-w-xl sm:mt-6">
                            <p className="text-sm leading-relaxed text-white/85 sm:text-base md:text-lg">
                                {description}
                            </p>
                        </Reveal>

                        {stats && stats.length > 0 ? (
                            <Reveal
                                as="dl"
                                delay={400}
                                className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:mt-10 sm:max-w-none sm:grid-cols-3 sm:gap-4"
                            >
                                {stats.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="min-w-0 rounded-xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-4"
                                    >
                                        <dt className="text-[10px] text-white/65 sm:text-xs">
                                            {stat.label}
                                        </dt>
                                        <dd className="mt-1 font-heading text-xs font-semibold break-words text-white sm:text-sm">
                                            {stat.value}
                                        </dd>
                                    </div>
                                ))}
                            </Reveal>
                        ) : null}

                        {children ? (
                            <Reveal delay={480} className="mt-8">
                                {children}
                            </Reveal>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}
