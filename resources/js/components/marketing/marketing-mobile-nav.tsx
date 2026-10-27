import MarketingLanguageSelect from '@/components/marketing/marketing-language-select';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronDown,
    Mail,
    MapPin,
    Menu,
    Phone,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { superSecuriteImages } from '@/data/super-securite-images';
import {
    useMarketingPrimaryNavLinks,
    useMarketingServiceNavLinks,
} from '@/data/marketing-nav';
import {
    isMarketingNavActive,
    isMarketingServicesNavActive,
} from '@/lib/marketing-nav-active';
import { cn } from '@/lib/utils';
import { useTrans } from '@/hooks/use-trans';
import { localizePath } from '@/lib/locale-url';
import { index as devenirAgentIndex } from '@/routes/devenir-agent';
import { home } from '@/routes';
import type { SuperSecuriteConfig } from '@/types/super-securite';

type MarketingMobileNavProps = {
    desktopBreakpoint?: 'md' | 'xl';
    pathname: string;
    superSecurite: SuperSecuriteConfig;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function MarketingMobileNav({
    desktopBreakpoint = 'md',
    pathname,
    superSecurite,
    open,
    onOpenChange,
}: MarketingMobileNavProps) {
    const close = () => onOpenChange(false);
    const { t, locale } = useTrans();
    const lp = (path: string) => localizePath(path, locale);
    const servicesActive = isMarketingServicesNavActive(pathname);
    const [servicesOpen, setServicesOpen] = useState(servicesActive);
    const scrollRef = useRef<HTMLDivElement>(null);
    const servicesSectionRef = useRef<HTMLLIElement>(null);
    const primaryNavLinks = useMarketingPrimaryNavLinks();
    const serviceNavLinks = useMarketingServiceNavLinks();
    const otherPrimaryLinks = primaryNavLinks.slice(1);
    const homeHref = lp(home.url());

    useEffect(() => {
        if (servicesActive) {
            setServicesOpen(true);
        }
    }, [servicesActive, pathname]);

    useEffect(() => {
        if (!open) {
            setServicesOpen(servicesActive);
        }
    }, [open, servicesActive]);

    useEffect(() => {
        if (!servicesOpen || !open) {
            return;
        }

        let timeoutId: number | undefined;

        const frame = window.requestAnimationFrame(() => {
            timeoutId = window.setTimeout(() => {
                servicesSectionRef.current?.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth',
                });
            }, 120);
        });

        return () => {
            window.cancelAnimationFrame(frame);

            if (timeoutId !== undefined) {
                window.clearTimeout(timeoutId);
            }
        };
    }, [servicesOpen, open]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        'inline-flex size-14 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:bg-super-securite-accent hover:text-white hover:shadow-lg hover:shadow-super-securite-accent/30 focus-visible:ring-2 focus-visible:ring-super-securite-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
                        desktopBreakpoint === 'xl' ? 'xl:hidden' : 'md:hidden',
                    )}
                    aria-label={t('nav.open_menu')}
                >
                    <Menu className="size-6" aria-hidden />
                </button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="z-[60] flex h-full w-full max-w-none flex-col gap-0 overflow-hidden border-0 bg-super-securite-surface p-0 sm:max-w-sm [&>button]:hidden"
            >
                <SheetTitle className="sr-only">
                    {t('nav.mobile_title')}
                </SheetTitle>

                <div className="relative shrink-0 overflow-hidden bg-black px-5 pt-5 pb-6">
                    <div
                        className="pointer-events-none absolute -top-10 -right-8 size-40 rounded-full bg-white/5 blur-2xl"
                        aria-hidden
                    />
                    <div
                        className="pointer-events-none absolute -bottom-12 left-1/3 size-32 rounded-full bg-super-securite-accent/30 blur-3xl"
                        aria-hidden
                    />

                    <div className="relative mx-auto flex items-start justify-between gap-4">
                        <Link
                            href={homeHref}
                            onClick={close}
                            className="flex min-w-0 flex-col gap-1 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
                        >
                            <img
                                src={superSecuriteImages.brandBlackTransparent}
                                alt="Super Sécurité"
                                className="h-12 w-auto max-w-[200px] object-contain object-left"
                                width={200}
                                height={36}
                            />
                        </Link>

                        <SheetClose asChild>
                            <button
                                type="button"
                                className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
                                aria-label={t('nav.close_menu')}
                            >
                                <X className="size-5" aria-hidden />
                            </button>
                        </SheetClose>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
                >
                    <nav
                        className="px-5 py-6"
                        aria-label={t('nav.mobile_label')}
                    >
                        <p className="marketing-label mb-3">
                            {t('nav.navigation')}
                        </p>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href={homeHref}
                                    onClick={close}
                                    aria-current={
                                        isMarketingNavActive(homeHref, pathname)
                                            ? 'page'
                                            : undefined
                                    }
                                    className={cn(
                                        'flex items-center justify-between rounded-2xl border px-4 py-3.5 font-heading text-base font-semibold transition-colors duration-200',
                                        isMarketingNavActive(homeHref, pathname)
                                            ? 'border-super-securite-accent/30 bg-super-securite-accent/10 text-super-securite-accent'
                                            : 'border-super-securite-border bg-white text-super-securite-heading hover:border-super-securite-accent/30',
                                    )}
                                >
                                    {t('nav.home')}
                                    <ArrowRight
                                        className="size-4 opacity-50"
                                        aria-hidden
                                    />
                                </Link>
                            </li>

                            <li ref={servicesSectionRef}>
                                <Collapsible
                                    open={servicesOpen}
                                    onOpenChange={setServicesOpen}
                                >
                                    <div
                                        className={cn(
                                            'overflow-hidden rounded-2xl border transition-all duration-200',
                                            servicesOpen
                                                ? 'border-super-securite-accent/50 bg-white shadow-md shadow-super-securite-accent/10'
                                                : servicesActive
                                                  ? 'border-super-securite-accent/30 bg-super-securite-accent/10'
                                                  : 'border-super-securite-border bg-white',
                                        )}
                                    >
                                        <CollapsibleTrigger asChild>
                                            <button
                                                type="button"
                                                aria-expanded={servicesOpen}
                                                aria-controls="mobile-services-submenu"
                                                className={cn(
                                                    'flex w-full cursor-pointer items-center justify-between px-4 py-3.5 font-heading text-base font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-super-securite-accent focus-visible:outline-none',
                                                    servicesOpen
                                                        ? 'border-b border-super-securite-accent/20 bg-super-securite-accent/8 text-super-securite-accent'
                                                        : servicesActive
                                                          ? 'text-super-securite-accent'
                                                          : 'text-super-securite-heading hover:bg-super-securite-surface/60',
                                                )}
                                            >
                                                <span className="flex min-w-0 flex-col items-start gap-0.5 text-left">
                                                    <span>
                                                        {t('nav.services')}
                                                    </span>
                                                    <span className="text-[11px] font-medium tracking-wide text-super-securite-muted uppercase">
                                                        {servicesOpen
                                                            ? t(
                                                                  'nav.services_submenu_open',
                                                              )
                                                            : `${serviceNavLinks.length} ${t('nav.services_count')}`}
                                                    </span>
                                                </span>
                                                <ChevronDown
                                                    className={cn(
                                                        'size-4 shrink-0 transition-transform duration-200',
                                                        servicesOpen
                                                            ? 'rotate-180 text-super-securite-accent'
                                                            : 'opacity-60',
                                                    )}
                                                    aria-hidden
                                                />
                                            </button>
                                        </CollapsibleTrigger>

                                        <CollapsibleContent
                                            id="mobile-services-submenu"
                                            className="overflow-hidden"
                                        >
                                            <ul
                                                className="space-y-0.5 border-l-2 border-super-securite-accent/30 bg-super-securite-bg/70 px-2 py-2 pl-3"
                                                role="list"
                                                aria-label={t(
                                                    'nav.services_submenu_label',
                                                )}
                                            >
                                                {serviceNavLinks.map(
                                                    (service) => {
                                                        const active =
                                                            isMarketingNavActive(
                                                                service.href,
                                                                pathname,
                                                            );

                                                        return (
                                                            <li
                                                                key={
                                                                    service.href
                                                                }
                                                            >
                                                                <Link
                                                                    href={
                                                                        service.href
                                                                    }
                                                                    onClick={
                                                                        close
                                                                    }
                                                                    aria-current={
                                                                        active
                                                                            ? 'page'
                                                                            : undefined
                                                                    }
                                                                    className={cn(
                                                                        'block rounded-xl py-2.5 pr-3 pl-3 transition-colors duration-200',
                                                                        active
                                                                            ? 'bg-super-securite-accent/12 text-super-securite-accent'
                                                                            : 'text-super-securite-heading hover:bg-white/80',
                                                                    )}
                                                                >
                                                                    <span className="block font-heading text-sm leading-snug font-semibold">
                                                                        {
                                                                            service.label
                                                                        }
                                                                    </span>
                                                                    {service.description ? (
                                                                        <span className="mt-0.5 block text-xs leading-snug text-super-securite-muted">
                                                                            {
                                                                                service.description
                                                                            }
                                                                        </span>
                                                                    ) : null}
                                                                </Link>
                                                            </li>
                                                        );
                                                    },
                                                )}
                                            </ul>
                                        </CollapsibleContent>
                                    </div>
                                </Collapsible>
                            </li>

                            {otherPrimaryLinks.map((item) => {
                                const active = isMarketingNavActive(
                                    item.href,
                                    pathname,
                                );

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={close}
                                            aria-current={
                                                active ? 'page' : undefined
                                            }
                                            className={cn(
                                                'flex items-center justify-between rounded-2xl border px-4 py-3.5 font-heading text-base font-semibold transition-colors duration-200',
                                                active
                                                    ? 'border-super-securite-accent/30 bg-super-securite-accent/10 text-super-securite-accent'
                                                    : 'border-super-securite-border bg-white text-super-securite-heading hover:border-super-securite-accent/30',
                                            )}
                                        >
                                            {item.label}
                                            <ArrowRight
                                                className="size-4 opacity-50"
                                                aria-hidden
                                            />
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="space-y-3 border-t border-super-securite-border/80 bg-super-securite-bg p-4 pb-6">
                        <MarketingLanguageSelect
                            className="w-full max-w-none"
                            onSelected={close}
                        />

                        <a
                            href={lp(devenirAgentIndex.url())}
                            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-super-securite-accent px-4 py-3.5 font-heading text-sm font-semibold text-white shadow-lg shadow-super-securite-accent/25 transition-colors duration-200 hover:bg-super-securite-accent-hover focus-visible:ring-2 focus-visible:ring-super-securite-accent focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/15">
                                <Phone className="size-4" aria-hidden />
                            </span>
                            <span className="flex flex-col items-start gap-0.5">
                                <span className="text-[11px] font-medium tracking-wide text-white/80 uppercase">
                                    {t('nav.join')}
                                </span>
                                <span className="text-base">
                                    {t('nav.join')}
                                </span>
                            </span>
                        </a>

                        <div className="flex items-center gap-3 rounded-xl border border-super-securite-border/80 bg-super-securite-surface px-4 py-3">
                            <Phone
                                className="size-4 shrink-0 text-super-securite-accent"
                                aria-hidden
                            />
                            <a
                                href={superSecurite.phone_href}
                                className="min-w-0 truncate text-sm font-medium text-super-securite-heading transition-colors hover:text-super-securite-accent"
                            >
                                {superSecurite.phone}
                            </a>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border border-super-securite-border/80 bg-super-securite-surface px-4 py-3">
                            <Mail
                                className="size-4 shrink-0 text-super-securite-accent"
                                aria-hidden
                            />
                            <a
                                href={`mailto:${superSecurite.email}`}
                                className="min-w-0 truncate text-sm font-medium text-super-securite-heading transition-colors hover:text-super-securite-accent"
                            >
                                {superSecurite.email}
                            </a>
                        </div>

                        <p className="flex items-start gap-2 px-1 text-xs leading-relaxed text-super-securite-muted">
                            <MapPin
                                className="mt-0.5 size-3.5 shrink-0 text-super-securite-accent"
                                aria-hidden
                            />
                            {superSecurite.address}
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
