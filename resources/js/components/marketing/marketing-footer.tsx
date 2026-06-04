import { usePage } from '@inertiajs/react';
import { superSecuriteImages } from '@/data/super-securite-images';
import { superSecuriteFooterServices } from '@/data/super-securite-content';
import type { SuperSecuriteConfig } from '@/types/super-securite';
import { FacebookIcon, TwitterIcon, Youtube } from 'lucide-react';

type SharedPageProps = {
    superSecurite: SuperSecuriteConfig;
};

export default function MarketingFooter() {
    const { superSecurite } = usePage<SharedPageProps>().props;
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-super-securite-border bg-super-securite-surface-elevated py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    <div>
                        <img
                            src={superSecuriteImages.brand}
                            alt="Super Sécurité"
                            className="h-12 w-auto max-w-[220px] object-contain object-left"
                            width={220}
                            height={48}
                        />
                        <p className="mt-4 text-sm text-super-securite-muted">
                            {year} — SuperSécurité — Tous droits réservés.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-heading text-sm font-semibold text-super-securite-heading">
                            Qui sommes-nous
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <a
                                    href="/a-propos"
                                    className="cursor-pointer transition-colors duration-200 hover:text-super-securite-heading"
                                >
                                    Pourquoi nous choisir
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/#services"
                                    className="cursor-pointer transition-colors duration-200 hover:text-super-securite-heading"
                                >
                                    Gardiennage &amp; sécurité
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/#services"
                                    className="cursor-pointer transition-colors duration-200 hover:text-super-securite-heading"
                                >
                                    Technologie
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/#evenementiel"
                                    className="cursor-pointer transition-colors duration-200 hover:text-super-securite-heading"
                                >
                                    Événementiel
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-heading text-sm font-semibold text-super-securite-heading">
                            Services
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm">
                            {superSecuriteFooterServices.map((service) => (
                                <li key={service}>{service}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-heading text-sm font-semibold text-super-securite-heading">
                            Nous contacter
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <a
                                    href={superSecurite.phone_href}
                                    className="cursor-pointer transition-colors duration-200 hover:text-super-securite-heading"
                                >
                                    {superSecurite.phone}
                                    {superSecurite.phone_secondary
                                        ? ` // ${superSecurite.phone_secondary}`
                                        : ''}
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`mailto:${superSecurite.email}`}
                                    className="cursor-pointer transition-colors duration-200 hover:text-super-securite-heading"
                                >
                                    {superSecurite.email}
                                </a>
                            </li>
                            <li className="text-super-securite-muted">
                                {superSecurite.address}
                            </li>
                        </ul>

                        <h3 className="mt-8 font-heading text-sm font-semibold text-super-securite-heading">
                            Réseaux
                        </h3>
                        <ul className="mt-4 flex flex-col gap-2">
                            {superSecurite.social.facebook && (
                                <li>
                                    <a
                                        href={superSecurite.social.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex cursor-pointer items-center gap-2 text-sm text-super-securite-muted transition-colors duration-200 hover:text-super-securite-accent"
                                    >
                                        <FacebookIcon className="h-4 w-4 text-blue-500" />
                                        Facebook
                                    </a>
                                </li>
                            )}
                            {superSecurite.social.twitter && (
                                <li>
                                    <a
                                        href={superSecurite.social.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex cursor-pointer items-center gap-2 text-sm text-super-securite-muted transition-colors duration-200 hover:text-super-securite-accent"
                                    >
                                        <TwitterIcon className="h-4 w-4 text-blue-500" />
                                        Twitter
                                    </a>
                                </li>
                            )}
                            {superSecurite.social.youtube && (
                                <li>
                                    <a
                                        href={superSecurite.social.youtube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex cursor-pointer items-center gap-2 text-sm text-super-securite-muted transition-colors duration-200 hover:text-super-securite-accent"
                                    >
                                        <Youtube className="h-4 w-4 text-red-600" />
                                        Youtube
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-wrap gap-4 border-t border-super-securite-border pt-8 text-xs text-super-securite-muted">
                    <a
                        href="/politique-de-confidentialite"
                        className="hover:text-super-securite-heading"
                    >
                        Conditions générales et confidentialité
                    </a>
                    <a
                        href="/mentions-legales"
                        className="hover:text-super-securite-heading"
                    >
                        Mentions légales
                    </a>
                </div>
            </div>
        </footer>
    );
}
