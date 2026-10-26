import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    AlertTriangle,
    ArrowLeft,
    Home,
    Lock,
    Mail,
    Phone,
    SearchX,
    Wrench,
} from 'lucide-react';
import Reveal from '@/components/marketing/reveal';
import type {
    MarketingErrorIcon,
    MarketingErrorPageConfig,
} from '@/data/marketing-error-pages';
import type { SuperSecuriteConfig } from '@/types/super-securite';
import { cn } from '@/lib/utils';

type MarketingErrorHeroProps = {
    config: MarketingErrorPageConfig;
};

type SharedPageProps = {
    superSecurite?: SuperSecuriteConfig;
};

const errorIcons: Record<MarketingErrorIcon, LucideIcon> = {
    'not-found': SearchX,
    forbidden: Lock,
    server: AlertTriangle,
    maintenance: Wrench,
};

export default function MarketingErrorHero({
    config,
}: MarketingErrorHeroProps) {
    const { t: uiText } = useUiTranslations();

    const { superSecurite } = usePage<SharedPageProps>().props;
    const Icon = errorIcons[config.icon];

    return (
        <section className="marketing-error-page relative flex min-h-[min(calc(100dvh-11rem),42rem)] items-center justify-center px-4 py-16 sm:py-20">
            <div
                className="marketing-error-page-bg absolute inset-0"
                aria-hidden
            />

            <Reveal className="relative w-full max-w-xl text-center">
                <p
                    className="font-heading text-[8.5rem] leading-none font-bold tracking-tighter text-super-securite-accent/15 select-none sm:text-[7rem]"
                    aria-hidden
                >
                    {config.status}
                </p>

                <p className="marketing-label -mt-10 mb-3 sm:-mt-12">
                    {config.hint}
                </p>

                <h1 className="font-heading text-2xl font-bold tracking-tight text-super-securite-heading uppercase sm:text-3xl">
                    {config.title}
                </h1>

                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-super-securite-muted sm:text-base">
                    {config.description}
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        href={config.primaryCta.href}
                        className="marketing-cta-primary inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm sm:w-auto"
                    >
                        <Home className="size-4" aria-hidden />
                        {config.primaryCta.label}
                    </Link>
                    <Link
                        href={config.secondaryCta.href}
                        className="marketing-cta-secondary inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm sm:w-auto"
                    >
                        <Mail className="size-4" aria-hidden />
                        {config.secondaryCta.label}
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className={cn(
                        'mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-super-securite-muted transition-colors',
                        'hover:text-super-securite-heading',
                    )}
                >
                    <ArrowLeft className="size-4" aria-hidden />
                    {uiText(
                        'ui.components.text_0301d410db18',
                        'Page précédente',
                    )}
                </button>

                {superSecurite ? (
                    <div className="mt-10 rounded-2xl border border-dashed border-super-securite-border bg-white/70 px-5 py-4 text-left sm:text-center">
                        <p className="text-xs font-semibold tracking-wide text-super-securite-heading uppercase">
                            {uiText(
                                'ui.components.text_9c451305249e',
                                'Besoin d&apos;une assistance immédiate ?',
                            )}
                        </p>
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
                            <a
                                href={superSecurite.phone_href}
                                className="inline-flex items-center gap-2 text-sm font-medium text-super-securite-heading hover:text-super-securite-accent"
                            >
                                <Phone className="size-4 text-super-securite-accent" />
                                {superSecurite.phone}
                            </a>
                            <a
                                href={`mailto:${superSecurite.email}`}
                                className="inline-flex items-center gap-2 text-sm font-medium text-super-securite-heading hover:text-super-securite-accent"
                            >
                                <Mail className="size-4 text-super-securite-accent" />
                                {superSecurite.email}
                            </a>
                        </div>
                    </div>
                ) : null}
            </Reveal>
        </section>
    );
}
