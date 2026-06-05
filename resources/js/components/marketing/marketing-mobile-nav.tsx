import { Link } from '@inertiajs/react';
import { ArrowRight, Mail, Menu, Phone, X } from 'lucide-react';
import { superSecuriteImages } from '@/data/super-securite-images';
import { superSecuriteNavLinks } from '@/data/super-securite-nav';
import { index as actualitesIndex } from '@/routes/actualites';
import { index as conseilsIndex } from '@/routes/conseils-securite';
import { about, contact, home } from '@/routes';
import type { SuperSecuriteConfig } from '@/types/super-securite';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

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
    const close = () => onOpenChange(false);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <button
                    type="button"
                    className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl border border-super-securite-border bg-super-securite-surface/90 text-super-securite-heading shadow-sm transition-colors duration-200 hover:border-super-securite-accent/40 hover:bg-super-securite-surface md:hidden"
                    aria-label="Ouvrir le menu"
                >
                    <Menu className="size-5" aria-hidden />
                </button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="z-[60] flex h-full w-full max-w-none flex-col gap-0 border-super-securite-border bg-super-securite-bg p-0 sm:max-w-md [&>button]:hidden"
            >
                <SheetTitle className="sr-only">Menu de navigation</SheetTitle>

                <div className="marketing-grid-bg relative flex shrink-0 items-center justify-between border-b border-super-securite-border px-5 py-4">
                    <Link
                        href={home.url()}
                        onClick={close}
                        className="flex items-center"
                    >
                        <img
                            src={superSecuriteImages.brand}
                            alt="Super Sécurité"
                            className="h-10 w-auto max-w-[180px] object-contain object-left"
                            width={180}
                            height={40}
                        />
                    </Link>
                    <SheetClose asChild>
                        <button
                            type="button"
                            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-xl border border-super-securite-border bg-super-securite-surface text-super-securite-heading transition-colors hover:border-super-securite-accent/40"
                            aria-label="Fermer le menu"
                        >
                            <X className="size-5" aria-hidden />
                        </button>
                    </SheetClose>
                </div>

                <nav
                    className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-5 py-6"
                    aria-label="Navigation mobile"
                >
                    <p className="marketing-label mb-3">Navigation</p>
                    <ul className="space-y-2">
                        {primaryLinks.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={close}
                                    className="flex items-center justify-between rounded-2xl border border-super-securite-border bg-super-securite-surface px-4 py-3.5 font-heading text-base font-semibold text-super-securite-heading transition-colors duration-200 hover:border-super-securite-accent/30"
                                >
                                    {item.label}
                                    <ArrowRight
                                        className="size-4 opacity-50"
                                        aria-hidden
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <p className="marketing-label mt-8 mb-3">Services</p>
                    <ul className="space-y-2">
                        {superSecuriteNavLinks.map((service) => (
                            <li key={service.href}>
                                <a
                                    href={service.href}
                                    onClick={close}
                                    className="block rounded-2xl border border-super-securite-border bg-super-securite-surface px-4 py-3 font-heading text-sm font-semibold text-super-securite-heading transition-colors hover:border-super-securite-accent/30"
                                >
                                    {service.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="shrink-0 space-y-3 border-t border-super-securite-border bg-super-securite-surface/80 p-5 backdrop-blur-sm">
                    <a
                        href={superSecurite.phone_href}
                        className="marketing-cta-primary flex w-full items-center justify-center gap-2"
                    >
                        <Phone className="size-4" aria-hidden />
                        {superSecurite.phone}
                    </a>
                    <a
                        href={`mailto:${superSecurite.email}`}
                        className="marketing-cta-secondary flex w-full items-center justify-center gap-2"
                    >
                        <Mail className="size-4" aria-hidden />
                        {superSecurite.email}
                    </a>
                    <p className="text-center text-xs text-super-securite-muted">
                        {superSecurite.address}
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
