import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/marketing/reveal';
import { superSecuriteImages } from '@/data/super-securite-images';
import type { MarketingHeroVariant } from '@/data/marketing-hero-variants';
import { cn } from '@/lib/utils';

type MarketingHeroSlideProps = {
    variant: MarketingHeroVariant;
};

function HeroHeading({ variant }: { variant: MarketingHeroVariant }) {
    const underlineGradientId = `hero-underline-${variant.id}`;

    switch (variant.typography) {
        case 'gradient':
            return (
                <h2 className="font-heading text-3xl leading-[1.08] font-bold tracking-tight text-super-securite-heading sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                    {variant.title}{' '}
                    <span className="marketing-text-gradient block sm:inline">
                        {variant.highlight}
                    </span>
                </h2>
            );

        case 'accent-block':
            return (
                <h2 className="font-heading text-3xl leading-[1.12] font-bold tracking-tight text-super-securite-heading sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                    {variant.title}{' '}
                    <span className="inline-block border-l-4 border-super-securite-accent pl-3 font-bold text-super-securite-accent">
                        {variant.highlight}
                    </span>
                </h2>
            );

        case 'split-lines':
            return (
                <div className="space-y-1 sm:space-y-2">
                    <p className="font-heading text-xs font-semibold tracking-[0.3em] text-super-securite-muted uppercase sm:text-sm">
                        {variant.title}
                    </p>
                    <h2 className="font-heading text-4xl leading-[0.95] font-bold tracking-tight text-super-securite-heading sm:text-5xl md:text-6xl">
                        <span className="text-super-securite-accent">
                            {variant.highlight}
                        </span>
                    </h2>
                </div>
            );

        case 'underline':
        default:
            return (
                <h2 className="font-heading text-3xl leading-[1.05] font-bold tracking-tight text-super-securite-heading sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                    {variant.title}{' '}
                    <span className="relative inline-block">
                        {variant.highlight}
                        <svg
                            viewBox="0 0 380 22"
                            className="marketing-underline-draw absolute -bottom-4 left-0 w-full sm:-bottom-5"
                            fill="none"
                            preserveAspectRatio="none"
                            aria-hidden
                        >
                            <path
                                d="M2 16 C 100 1, 280 1, 378 16"
                                stroke={`url(#${underlineGradientId})`}
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient
                                    id={underlineGradientId}
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="0"
                                >
                                    <stop
                                        offset="0"
                                        stopColor="var(--super-securite-accent)"
                                    />
                                    <stop offset="1" stopColor="#0f172a" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </span>
                </h2>
            );
    }
}

function HeroCopy({ variant }: { variant: MarketingHeroVariant }) {
    return (
        <>
            <Reveal delay={80}>
                <p className="marketing-label mb-2 sm:mb-3">{variant.label}</p>
            </Reveal>

            <Reveal delay={120}>
                <HeroHeading variant={variant} />
            </Reveal>

            <Reveal delay={260} className="mt-4 max-w-xl sm:mt-5">
                <p className="text-sm leading-relaxed sm:text-base">
                    {variant.description}
                </p>
            </Reveal>

            <Reveal
                delay={400}
                className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6"
            >
                {variant.primaryCta.href.startsWith('/') ? (
                    <Link
                        href={variant.primaryCta.href}
                        className="marketing-cta-primary marketing-magnetic group inline-flex items-center gap-2 px-6 py-3 text-sm"
                    >
                        {variant.primaryCta.label}
                        <ArrowRight
                            className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                            aria-hidden
                        />
                    </Link>
                ) : (
                    <a
                        href={variant.primaryCta.href}
                        className="marketing-cta-primary marketing-magnetic group inline-flex items-center gap-2 px-6 py-3 text-sm"
                    >
                        {variant.primaryCta.label}
                        <ArrowRight
                            className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                            aria-hidden
                        />
                    </a>
                )}
                <a
                    href={variant.secondaryCta.href}
                    className="marketing-cta-secondary marketing-magnetic px-6 py-3 text-sm"
                >
                    {variant.secondaryCta.label}
                </a>
            </Reveal>

            <Reveal
                as="dl"
                delay={560}
                className="mt-6 grid grid-cols-3 gap-2 sm:mt-7 sm:gap-3"
            >
                {variant.stats.map((stat) => (
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
        </>
    );
}

function HeroImage({
    variant,
    className,
    imageClassName,
    framed = true,
    badge = true,
    accentEdge = false,
}: {
    variant: MarketingHeroVariant;
    className?: string;
    imageClassName?: string;
    framed?: boolean;
    badge?: boolean;
    accentEdge?: boolean;
}) {
    return (
        <Reveal delay={300} variant="fade" className={className}>
            <div
                className={cn(
                    'relative mx-auto w-full',
                    framed ? 'max-w-md' : 'h-full max-w-none',
                )}
            >
                <div
                    className={cn(
                        'overflow-hidden shadow-xl shadow-slate-900/10',
                        framed &&
                            'rounded-3xl border border-super-securite-border',
                        !framed &&
                            'h-full rounded-2xl border border-super-securite-border lg:rounded-none lg:border-y-0 lg:border-r-0',
                        accentEdge &&
                            'ring-4 ring-super-securite-accent/15 lg:rounded-l-none lg:border-l-4 lg:border-l-super-securite-accent',
                    )}
                >
                    <img
                        src={variant.image}
                        alt={variant.imageAlt}
                        width={640}
                        height={640}
                        loading={variant.id === 'excellence' ? 'eager' : 'lazy'}
                        decoding="async"
                        fetchPriority={
                            variant.id === 'excellence' ? 'high' : undefined
                        }
                        className={cn(
                            'w-full object-cover',
                            framed && 'aspect-[4/5] max-h-[42vh] sm:aspect-square sm:max-h-none',
                            !framed && 'h-full min-h-[200px] lg:min-h-0',
                            imageClassName,
                        )}
                    />
                </div>
            </div>
        </Reveal>
    );
}

function SlideBackground({ variant }: { variant: MarketingHeroVariant }) {
    return (
        <>
            <div
                className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.14]"
                style={{ backgroundImage: `url(${variant.backgroundImage})` }}
                aria-hidden
            />
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="marketing-blob bg-super-securite-accent"
                    style={{
                        top: '-6rem',
                        left: '-4rem',
                        width: '28rem',
                        height: '28rem',
                        opacity: 0.12,
                    }}
                    aria-hidden
                />
                <div
                    className="marketing-blob bg-slate-600"
                    style={{
                        top: '20%',
                        right: '-6rem',
                        width: '24rem',
                        height: '24rem',
                        opacity: 0.1,
                        animationDelay: '-6s',
                        ['--blob-duration' as string]: '22s',
                    }}
                    aria-hidden
                />
            </div>
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-super-securite-bg/80" />
        </>
    );
}

function SplitLayout({
    variant,
    imagePosition,
}: {
    variant: MarketingHeroVariant;
    imagePosition: 'left' | 'right';
}) {
    const imageFirst = imagePosition === 'left';

    return (
        <div className="relative mx-auto grid h-full min-h-0 w-full max-w-7xl grid-cols-1 content-center gap-5 px-4 pt-2 pb-14 sm:gap-6 sm:px-6 sm:pb-16 lg:grid-cols-12 lg:items-center lg:gap-8 lg:pb-14 xl:gap-12">
            <div
                className={cn(
                    'flex min-h-0 flex-col justify-center lg:col-span-6 xl:col-span-7',
                    imageFirst ? 'lg:order-2' : 'lg:order-1',
                )}
            >
                <HeroCopy variant={variant} />
            </div>

            <HeroImage
                variant={variant}
                framed
                badge
                accentEdge={imagePosition === 'left'}
                className={cn(
                    'lg:col-span-6 xl:col-span-5',
                    imageFirst ? 'lg:order-1' : 'lg:order-2',
                )}
                imageClassName="lg:max-h-[min(68vh,calc(100dvh-var(--marketing-header-offset,5.5rem)-8rem))]"
            />
        </div>
    );
}

function SlideContent({ variant }: { variant: MarketingHeroVariant }) {
    const imagePosition =
        variant.layout === 'split-left' ? 'left' : 'right';

    return (
        <SplitLayout variant={variant} imagePosition={imagePosition} />
    );
}

export default function MarketingHeroSlide({
    variant,
}: MarketingHeroSlideProps) {
    return (
        <section className="marketing-grid-bg relative h-full min-h-0 max-h-full">
            <SlideBackground variant={variant} />
            <div className="relative h-full min-h-0">
                <SlideContent variant={variant} />
            </div>
        </section>
    );
}
