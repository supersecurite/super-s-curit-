import { ExternalLink, MapPin } from 'lucide-react';
import Reveal from '@/components/marketing/reveal';
import type { SuperSecuriteConfig } from '@/types/super-securite';

type ContactMapSectionProps = {
    superSecurite: SuperSecuriteConfig;
};

export default function ContactMapSection({ superSecurite }: ContactMapSectionProps) {
    const { map, address } = superSecurite;
    const mapTitle = `Plan d'accès — Super Sécurité, ${address}`;

    return (
        <section
            id="plan-acces"
            className=""
            aria-labelledby="contact-map-heading"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-10 max-w-2xl">
                    <p className="marketing-label mb-3">Localisation</p>
                    <h2
                        id="contact-map-heading"
                        className="marketing-heading-section"
                    >
                        Nous{' '}
                        <span className="text-black">
                            trouver
                        </span>
                    </h2>
                    <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed md:text-base">
                        <MapPin
                            className="mt-0.5 size-5 shrink-0 text-super-securite-accent"
                            aria-hidden
                        />
                        <span>{address}</span>
                    </p>
                </Reveal>

                <Reveal delay={120}>
                    <div className="relative overflow-hidden rounded-2xl bg-super-securite-surface">
                        <iframe
                            title={mapTitle}
                            src={map.embedUrl}
                            className="aspect-[16/9] w-full min-h-[280px] md:min-h-[400px]"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                        />
                        <div
                            className="pointer-events-none absolute inset-0 flex items-center justify-center"
                            aria-hidden
                        >
                            <div className="relative flex -translate-y-6 flex-col items-center md:-translate-y-8">
                                <span className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-super-securite-accent/25 blur-md" />
                                <MapPin
                                    className="relative size-10 fill-super-securite-accent text-super-securite-accent drop-shadow-[0_4px_12px_rgba(237,28,36,0.45)]"
                                    strokeWidth={1.5}
                                />
                                <span className="relative -mt-1 rounded-full bg-super-securite-accent px-3 py-1 text-xs font-semibold tracking-wide text-white shadow-md md:text-sm">
                                    Super Sécurité
                                </span>
                            </div>
                        </div>
                    </div>
                    <p className="mt-4 flex flex-wrap items-center gap-4 text-sm text-super-securite-muted">
                        <span>
                            Coordonnées : {map.latitude}, {map.longitude}
                        </span>
                        <a
                            href={map.directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="marketing-cta-secondary inline-flex items-center gap-2 px-4 py-2 text-xs"
                        >
                            Ouvrir dans Google Maps
                            <ExternalLink className="size-3.5" aria-hidden />
                        </a>
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
