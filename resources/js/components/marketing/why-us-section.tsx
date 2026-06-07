import { superSecuriteAdvantages } from '@/data/super-securite-content';
import { superSecuriteStock } from '@/data/super-securite-stock';
import Reveal from '@/components/marketing/reveal';
import { cn } from '@/lib/utils';

const whyUsStats = [
    { label: 'Disponibilité', value: '24h/24 · 7j/7' },
    { label: 'Zone', value: 'Conakry & Guinée' },
    { label: 'Expertise', value: 'Sécurité privée' },
] as const;

export default function WhyUsSection() {
    return (
        <section
            id="pourquoi"
            className="relative overflow-hidden bg-white py-10 md:py-16"
        >
            {/* <div className="marketing-why-us-bg absolute inset-0" aria-hidden /> */}

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 content-center gap-8 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-12">
                    <div className="flex flex-col justify-center lg:col-span-6 xl:col-span-7">
                        <Reveal delay={80}>
                            <p className="marketing-label mb-2 sm:mb-3">
                                Pourquoi
                            </p>
                        </Reveal>

                        <Reveal delay={120}>
                            <h2 className="font-heading text-3xl leading-[1.05] font-bold tracking-tight text-super-securite-heading sm:text-4xl md:text-[2.5rem]">
                                Choisir Super{' '}
                                <span className="relative inline-block">
                                    SÉCURITÉ
                                    <svg
                                        viewBox="0 0 380 22"
                                        className="marketing-underline-draw absolute -bottom-3 left-0 w-full sm:-bottom-4"
                                        fill="none"
                                        preserveAspectRatio="none"
                                        aria-hidden
                                    >
                                        <path
                                            d="M2 16 C 100 1, 280 1, 378 16"
                                            stroke="url(#why-us-underline)"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="why-us-underline"
                                                x1="0"
                                                y1="0"
                                                x2="1"
                                                y2="0"
                                            >
                                                <stop
                                                    offset="0"
                                                    stopColor="var(--super-securite-accent)"
                                                />
                                                <stop offset="1" stopColor="#0f172a" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </span>
                                ?
                            </h2>
                        </Reveal>

                        <Reveal delay={260} className="mt-4 max-w-xl sm:mt-5">
                            <p className="text-sm leading-relaxed sm:text-base">
                                Une équipe expérimentée, réactive et disponible
                                24h/24 pour sécuriser vos entreprises,
                                résidences, chantiers et zones sensibles en
                                Guinée.
                            </p>
                        </Reveal>

                        <Reveal
                            as="dl"
                            delay={400}
                            className="mt-6 grid grid-cols-3 gap-2 sm:mt-7 sm:gap-3"
                        >
                            {whyUsStats.map((stat) => (
                                <div key={stat.label}>
                                    <dt className="text-[10px] text-super-securite-muted sm:text-xs">
                                        {stat.label}
                                    </dt>
                                    <dd className="mt-0.5 font-heading text-xs font-semibold text-super-securite-heading sm:text-sm">
                                        {stat.value}
                                    </dd>
                                </div>
                            ))}
                        </Reveal>
                    </div>

                    <Reveal
                        delay={300}
                        variant="fade"
                        className="flex w-full justify-center lg:col-span-6 xl:col-span-5 lg:justify-end"
                    >
                        <div className="relative w-full">
                            <div
                                className={cn(
                                    'overflow-hidden rounded-3xl p-0 m-0 border border-super-securite-border bg-linear-to-br from-super-securite-surface via-white to-super-securite-accent/5 shadow-xl shadow-slate-900/10',
                                    'ring-4 ring-super-securite-accent/10',
                                )}
                            >
                                <div className="relative flex aspect-square w-full max-h-[42vh] items-center justify-center bg-white sm:max-h-none">
                                    <img
                                        src={
                                            superSecuriteStock.home
                                                .whyUsBannerTransparent
                                        }
                                        alt="Super Sécurité — équipes et sites sécurisés"
                                        width={640}
                                        height={640}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
                    {superSecuriteAdvantages.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <Reveal key={item.title} delay={index * 100}>
                                <article className="marketing-card-interactive flex h-full flex-col p-6 text-center md:p-8">
                                    <div className="mx-auto mb-5 inline-flex size-14 items-center justify-center rounded-full border border-super-securite-accent/20 bg-super-securite-accent/10">
                                        <Icon
                                            className="size-6 text-super-securite-accent"
                                            strokeWidth={1.8}
                                            aria-hidden
                                        />
                                    </div>
                                    <h3 className="font-heading text-lg font-semibold text-super-securite-heading">
                                        {item.title}
                                    </h3>
                                    <p className="mt-3 flex-1 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
