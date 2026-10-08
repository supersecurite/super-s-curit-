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
            className="marketing-section-band border-y border-super-securite-border py-16 md:py-24"
            aria-labelledby="partners-heading"
        >
            <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
                <Reveal className="mx-auto mb-12 max-w-2xl text-center md:mb-14">
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
                    className="marketing-marquee-paused relative overflow-hidden rounded-2xl border border-super-securite-border/80 bg-white/90 py-8 shadow-sm shadow-slate-900/5 md:py-12"
                    aria-label="Logos des partenaires Super Sécurité"
                >
                    <div
                        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white via-white/90 to-transparent sm:w-28"
                        aria-hidden
                    />
                    <div
                        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white via-white/90 to-transparent sm:w-28"
                        aria-hidden
                    />

                    <ul
                        className="marketing-marquee flex w-max items-stretch gap-5 pr-5 sm:gap-6 sm:pr-6"
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
                                <figure className="group flex min-h-32 w-40 flex-col items-center justify-center gap-2.5 overflow-visible rounded-xl border border-super-securite-border/70 bg-super-securite-surface px-4 py-4 transition-all duration-300 hover:border-super-securite-accent/35 hover:shadow-md hover:shadow-super-securite-accent/10 sm:min-h-40 sm:w-56 sm:gap-3 sm:px-5 sm:py-5">
                                    <div className="flex min-h-14 w-full flex-1 items-center justify-center sm:min-h-20">
                                        <img
                                            src={partner.logo}
                                            alt=""
                                            width={180}
                                            height={90}
                                            loading="lazy"
                                            decoding="async"
                                            className="max-h-14 w-auto max-w-full object-contain opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 sm:max-h-20"
                                        />
                                    </div>
                                    <figcaption className="line-clamp-2 w-full shrink-0 text-center text-[11px] leading-tight font-medium tracking-wide text-super-securite-muted uppercase group-hover:text-super-securite-heading sm:text-xs">
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
