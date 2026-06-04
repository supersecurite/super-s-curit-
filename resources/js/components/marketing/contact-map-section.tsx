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
            className="marketing-section-band-alt border-t border-super-securite-border/50 py-16 md:py-24"
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
                        <span className="marketing-text-gradient">
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
                    <div className="overflow-hidden rounded-2xl border border-super-securite-border bg-super-securite-surface shadow-lg shadow-slate-900/5">
                        <iframe
                            title={mapTitle}
                            src={map.embedUrl}
                            className="aspect-[16/9] w-full min-h-[280px] md:min-h-[400px]"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                        />
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
