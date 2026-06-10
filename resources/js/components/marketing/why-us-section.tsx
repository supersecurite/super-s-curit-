import {
    superSecuriteAdvantages,
    superSecuriteWhyUsModern,
} from '@/data/super-securite-content';
import { superSecuriteStock } from '@/data/super-securite-stock';
import { Link } from '@inertiajs/react';
import { ArrowRight, Check } from 'lucide-react';
import Reveal from '@/components/marketing/reveal';
import { about } from '@/routes';
import { cn } from '@/lib/utils';

type WhyUsSectionProps = {
    showCinematicHero?: boolean;
};

type WhyUsAppFeaturesProps = {
    variant?: 'light' | 'dark';
};

function WhyUsAppFeatures({ variant = 'light' }: WhyUsAppFeaturesProps) {
    const isDark = variant === 'dark';

    return (
        <>
            <p
                className={
                    isDark
                        ? 'mt-6 text-sm font-medium text-white/90 md:text-base'
                        : 'mt-6 text-sm font-medium text-super-securite-heading md:text-base'
                }
            >
                {superSecuriteWhyUsModern.appLead}
            </p>
            <ul className="mt-4 space-y-3">
                {superSecuriteWhyUsModern.appFeatures.map((feature) => (
                    <li
                        key={feature}
                        className={
                            isDark
                                ? 'flex gap-3 text-sm leading-relaxed text-white/85 md:text-base'
                                : 'flex gap-3 text-sm leading-relaxed md:text-base'
                        }
                    >
                        <span
                            className={
                                isDark
                                    ? 'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/15'
                                    : 'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-super-securite-accent/10'
                            }
                        >
                            <Check
                                className="size-3 text-super-securite-accent"
                                strokeWidth={2.5}
                                aria-hidden
                            />
                        </span>
                        {feature}
                    </li>
                ))}
            </ul>
            <p
                className={
                    isDark
                        ? 'mt-6 text-sm leading-relaxed font-medium text-white/90 md:text-base'
                        : 'mt-6 text-sm leading-relaxed font-medium text-super-securite-heading md:text-base'
                }
            >
                {superSecuriteWhyUsModern.conclusion}
            </p>
        </>
    );
}

function WhyUsAboutButton({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
    return (
        <Link
            href={about.url()}
            className={cn(
                'marketing-magnetic mt-8 inline-flex items-center gap-2',
                variant === 'dark'
                    ? 'marketing-cta-primary px-6 py-3 text-sm'
                    : 'marketing-cta-secondary',
            )}
        >
            Découvrez
            <ArrowRight className="size-4" aria-hidden />
        </Link>
    );
}

export default function WhyUsSection({
    showCinematicHero = true,
}: WhyUsSectionProps) {
    return (
        <section
            id="pourquoi"
            className={
                showCinematicHero
                    ? 'marketing-hero-cinematic relative overflow-hidden'
                    : 'bg-white'
            }
        >
            {showCinematicHero ? (
                <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1920px] items-end overflow-hidden lg:items-center">
                    <img
                        src={superSecuriteStock.home.whyUsBannerTransparent}
                        alt="Super Sécurité — équipes et sites sécurisés"
                        width={1920}
                        height={1080}
                        loading="lazy"
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
                            <Reveal delay={80}>
                                <p className="marketing-label mb-3 flex items-center gap-2 text-white/80 before:block before:h-px before:w-6 before:bg-super-securite-accent">
                                    {superSecuriteWhyUsModern.sectionLabel}
                                </p>
                            </Reveal>

                            <Reveal delay={120}>
                                <h2 className="font-heading text-3xl leading-[1.05] font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                                    {superSecuriteWhyUsModern.title}
                                </h2>
                            </Reveal>

                            <Reveal delay={260} className="mt-5 max-w-xl sm:mt-6">
                                <p className="text-sm leading-relaxed text-white/85 sm:text-base md:text-lg">
                                    {superSecuriteWhyUsModern.intro}
                                </p>
                            </Reveal>

                            <Reveal delay={400} className="mt-6 max-w-xl sm:mt-8">
                                <WhyUsAppFeatures variant="dark" />
                                <WhyUsAboutButton variant="dark" />
                            </Reveal>
                        </div>
                    </div>
                </div>
            ) : null}

            <div
                className={
                    showCinematicHero ? 'bg-white py-12 md:py-16' : 'py-12 md:py-16'
                }
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {!showCinematicHero ? (
                        <Reveal delay={80} className="mx-auto mb-12 max-w-3xl md:mb-16">
                            <p className="marketing-label mb-3">
                                {superSecuriteWhyUsModern.sectionLabel}
                            </p>
                            <h2 className="font-heading text-2xl font-bold tracking-tight text-super-securite-heading sm:text-3xl">
                                {superSecuriteWhyUsModern.title}
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed md:text-base">
                                {superSecuriteWhyUsModern.intro}
                            </p>
                            <WhyUsAppFeatures />
                            <WhyUsAboutButton />
                        </Reveal>
                    ) : null}

                    <Reveal
                        delay={80}
                        className="mx-auto mb-10 max-w-2xl text-center md:mb-14"
                    >
                        <p className="marketing-label mb-2">Nos atouts</p>
                        <h3 className="font-heading text-2xl font-bold tracking-tight text-super-securite-heading sm:text-3xl">
                            Ce qui nous distingue
                        </h3>
                    </Reveal>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {superSecuriteAdvantages.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <Reveal key={item.title} delay={index * 100}>
                                    <article className="marketing-card-interactive flex h-full flex-col p-6 text-center md:p-8">
                                        <div className="mx-auto mb-5 inline-flex size-14 items-center justify-center rounded-full border border-super-securite-accent/20 bg-super-securite-accent/10">
                                            <Icon
                                                className="size-6 text-super-securite-accent"
                                                strokeWidth={1.8}
                                                aria-hidden
                                            />
                                        </div>
                                        <h3 className="font-heading text-lg font-semibold text-super-securite-heading">
                                            {item.title}
                                        </h3>
                                        <p className="mt-3 flex-1 text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </article>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
