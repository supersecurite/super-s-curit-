import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MarketingMobileNav from '@/components/marketing/marketing-mobile-nav';
import { superSecuriteImages } from '@/data/super-securite-images';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import { index as actualitesIndex } from '@/routes/actualites';
import { index as conseilsIndex } from '@/routes/conseils-securite';
import { index as devenirAgentIndex } from '@/routes/devenir-agent';
import { about, contact, home } from '@/routes';
import type { SuperSecuriteConfig } from '@/types/super-securite';
import type { User } from '@/types/auth';
import { isMarketingNavActive } from '@/lib/marketing-nav-active';
import { cn } from '@/lib/utils';
import type { CSSProperties } from 'react';

type SharedPageProps = {
    auth: { user: User | null };
    superSecurite: SuperSecuriteConfig;
};

const primaryNavLinks = [
    { href: home.url(), label: 'Accueil' },
    { href: about.url(), label: 'Pourquoi nous' },
    { href: actualitesIndex.url(), label: 'Actualités' },
    { href: conseilsIndex.url(), label: 'Conseils' },
    { href: contact.url(), label: 'Nous contacter' },
] as const;

export default function MarketingHeader() {
    const { props, url } = usePage<SharedPageProps>();
    const { superSecurite } = props;
    const progress = useScrollProgress();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        return () => {
            observer.disconnect();
            document.documentElement.style.removeProperty(
                '--marketing-header-height',
            );
        };
    }, []);

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
                aria-label="Navigation principale"
            >
                <Link
                    href={home.url()}
                    className="group flex shrink-0 cursor-pointer items-center gap-2 focus-visible:ring-2 focus-visible:ring-super-securite-accent focus-visible:outline-none"
                >
                    <img
                        src={superSecuriteImages.brandBlackTransparent}
                        alt="Super Sécurité"
                        className="h-16 w-auto max-w-[200px] object-contain object-left transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100 md:hidden"
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
                    {primaryNavLinks.map((item) => {
                        const active = isMarketingNavActive(item.href, url);

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
                    <Link
                        href={devenirAgentIndex.url()}
                        className="marketing-cta-primary marketing-magnetic hidden shrink-0 items-center gap-2 text-sm whitespace-nowrap md:inline-flex"
                    >
                        Rejoignez-nous
                    </Link>

                    <MarketingMobileNav
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
                aria-label="Progression de lecture"
                aria-valuenow={Math.round(progress * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
            />
        </header>
    );
}
