import { Link, usePage } from '@inertiajs/react';
import {
    ChevronRight,
    Mail,
    MapPin,
    Menu,
    Phone,
    X,
} from 'lucide-react';
import { useState } from 'react';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { superSecuriteImages } from '@/data/super-securite-images';
import { isMarketingNavActive } from '@/lib/marketing-nav-active';
import { cn } from '@/lib/utils';
import { index as actualitesIndex } from '@/routes/actualites';
import { index as conseilsIndex } from '@/routes/conseils-securite';
import { about, contact, home } from '@/routes';
import type { SuperSecuriteConfig } from '@/types/super-securite';
import { index as devenirAgentIndex } from '@/routes/devenir-agent';

type MarketingMobileNavProps = {
    superSecurite: SuperSecuriteConfig;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const primaryLinks = [
    { href: home.url(), label: 'Accueil' },
    { href: about.url(), label: 'Pourquoi nous' },
    { href: actualitesIndex.url(), label: 'Actualités' },
    { href: conseilsIndex.url(), label: 'Conseils' },
    { href: contact.url(), label: 'Nous contacter' },
] as const;

export default function MarketingMobileNav({
    superSecurite,
    open,
    onOpenChange,
}: MarketingMobileNavProps) {
    const { url } = usePage();
    const [servicesOpen, setServicesOpen] = useState(false);
    const close = () => onOpenChange(false);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <button
                    type="button"
                    className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-white shadow-md shadow-slate-900/25 transition-all duration-200 hover:bg-super-securite-accent hover:shadow-super-securite-accent/30 focus-visible:ring-2 focus-visible:ring-super-securite-accent focus-visible:ring-offset-2 focus-visible:outline-none md:hidden"
                    aria-label="Ouvrir le menu"
                >
                    <Menu className="size-5" aria-hidden />
                </button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="z-[60] flex h-full w-full max-w-none flex-col gap-0 overflow-hidden border-0 bg-super-securite-surface p-0 sm:max-w-sm [&>button]:hidden"
            >
                <SheetTitle className="sr-only">Menu de navigation</SheetTitle>

                <div className="relative shrink-0 overflow-hidden bg-black px-5 pb-6 pt-5">
                    <div
                        className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-white/5 blur-2xl"
                        aria-hidden
                    />
                    <div
                        className="pointer-events-none absolute -bottom-12 left-1/3 size-32 rounded-full bg-super-securite-accent/30 blur-3xl"
                        aria-hidden
                    />

                    <div className="relative flex items-start justify-between gap-4">
                        <Link
                            href={home.url()}
                            onClick={close}
                            className="flex min-w-0 flex-col gap-1 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
                        >
                            <img
                                src={superSecuriteImages.brandBlackTransparent}
                                alt="Super Sécurité"
                                className="h-16 w-auto max-w-[200px] object-contain object-left"
                                width={200}
                                height={36}
                            />
                        </Link>

                        <SheetClose asChild>
                            <button
                                type="button"
                                className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
                                aria-label="Fermer le menu"
                            >
                                <X className="size-5" aria-hidden />
                            </button>
                        </SheetClose>
                    </div>
                </div>

                <nav
                    className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-3 py-2"
                    aria-label="Navigation mobile"
                >
                    <ul className="divide-y divide-super-securite-border/60">
                        {primaryLinks.map((item) => {
                            const active = isMarketingNavActive(item.href, url);

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={close}
                                        aria-current={
                                            active ? 'page' : undefined
                                        }
                                        className={cn(
                                            'group flex items-center gap-3 rounded-xl px-3 py-4 transition-colors duration-200',
                                            active
                                                ? 'bg-super-securite-accent/8 text-super-securite-accent'
                                                : 'text-super-securite-heading hover:bg-super-securite-bg',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'h-8 w-1 shrink-0 rounded-full transition-colors duration-200',
                                                active
                                                    ? 'bg-super-securite-accent'
                                                    : 'bg-transparent group-hover:bg-super-securite-border',
                                            )}
                                            aria-hidden
                                        />
                                        <span className="flex-1 font-heading text-[17px] font-semibold tracking-tight">
                                            {item.label}
                                        </span>
                                        <ChevronRight
                                            className={cn(
                                                'size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5',
                                                active
                                                    ? 'text-super-securite-accent'
                                                    : 'text-super-securite-muted/60',
                                            )}
                                            aria-hidden
                                        />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="shrink-0 space-y-3 border-t border-super-securite-border/80 bg-super-securite-bg p-4">
                    <a
                        href={devenirAgentIndex.url()}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-super-securite-accent px-4 py-3.5 font-heading text-sm font-semibold text-white shadow-lg shadow-super-securite-accent/25 transition-colors duration-200 hover:bg-super-securite-accent-hover focus-visible:ring-2 focus-visible:ring-super-securite-accent focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/15">
                            <Phone className="size-4" aria-hidden />
                        </span>
                        <span className="flex flex-col items-start gap-0.5">
                            <span className="text-[11px] font-medium tracking-wide text-white/80 uppercase">
                                Devenir agent
                            </span>
                            <span className="text-base">Rejoignez-nous</span>
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
            </SheetContent>
        </Sheet>
    );
}
