import { Link, usePage } from '@inertiajs/react';
import { Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import MarketingMobileNav from '@/components/marketing/marketing-mobile-nav';
import { superSecuriteImages } from '@/data/super-securite-images';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import { about, contact, home } from '@/routes';
import type { SuperSecuriteConfig } from '@/types/super-securite';
import type { User } from '@/types/auth';
import { cn } from '@/lib/utils';
import type { CSSProperties } from 'react';

type SharedPageProps = {
    auth: { user: User | null };
    superSecurite: SuperSecuriteConfig;
};

const primaryNavLinks = [
    { href: home.url(), label: 'Accueil' },
    { href: about.url(), label: 'Pourquoi nous' },
    { href: contact.url(), label: 'Nous contacter' },
] as const;

export default function MarketingHeader() {
    const { props } = usePage<SharedPageProps>();
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

    return (
        <header
            className={cn(
                'sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300',
                scrolled
                    ? 'border-b border-super-securite-border bg-super-securite-surface/85 shadow-md shadow-slate-900/5 backdrop-blur-xl'
                    : 'border-b border-transparent bg-transparent',
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
                        src={superSecuriteImages.brand}
                        alt="Super Sécurité"
                        className="h-10 w-auto max-w-[200px] object-contain object-left transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:h-11 sm:max-w-[240px]"
                        width={240}
                        height={48}
                    />
                </Link>

                <ul className="hidden items-center gap-8 md:flex">
                    {primaryNavLinks.map((item) => (
                        <li key={item.label}>
                            <Link
                                href={item.href}
                                className="group relative cursor-pointer text-sm font-medium text-super-securite-muted transition-colors duration-200 hover:text-super-securite-heading"
                            >
                                {item.label}
                                <span
                                    className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-super-securite-accent transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
                                    aria-hidden
                                />
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-2 sm:gap-3">
                    <a
                        href={superSecurite.phone_href}
                        className="marketing-cta-primary marketing-magnetic hidden shrink-0 items-center gap-2 text-sm whitespace-nowrap md:inline-flex"
                    >
                        <Phone className="size-4" />
                        Appelez-nous
                    </a>

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
