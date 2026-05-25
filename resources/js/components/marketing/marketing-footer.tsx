import { usePage } from '@inertiajs/react';
import { aristechImages } from '@/data/aristech-images';
import type { AristechConfig } from '@/types/aristech';

type SharedPageProps = {
    aristech: AristechConfig;
};

export default function MarketingFooter() {
    const { aristech } = usePage<SharedPageProps>().props;
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-aristech-border bg-aristech-surface-elevated py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                    <div>
                        <img
                            src={aristechImages.brand}
                            alt="ArisTech"
                            className="h-12 w-auto"
                            width={80}
                            height={48}
                        />
                        <p className="mt-4 text-sm text-aristech-muted">
                            © {year} ArisTech. Tous droits réservés.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-heading text-sm font-semibold text-aristech-heading">
                            Contact
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <a
                                    href={`mailto:${aristech.email}`}
                                    className="cursor-pointer transition-colors duration-200 hover:text-aristech-heading"
                                >
                                    {aristech.email}
                                </a>
                            </li>
                            <li>
                                <a
                                    href={aristech.phone_href}
                                    className="cursor-pointer transition-colors duration-200 hover:text-aristech-heading"
                                >
                                    {aristech.phone}
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-heading text-sm font-semibold text-aristech-heading">
                            Réseaux
                        </h3>
                        {(aristech.social.facebook ||
                            aristech.social.twitter ||
                            aristech.social.instagram) && (
                            <ul className="mt-4 flex gap-4">
                                {aristech.social.facebook && (
                                    <li>
                                        <a
                                            href={aristech.social.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="cursor-pointer text-sm text-aristech-muted transition-colors duration-200 hover:text-aristech-accent"
                                        >
                                            Facebook
                                        </a>
                                    </li>
                                )}
                                {aristech.social.twitter && (
                                    <li>
                                        <a
                                            href={aristech.social.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="cursor-pointer text-sm text-aristech-muted transition-colors duration-200 hover:text-aristech-accent"
                                        >
                                            Twitter
                                        </a>
                                    </li>
                                )}
                                {aristech.social.instagram && (
                                    <li>
                                        <a
                                            href={aristech.social.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="cursor-pointer text-sm text-aristech-muted transition-colors duration-200 hover:text-aristech-accent"
                                        >
                                            Instagram
                                        </a>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}
