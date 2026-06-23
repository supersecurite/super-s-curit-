import Reveal from '@/components/marketing/reveal';
import { superSecuritePartners } from '@/data/super-securite-partners';

type PartnersMarqueeProps = {
    partners?: { name: string; logo: string }[];
};

export default function PartnersMarquee({ partners = [] }: PartnersMarqueeProps) {
    const activePartners = partners.length > 0 ? partners : superSecuritePartners;
    const items = [...activePartners, ...activePartners];

    return (
        <section
            className="marketing-section-band border-y border-super-securite-border py-12 md:py-16"
            aria-labelledby="partners-heading"
        >
            <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
                <Reveal className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
                    <p className="marketing-label mb-3">Partenaires</p>
                    <h2
                        id="partners-heading"
                        className="marketing-heading-section"
                    >
                        Ils nous font{' '}
                        <span className="text-super-securite-accent">
                            confiance
                        </span>
                    </h2>
                </Reveal>

                <div
                    className="marketing-marquee-paused relative overflow-hidden rounded-2xl border border-super-securite-border/80 bg-white/90 py-6 shadow-sm shadow-slate-900/5 md:py-8"
                    aria-label="Logos des partenaires Super Sécurité"
                >
                    <div
                        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white via-white/90 to-transparent sm:w-24"
                        aria-hidden
                    />
                    <div
                        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white via-white/90 to-transparent sm:w-24"
                        aria-hidden
                    />

                    <ul
                        className="marketing-marquee flex w-max items-stretch gap-4 pr-4 sm:gap-5 sm:pr-5"
                        style={
                            {
                                '--marquee-duration': '25s',
                            } as React.CSSProperties
                        }
                        role="list"
                    >
                        {items.map((partner, index) => (
                            <li
                                key={`${partner.name}-${index}`}
                                className="shrink-0"
                            >
                                <figure className="group flex h-[5.5rem] w-[9.5rem] flex-col items-center justify-center gap-2 rounded-xl border border-super-securite-border/70 bg-super-securite-surface px-4 py-3 transition-all duration-300 hover:border-super-securite-accent/35 hover:shadow-md hover:shadow-super-securite-accent/10 sm:h-24 sm:w-44">
                                    <img
                                        src={partner.logo}
                                        alt=""
                                        width={120}
                                        height={60}
                                        loading="lazy"
                                        decoding="async"
                                        className="max-h-10 w-auto max-w-full object-contain opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 sm:max-h-11"
                                    />
                                    <figcaption className="line-clamp-1 text-center text-[10px] font-medium tracking-wide text-super-securite-muted uppercase group-hover:text-super-securite-heading sm:text-[11px]">
                                        {partner.name}
                                    </figcaption>
                                </figure>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
