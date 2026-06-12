import { superSecuritePartners } from '@/data/super-securite-partners';
import { superSecuriteZoneLabel } from '@/data/super-securite-zone';
import Reveal from '@/components/marketing/reveal';

export default function PartnersSection() {
    return (
        <section id="partenaires" className="py-10 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-12 max-w-2xl text-center mx-auto">
                    {/* <p className="marketing-label mb-3">Partenaires</p> */}
                    <h2 className="marketing-heading-section">
                        Nos{' '}
                        <span className="marketing-text-gradient">
                            partenaires
                        </span>
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-super-securite-muted md:text-base">
                        Ils nous font confiance pour la sécurité de leurs sites
                        et événements à {superSecuriteZoneLabel}.
                    </p>
                </Reveal>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
                    {superSecuritePartners.map((partner, index) => (
                        <Reveal key={partner.name} delay={index * 80}>
                            <figure className="group flex h-36 flex-col items-center justify-center rounded-2xl border border-super-securite-border bg-white p-5 shadow-sm shadow-slate-900/5 transition-colors duration-300 hover:border-super-securite-accent/30 md:h-44">
                                <img
                                    src={partner.logo}
                                    alt={`Logo ${partner.name}`}
                                    width={220}
                                    height={110}
                                    loading="lazy"
                                    decoding="async"
                                    className="max-h-20 w-auto max-w-full object-contain md:max-h-24"
                                />
                                <figcaption className="mt-3 text-center text-xs font-medium text-super-securite-muted">
                                    {partner.name}
                                </figcaption>
                            </figure>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
