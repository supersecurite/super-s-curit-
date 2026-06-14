import HeroTitleUnderline from '@/components/marketing/hero-title-underline';
import Reveal from '@/components/marketing/reveal';
import { superSecuriteValues } from '@/data/super-securite-about';
import { superSecuriteStock } from '@/data/super-securite-stock';

export default function ValuesSection() {
    return (
        <section className="marketing-section-band border-t border-super-securite-border py-14 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-14 grid items-center gap-10 lg:mb-16 lg:grid-cols-12 lg:gap-14">
                    <div className="lg:col-span-6 xl:col-span-7">
                        <p className="marketing-label mb-3 flex items-center gap-2 before:block before:h-px before:w-6 before:bg-super-securite-accent sm:mb-4">
                            Nos valeurs
                        </p>
                        <h2 className="font-heading text-3xl leading-[1.08] font-bold tracking-tight text-super-securite-heading sm:text-4xl md:text-[2.75rem]">
                            Ce qui nous{' '}
                            <span className="relative inline-block text-super-securite-accent">
                                guide au quotidien
                                <HeroTitleUnderline
                                    variant="draw"
                                    gradientId="values-section-underline"
                                    tone="light"
                                />
                            </span>
                        </h2>
                        <p className="mt-5 max-w-lg text-sm leading-relaxed text-super-securite-muted sm:text-base md:text-lg">
                            Quatre principes simples qui structurent chaque
                            décision, de la première discussion à la mise en
                            production sur le terrain.
                        </p>
                    </div>

                    <Reveal
                        delay={120}
                        variant="fade"
                        className="lg:col-span-6 xl:col-span-5"
                    >
                        <div className="relative mx-auto w-full max-w-md lg:ml-auto lg:max-w-none">
                            <div
                                className="pointer-events-none absolute -inset-3"
                                aria-hidden
                            />
                            <div className="relative overflow-hidden">
                                <div className="relative aspect-[4/5] sm:aspect-square">
                                    <img
                                        src={superSecuriteStock.about.valuesBanner}
                                        alt="Équipe Super Sécurité — nos valeurs sur le terrain"
                                        width={800}
                                        height={800}
                                        loading="lazy"
                                        decoding="async"
                                        className="size-full object-cover object-center"
                                    />
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </Reveal>

                <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-super-securite-border bg-white shadow-sm shadow-slate-900/5 sm:grid-cols-2 lg:grid-cols-4">
                    {superSecuriteValues.map((value, index) => (
                        <Reveal
                            key={value.title}
                            delay={index * 100}
                            className="h-full"
                        >
                            <article className="group relative flex h-full flex-col border-b border-super-securite-border p-7 transition-colors duration-300 hover:bg-super-securite-surface/60 sm:border-r sm:border-b-0 sm:last:border-r-0 md:p-8">
                                <span className="absolute top-0 left-0 h-1 w-0 bg-super-securite-accent transition-all duration-300 group-hover:w-full" />

                                <span className="mb-5 font-mono text-3xl font-bold leading-none tracking-tight text-super-securite-accent/40 transition-colors duration-300 group-hover:text-super-securite-accent md:text-4xl">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <h3 className="mb-3 font-heading text-lg font-semibold text-super-securite-heading">
                                    {value.title}
                                </h3>
                                <p className="flex-1 text-sm leading-relaxed text-super-securite-muted">
                                    {value.description}
                                </p>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
