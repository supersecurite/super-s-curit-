import { type ReactNode } from 'react';
import Reveal from '@/components/marketing/reveal';
import type { MarketingPageHeroConfig } from '@/data/marketing-page-heroes';
import { cn } from '@/lib/utils';

type MarketingSplitHeroProps = MarketingPageHeroConfig & {
    className?: string;
    children?: ReactNode;
};

export default function MarketingSplitHero({
    id,
    pattern,
    layout,
    label,
    titleLead,
    titleHighlight,
    titleTrail,
    description,
    image,
    imageAlt,
    stats,
    className,
    children,
}: MarketingSplitHeroProps) {
    const isReverse = layout === 'reverse';

    const textColumn = (
        <div
            className={cn(
                'lg:col-span-6 xl:col-span-7',
                isReverse ? 'lg:order-2' : 'lg:order-1',
            )}
        >
            <Reveal delay={80}>
                <p className="marketing-label mb-2 flex items-center gap-2 sm:mb-3 before:block before:h-px before:w-6 before:bg-super-securite-accent">
                    {label}
                </p>
            </Reveal>

            <Reveal delay={120}>
                <h1 className="font-heading text-3xl leading-[1.05] font-bold tracking-tight text-super-securite-heading sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                    {titleLead}{' '}
                    <span className="text-super-securite-accent">
                        {titleHighlight}
                    </span>
                    {titleTrail ? (
                        <>
                            {' '}
                            {titleTrail}
                        </>
                    ) : null}
                </h1>
            </Reveal>

            <Reveal delay={260} className="mt-4 max-w-xl sm:mt-5">
                <p className="text-sm leading-relaxed sm:text-base md:text-lg">
                    {description}
                </p>
            </Reveal>

            {stats && stats.length > 0 ? (
                <Reveal
                    as="dl"
                    delay={400}
                    className="mt-6 grid grid-cols-3 gap-2 sm:mt-7 sm:gap-3"
                >
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <dt className="text-[10px] text-super-securite-muted sm:text-xs">
                                {stat.label}
                            </dt>
                            <dd className="mt-0.5 font-heading text-xs font-semibold text-super-securite-heading sm:text-sm">
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
    );

    const imageColumn = (
        <Reveal
            delay={300}
            variant="fade"
            className={cn(
                'flex w-full justify-center lg:col-span-6 xl:col-span-5',
                isReverse
                    ? 'lg:order-1 lg:justify-start'
                    : 'lg:order-2 lg:justify-end',
            )}
        >
            <div className="relative w-full max-w-md lg:max-w-none">
                <div className="overflow-hidden rounded-3xl">
                    <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[5/4]">
                        <img
                            src={image}
                            alt={imageAlt}
                            width={900}
                            height={720}
                            fetchPriority="high"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </Reveal>
    );

    return (
        <section
            className={cn(
                'relative overflow-hidden border-b border-super-securite-border bg-white',
                isReverse && 'marketing-split-hero-reverse',
                className,
            )}
        >
            <div
                className={cn(
                    'marketing-hero-pattern absolute inset-0',
                    `marketing-hero-pattern-${pattern}`,
                )}
                aria-hidden
            />

            <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-14 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24 min-h-[min(60vh,calc(100dvh-var(--marketing-header-height,5.5rem)-2rem))] md:min-h-[60vh]">
                <div className="grid grid-cols-1 content-center gap-10 lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-16">
                    {textColumn}
                    {imageColumn}
                </div>
            </div>
        </section>
    );
}
