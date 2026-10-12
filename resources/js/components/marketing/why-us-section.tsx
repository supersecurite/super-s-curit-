import { superSecuriteAdvantages } from '@/data/super-securite-content';
import { superSecuriteStock } from '@/data/super-securite-stock';
import { Link } from '@inertiajs/react';
import { ArrowRight, Check } from 'lucide-react';
import Reveal from '@/components/marketing/reveal';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';
import { useWhyUsContent } from '@/hooks/use-why-us-content';
import { cn } from '@/lib/utils';

type WhyUsSectionProps = {
    showCinematicHero?: boolean;
    showAppFeatures?: boolean;
    showAppSection?: boolean;
};

type WhyUsTone = 'light' | 'dark';

function WhyUsReasonsList({ variant = 'light' }: { variant?: WhyUsTone }) {
    const isDark = variant === 'dark';
    const whyUs = useWhyUsContent();
    const localized = useLocalizedUrl();

    return (
        <ol className="mt-6 space-y-3">
            {whyUs.reasons.map((reason, index) => {
                const anchor = whyUs.details[index]?.id;

                return (
                    <li key={reason}>
                        <Link
                            href={
                                anchor
                                    ? `${localized('/a-propos')}#${anchor}`
                                    : localized('/a-propos')
                            }
                            className={cn(
                                'group flex gap-3 text-sm leading-relaxed transition-colors duration-200 md:text-base',
                                isDark
                                    ? 'text-white/85 hover:text-white'
                                    : 'text-super-securite-heading hover:text-super-securite-accent',
                            )}
                        >
                            <span
                                className={cn(
                                    'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full font-heading text-xs font-bold',
                                    isDark
                                        ? 'bg-white/15 text-white'
                                        : 'bg-super-securite-accent/10 text-super-securite-accent',
                                )}
                            >
                                {index + 1}
                            </span>
                            <span className="underline-offset-2 group-hover:underline">
                                {reason}
                            </span>
                        </Link>
                    </li>
                );
            })}
        </ol>
    );
}

function WhyUsAppFeatures({ variant = 'light' }: { variant?: WhyUsTone }) {
    const isDark = variant === 'dark';
    const whyUs = useWhyUsContent();
    const localized = useLocalizedUrl();

    return (
        <>
            <p
                className={
                    isDark
                        ? 'text-sm font-medium text-white/90 md:text-base'
                        : 'text-sm font-medium text-super-securite-heading md:text-base'
                }
            >
                {whyUs.appLead}
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {whyUs.appFeatures.map((feature) => (
                    <li key={feature.label}>
                        <Link
                            href={`${localized('/a-propos')}#${feature.anchor}`}
                            className={cn(
                                'group flex h-full items-center gap-3 rounded-xl border px-4 py-3.5 text-sm leading-snug transition-colors duration-200 md:text-base',
                                isDark
                                    ? 'border-white/20 bg-white/5 text-white/90 hover:border-white/35 hover:bg-white/10'
                                    : 'border-super-securite-accent/25 bg-super-securite-accent/5 text-super-securite-heading hover:border-super-securite-accent/45 hover:bg-super-securite-accent/10',
                            )}
                        >
                            <span
                                className={cn(
                                    'flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-sm',
                                    isDark
                                        ? 'border-white/20 bg-white/10'
                                        : 'border-super-securite-accent/20 bg-white',
                                )}
                            >
                                <Check
                                    className="size-4 text-super-securite-accent"
                                    strokeWidth={2.5}
                                    aria-hidden
                                />
                            </span>
                            <span className="min-w-0 flex-1 font-medium">
                                {feature.label}
                            </span>
                            <ArrowRight
                                className={cn(
                                    'size-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none',
                                    isDark
                                        ? 'text-white/50 group-hover:translate-x-0.5 group-hover:text-white'
                                        : 'text-super-securite-accent/50 group-hover:translate-x-0.5 group-hover:text-super-securite-accent',
                                )}
                                aria-hidden
                            />
                        </Link>
                    </li>
                ))}
            </ul>
            <p
                className={cn(
                    'mt-6 text-sm leading-relaxed font-medium md:text-base',
                    isDark ? 'text-white/90' : 'text-super-securite-heading',
                )}
            >
                {whyUs.conclusion}
            </p>
        </>
    );
}

function WhyUsAboutButton({ variant = 'light' }: { variant?: WhyUsTone }) {
    const { t } = useTrans();
    const localized = useLocalizedUrl();

    return (
        <Link
            href={localized('/a-propos')}
            className={cn(
                'marketing-magnetic mt-8 inline-flex items-center gap-2',
                variant === 'dark'
                    ? 'marketing-cta-primary px-6 py-3 text-sm'
                    : 'marketing-cta-secondary',
            )}
        >
            {t('common.discover', 'Découvrez')}
            <ArrowRight className="size-4" aria-hidden />
        </Link>
    );
}

function WhyUsMobileAppImage({ className }: { className?: string }) {
    return (
        <div className={cn('mx-auto max-w-sm', className)}>
            <img
                src={superSecuriteStock.about.mobileApp}
                alt="Application mobile Super Sécurité — suivi en temps réel"
                width={480}
                height={640}
                loading="lazy"
                decoding="async"
                className="w-full object-contain"
            />
        </div>
    );
}

export default function WhyUsSection({
    showCinematicHero = true,
    showAppFeatures = false,
    showAppSection = false,
}: WhyUsSectionProps) {
    const { t, tNode } = useTrans();
    const whyUs = useWhyUsContent();
    const advantagesItems = tNode<
        Array<{ title?: string; description?: string }>
    >('home.advantages_items', []);

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
                        src={superSecuriteStock.home.whyUsBannerTransparent2}
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

                    <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl px-4 pt-[calc(var(--marketing-header-height,5.5rem)+3.5rem)] pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:py-28">
                        <div className="max-w-2xl min-w-0">
                            <Reveal delay={80}>
                                <p className="marketing-label mb-3 flex items-center gap-2 before:block before:h-px before:w-6 before:bg-super-securite-accent">
                                    {whyUs.sectionLabel}
                                </p>
                            </Reveal>

                            <Reveal delay={120}>
                                <h2 className="font-heading text-3xl leading-[1.05] font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                                    {whyUs.title}
                                </h2>
                            </Reveal>

                            <Reveal delay={260} className="mt-5 max-w-xl sm:mt-6">
                                <p className="text-sm leading-relaxed text-white/85 sm:text-base md:text-lg">
                                    {whyUs.intro}
                                </p>
                            </Reveal>

                            <Reveal delay={400} className="mt-6 max-w-xl sm:mt-8">
                                <WhyUsReasonsList variant="dark" />
                                <WhyUsAboutButton variant="dark" />
                            </Reveal>
                        </div>
                    </div>
                </div>
            ) : null}

            <div
                className={
                    showCinematicHero ? 'bg-white py-16 md:py-24' : 'py-16 md:py-24'
                }
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {!showCinematicHero ? (
                        <Reveal delay={80} className="mx-auto mb-12 max-w-3xl md:mb-16">
                            <p className="marketing-label mb-3">
                                {whyUs.sectionLabel}
                            </p>
                            <h2 className="font-heading text-2xl font-bold tracking-tight text-super-securite-heading sm:text-3xl">
                                {whyUs.title}
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed md:text-base">
                                {whyUs.intro}
                            </p>
                            <WhyUsReasonsList />
                        </Reveal>
                    ) : null}

                    {showAppSection ? (
                        <Reveal
                            delay={showCinematicHero ? 80 : 120}
                            className="mb-12 md:mb-16"
                        >
                            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                                <WhyUsMobileAppImage className="lg:justify-self-center" />
                                <div>
                                    {showAppFeatures ? (
                                        <>
                                            <p className="marketing-label mb-3">
                                                {t('home.innovation_label', 'Innovation')}
                                            </p>
                                            <h3 className="font-heading text-2xl font-bold tracking-tight text-super-securite-heading sm:text-3xl">
                                                {whyUs.appSectionTitle}
                                            </h3>
                                            <div className="mt-6">
                                                <WhyUsAppFeatures />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="marketing-label mb-3">
                                                {t('home.innovation_label', 'Innovation')}
                                            </p>
                                            <h3 className="font-heading text-2xl font-bold tracking-tight text-super-securite-heading sm:text-3xl">
                                                {whyUs.appSectionTitle}
                                            </h3>
                                            <p className="mt-4 text-sm leading-relaxed text-super-securite-muted md:text-base">
                                                {t(
                                                    'home.app_teaser',
                                                    'Suivez vos sites, signalez un incident et échangez avec nos équipes depuis votre smartphone. Découvrez toutes les fonctionnalités sur notre page dédiée.',
                                                )}
                                            </p>
                                            <WhyUsAboutButton />
                                        </>
                                    )}
                                </div>
                            </div>
                        </Reveal>
                    ) : null}

                    <Reveal
                        delay={80}
                        className="mx-auto mb-10 max-w-2xl text-center md:mb-14"
                    >
                        <p className="marketing-label mb-2">{t('home.advantages_label', 'Nos atouts')}</p>
                        <h3 className="font-heading text-2xl font-bold tracking-tight text-super-securite-heading sm:text-3xl">
                            {t('home.advantages_title', 'Ce qui nous distingue')}
                        </h3>
                    </Reveal>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {superSecuriteAdvantages.map((item, index) => {
                            const Icon = item.icon;
                            const copy = advantagesItems[index];
                            const title = copy?.title ?? item.title;
                            const description =
                                copy?.description ?? item.description;

                            return (
                                <Reveal key={item.title} delay={index * 100}>
                                    <article className="marketing-card-interactive flex h-full flex-col p-6 text-center md:p-8">
                                        <div className="mx-auto mb-5 inline-flex size-14 items-center justify-center rounded-full p-0">
                                            <Icon
                                                className="size-6 text-super-securite-accent"
                                                strokeWidth={1.8}
                                                aria-hidden
                                            />
                                        </div>
                                        <h3 className="font-heading text-lg font-semibold text-super-securite-heading">
                                            {title}
                                        </h3>
                                        <p className="mt-3 flex-1 text-sm leading-relaxed">
                                            {description}
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
