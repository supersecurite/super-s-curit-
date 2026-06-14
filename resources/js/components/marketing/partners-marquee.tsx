import { superSecuritePartners } from '@/data/super-securite-partners';

export default function PartnersMarquee() {
    const items = [...superSecuritePartners, ...superSecuritePartners];

    return (
        <div
            className="marketing-marquee-paused relative overflow-hidden border-y border-super-securite-border bg-super-securite-surface/60 py-6"
            aria-label="Partenaires Super Sécurité"
        >
            <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-super-securite-bg to-transparent"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-super-securite-bg to-transparent"
                aria-hidden
            />

            <ul
                className="marketing-marquee flex w-max items-center gap-12 pr-12"
                style={{ '--marquee-duration': '40s' } as React.CSSProperties}
                role="list"
            >
                {items.map((partner, index) => (
                    <li
                        key={`${partner.name}-${index}`}
                        className="flex shrink-0 items-center gap-4 text-super-securite-muted"
                    >
                        <img
                            src={partner.logo}
                            alt={`Logo ${partner.name}`}
                            width={120}
                            height={60}
                            loading="lazy"
                            decoding="async"
                            className="h-10 w-auto max-w-[7rem] object-contain opacity-90 md:h-12 md:max-w-[8rem]"
                        />
                        <span className="font-heading text-sm font-medium tracking-wide whitespace-nowrap text-super-securite-heading">
                            {partner.name}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
