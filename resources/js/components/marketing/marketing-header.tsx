import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MarketingMobileNav from '@/components/marketing/marketing-mobile-nav';
import MarketingServicesNav from '@/components/marketing/marketing-services-nav';
import { superSecuriteImages } from '@/data/super-securite-images';
import { useMarketingPrimaryNavLinks } from '@/data/marketing-nav';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import { useTrans } from '@/hooks/use-trans';
import { index as devenirAgentIndex } from '@/routes/devenir-agent';
import { home } from '@/routes';
import { localizePath, alternatePath } from '@/lib/locale-url';
import type { SuperSecuriteConfig } from '@/types/super-securite';
import type { User } from '@/types/auth';
import { isMarketingNavActive } from '@/lib/marketing-nav-active';
import { cn } from '@/lib/utils';
import type { CSSProperties } from 'react';

type SharedPageProps = {
    auth: { user: User | null };
    superSecurite: SuperSecuriteConfig;
};

export default function MarketingHeader() {
    const { props, url } = usePage<SharedPageProps>();
    const { superSecurite } = props;
    const { t, locale, locales } = useTrans();
    const progress = useScrollProgress();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = url.split('?')[0] ?? '/';
    const primaryNavLinks = useMarketingPrimaryNavLinks();
    const lp = (path: string) => localizePath(path, locale);
    const homeHref = lp(home.url());

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 32);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const header = document.getElementById('marketing-header');

        if (!header) {
            return;
        }

        const syncHeaderHeight = () => {
            document.documentElement.style.setProperty(
                '--marketing-header-height',
                `${header.offsetHeight}px`,
            );
        };

        syncHeaderHeight();

        const observer = new ResizeObserver(syncHeaderHeight);
        observer.observe(header);

        header.querySelectorAll('img').forEach((image) => {
            image.addEventListener('load', syncHeaderHeight);
        });

        window.addEventListener('resize', syncHeaderHeight);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', syncHeaderHeight);
            document.documentElement.style.removeProperty(
                '--marketing-header-height',
            );
        };
    }, []);

    function switchLocale(targetLocale: string) {
        const target = alternatePath(pathname, targetLocale);
        document.cookie = `locale=${targetLocale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
        router.visit(target, { preserveState: false });
    }

    return (
        <header
            id="marketing-header"
            className={cn(
                'sticky top-0 z-40 border-b bg-black transition-[box-shadow] duration-300',
                scrolled
                    ? 'border-white/10 shadow-lg shadow-black/40'
                    : 'border-transparent',
            )}
        >
            <nav
                className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8"
                aria-label={t('nav.main')}
            >
                <Link
                    href={homeHref}
                    className="group flex shrink-0 cursor-pointer items-center gap-2 focus-visible:ring-2 focus-visible:ring-super-securite-accent focus-visible:outline-none"
                >
                    <img
                        src={superSecuriteImages.brandBlackTransparent}
                        alt="Super Sécurité"
                        className="h-12 w-auto max-w-[200px] object-contain object-left transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100 md:hidden"
                        width={200}
                        height={48}
                    />
                    <img
                        src={superSecuriteImages.brandWhite}
                        alt="Super Sécurité"
                        className="hidden h-16 w-auto max-w-[240px] object-contain object-left transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100 md:block"
                        width={240}
                        height={48}
                    />
                </Link>

                <ul className="hidden items-center gap-8 md:flex">
                    <li>
                        <Link
                            href={homeHref}
                            aria-current={
                                isMarketingNavActive(homeHref, pathname)
                                    ? 'page'
                                    : undefined
                            }
                            className={cn(
                                'group relative cursor-pointer text-sm font-medium transition-colors duration-200',
                                isMarketingNavActive(homeHref, pathname)
                                    ? 'font-semibold text-super-securite-accent'
                                    : 'text-white/80 hover:text-white',
                            )}
                        >
                            {t('nav.home')}
                            <span
                                className={cn(
                                    'absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-super-securite-accent transition-transform duration-300 ease-out motion-reduce:transition-none',
                                    isMarketingNavActive(homeHref, pathname)
                                        ? 'scale-x-100'
                                        : 'scale-x-0 group-hover:scale-x-100',
                                )}
                                aria-hidden
                            />
                        </Link>
                    </li>

                    <MarketingServicesNav pathname={pathname} />

                    {primaryNavLinks.slice(1).map((item) => {
                        const active = isMarketingNavActive(
                            item.href,
                            pathname,
                        );

                        return (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    aria-current={active ? 'page' : undefined}
                                    className={cn(
                                        'group relative cursor-pointer text-sm font-medium transition-colors duration-200',
                                        active
                                            ? 'font-semibold text-super-securite-accent'
                                            : 'text-white/80 hover:text-white',
                                    )}
                                >
                                    {item.label}
                                    <span
                                        className={cn(
                                            'absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-super-securite-accent transition-transform duration-300 ease-out motion-reduce:transition-none',
                                            active
                                                ? 'scale-x-100'
                                                : 'scale-x-0 group-hover:scale-x-100',
                                        )}
                                        aria-hidden
                                    />
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="flex items-center gap-2 sm:gap-3">
                    {locales.length > 1 && (
                        <div
                            className="hidden items-center gap-1 text-xs font-medium md:flex"
                            role="group"
                            aria-label={t('language.switch')}
                        >
                            {locales.map((loc) => (
                                <button
                                    key={loc}
                                    type="button"
                                    onClick={() => switchLocale(loc)}
                                    aria-current={loc === locale ? 'true' : undefined}
                                    className={cn(
                                        'cursor-pointer rounded px-1.5 py-0.5 transition-colors duration-200',
                                        loc === locale
                                            ? 'bg-super-securite-accent text-white'
                                            : 'text-white/60 hover:text-white',
                                    )}
                                >
                                    {t(`language.${loc}`, loc.toUpperCase())}
                                </button>
                            ))}
                        </div>
                    )}

                    <Link
                        href={lp(devenirAgentIndex.url())}
                        className="marketing-cta-primary marketing-magnetic hidden shrink-0 items-center gap-2 text-sm whitespace-nowrap md:inline-flex"
                    >
                        {t('nav.join')}
                    </Link>

                    <MarketingMobileNav
                        pathname={pathname}
                        superSecurite={superSecurite}
                        open={mobileMenuOpen}
                        onOpenChange={setMobileMenuOpen}
                    />
                </div>
            </nav>

            <div
                className="marketing-scroll-progress"
                style={{ '--scroll-progress': progress } as CSSProperties}
                role="progressbar"
                aria-label={t('nav.scroll_progress', 'Progression de lecture')}
                aria-valuenow={Math.round(progress * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
            />
        </header>
    );
}
