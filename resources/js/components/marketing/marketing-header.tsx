import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState, type CSSProperties } from 'react';
import { aristechImages } from '@/data/aristech-images';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import { about, contact, dashboard, home, login } from '@/routes';
import type { AristechConfig } from '@/types/aristech';
import type { User } from '@/types/auth';
import { cn } from '@/lib/utils';
import { Phone } from 'lucide-react';

type SharedPageProps = {
    auth: { user: User | null };
    aristech: AristechConfig;
};

const navLinks = [
    { href: home, label: 'Accueil' },
    { href: about, label: 'À propos' },
    { href: contact, label: 'Contact' },
] as const;

export default function MarketingHeader() {
    const { auth, aristech } = usePage<SharedPageProps>().props;
    const progress = useScrollProgress();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 32);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={cn(
                'sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300',
                scrolled
                    ? 'border-b border-aristech-border bg-aristech-surface/85 shadow-md shadow-slate-900/5 backdrop-blur-xl'
                    : 'border-b border-transparent bg-transparent',
            )}
        >
            <nav
                className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
                aria-label="Navigation principale"
            >
                <Link
                    href={home.url()}
                    className="group flex shrink-0 cursor-pointer items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aristech-accent"
                >
                    <img
                        src={aristechImages.brand}
                        alt="ArisTech"
                        className="h-10 w-auto transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-4deg] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0"
                        width={120}
                        height={40}
                    />
                </Link>

                <ul className="hidden items-center gap-8 md:flex">
                    {navLinks.map((item) => (
                        <li key={item.label}>
                            <Link
                                href={item.href.url()}
                                className="group relative cursor-pointer text-sm font-medium text-aristech-muted transition-colors duration-200 hover:text-aristech-heading"
                            >
                                {item.label}
                                <span
                                    className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-aristech-accent transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
                                    aria-hidden
                                />
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-3">
                    
                    <a
                        href={aristech.phone_href}
                        className="flex items-center gap-2 marketing-cta-primary marketing-magnetic shrink-0 text-sm whitespace-nowrap"
                    >
                        <Phone className="size-4" />
                        Appelez-nous
                    </a>
                </div>
            </nav>

            <ul className="flex justify-center gap-6 border-t border-aristech-border/60 py-2 md:hidden">
                {navLinks.map((item) => (
                    <li key={item.label}>
                        <Link
                            href={item.href.url()}
                            className="cursor-pointer text-xs font-medium text-aristech-muted"
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>

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
