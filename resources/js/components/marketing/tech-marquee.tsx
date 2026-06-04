import { superSecuriteTechStack } from '@/data/super-securite-content';

const featuredTech = [
    ...superSecuriteTechStack.frontend,
    ...superSecuriteTechStack.backend,
    ...superSecuriteTechStack.mobile,
];

export default function TechMarquee() {
    const items = [...featuredTech, ...featuredTech];

    return (
        <div
            className="marketing-marquee-paused relative overflow-hidden border-y border-super-securite-border bg-super-securite-surface/60 py-6"
            aria-label="Technologies maîtrisées par Super Sécurité"
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
                style={{ '--marquee-duration': '35s' } as React.CSSProperties}
                role="list"
            >
                {items.map((item, i) => (
                    <li
                        key={`${item.label}-${i}`}
                        className="flex shrink-0 items-center gap-3 text-super-securite-muted"
                    >
                        <img
                            src={item.path}
                            alt=""
                            width={32}
                            height={32}
                            className="h-8 w-8 object-contain opacity-80"
                            aria-hidden
                        />
                        <span className="font-heading text-sm font-medium tracking-wide whitespace-nowrap">
                            {item.label}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
