import { usePage } from '@inertiajs/react';
import { index as actualitesIndex } from '@/routes/actualites';
import { index as conseilsIndex } from '@/routes/conseils-securite';
import { index as devenirAgentIndex } from '@/routes/devenir-agent';
import { superSecuriteImages } from '@/data/super-securite-images';
import { superSecuriteServices } from '@/data/super-securite-content';
import type { SuperSecuriteConfig } from '@/types/super-securite';
import { FacebookIcon, InstagramIcon, TwitterIcon, Youtube } from 'lucide-react';

type SharedPageProps = {
    superSecurite: SuperSecuriteConfig;
};

export default function MarketingFooter() {
    const { superSecurite } = usePage<SharedPageProps>().props;
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-white/10 bg-black py-16 text-white/70">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    <div>
                        <img
                            src={superSecuriteImages.brandWhite}
                            alt="Super Sécurité"
                            className="h-12 w-auto max-w-[220px] object-contain object-left"
                            width={220}
                            height={48}
                        />
                        <p className="mt-4 text-sm text-white/50">
                            {year} — SuperSécurité — Tous droits réservés.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-heading text-sm font-semibold text-white">
                            Qui sommes-nous
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <a
                                    href="/a-propos"
                                    className="cursor-pointer transition-colors duration-200 hover:text-white"
                                >
                                    Pourquoi nous choisir
                                </a>
                            </li>
                            <li>
                                <a
                                    href={actualitesIndex.url()}
                                    className="cursor-pointer transition-colors duration-200 hover:text-white"
                                >
                                    Actualités
                                </a>
                            </li>
                            <li>
                                <a
                                    href={conseilsIndex.url()}
                                    className="cursor-pointer transition-colors duration-200 hover:text-white"
                                >
                                    Conseils de sécurité
                                </a>
                            </li>
                            <li>
                                <a
                                    href={devenirAgentIndex.url()}
                                    className="cursor-pointer transition-colors duration-200 hover:text-white"
                                >
                                    Rejoignez nous
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-heading text-sm font-semibold text-white">
                            Services
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm">
                            {superSecuriteServices.map((service) => (
                                <li key={`link-${service.id}`}>
                                    <a
                                        href={service.path}
                                        className="cursor-pointer transition-colors duration-200 hover:text-white"
                                    >
                                        {service.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-heading text-sm font-semibold text-white">
                            Nous contacter
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <a
                                    href={superSecurite.phone_href}
                                    className="cursor-pointer transition-colors duration-200 hover:text-white"
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
                                    className="cursor-pointer transition-colors duration-200 hover:text-white"
                                >
                                    {superSecurite.email}
                                </a>
                            </li>
                            <li className="text-white/50">
                                {superSecurite.address}
                            </li>
                        </ul>

                        <h3 className="mt-8 font-heading text-sm font-semibold text-white">
                            Réseaux
                        </h3>
                        <ul className="mt-4 flex flex-col gap-2">
                            {superSecurite.social.facebook && (
                                <li>
                                    <a
                                        href={superSecurite.social.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex cursor-pointer items-center gap-2 text-sm text-white/60 transition-colors duration-200 hover:text-super-securite-accent"
                                    >
                                        <FacebookIcon className="h-4 w-4 text-blue-500" />
                                        Facebook
                                    </a>
                                </li>
                            )}
                            {superSecurite.social.instagram && (
                                <li>
                                    <a
                                        href={superSecurite.social.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex cursor-pointer items-center gap-2 text-sm text-white/60 transition-colors duration-200 hover:text-super-securite-accent"
                                    >
                                        <InstagramIcon className="h-4 w-4 text-pink-500" />
                                        Instagram
                                    </a>
                                </li>
                            )}
                            {superSecurite.social.twitter && (
                                <li>
                                    <a
                                        href={superSecurite.social.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex cursor-pointer items-center gap-2 text-sm text-white/60 transition-colors duration-200 hover:text-super-securite-accent"
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
                                        className="flex cursor-pointer items-center gap-2 text-sm text-white/60 transition-colors duration-200 hover:text-super-securite-accent"
                                    >
                                        <Youtube className="h-4 w-4 text-red-600" />
                                        Youtube
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-wrap gap-4 border-t border-white/10 pt-8 text-xs text-white/50">
                    <a
                        href="/politique-de-confidentialite"
                        className="hover:text-white"
                    >
                        Conditions générales et confidentialité
                    </a>
                    <a
                        href="/mentions-legales"
                        className="hover:text-white"
                    >
                        Mentions légales
                    </a>
                </div>
            </div>
        </footer>
    );
}
