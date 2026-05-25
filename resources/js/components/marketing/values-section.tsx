import Reveal from '@/components/marketing/reveal';
import { aristechValues } from '@/data/aristech-about';
import { aristechStock } from '@/data/aristech-stock';

export default function ValuesSection() {
    return (
        <section className="py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* ── Header ── */}
                <Reveal className="mb-16 grid items-end gap-10 lg:grid-cols-2 lg:gap-16">
                    <div>
                        <p className="marketing-label mb-4 flex items-center gap-2 before:block before:h-px before:w-6 before:bg-aristech-accent">
                            Nos valeurs
                        </p>
                        <h2 className="marketing-heading-section mb-4">
                            Ce qui nous{' '}
                            <em className="marketing-text-gradient not-italic">
                                guide au quotidien
                            </em>
                        </h2>
                        <p className="text-base leading-relaxed text-aristech-text max-w-md">
                            Quatre principes simples qui structurent chaque
                            décision, de la première discussion à la mise en
                            production.
                        </p>
                    </div>

                    {/* Image avec coins asymétriques */}
                    <div className="relative">
                        <div className="relative overflow-hidden rounded-tl rounded-tr-3xl rounded-bl-3xl rounded-br aspect-[4/3]">
                            <img
                                src={aristechStock.about.valuesBanner}
                                alt="Équipe ArisTech en réunion stratégique"
                                width={800}
                                height={600}
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Décoration en écho */}
                        <div className="pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 rounded-tl rounded-tr-3xl rounded-bl-3xl rounded-br border-2 border-aristech-accent/25" />
                    </div>
                </Reveal>

                {/* ── Grille de cartes ── */}
                <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-aristech-accent/15 sm:grid-cols-2 lg:grid-cols-4">
                    {aristechValues.map((value, index) => {
                        const Icon = value.icon;

                        return (
                            <Reveal
                                key={value.title}
                                delay={index * 100}
                                className="h-full"
                            >
                                <article className="group relative flex h-full flex-col border-r border-aristech-accent/15 bg-white p-8 transition-colors duration-300 hover:bg-aristech-surface last:border-r-0">
                                    {/* Barre latérale au hover */}
                                    <span className="absolute left-0 top-[20%] bottom-[20%] w-0.5 rounded-full bg-aristech-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                    {/* Numéro */}
                                    <p className="mb-7 font-mono text-[11px] tracking-[0.15em] text-aristech-accent/40">
                                        {String(index + 1).padStart(2, '0')} /
                                    </p>

                                    {/* Icône */}
                                    <div className="mb-6 inline-flex size-12 items-center justify-center rounded-full border border-aristech-accent/15 bg-aristech-accent/10 transition-colors duration-300 group-hover:border-aristech-accent group-hover:bg-aristech-accent/20">
                                        <Icon
                                            className="size-5 text-aristech-accent"
                                            strokeWidth={1.8}
                                            aria-hidden
                                        />
                                    </div>

                                    <h3 className="mb-3 font-heading text-lg font-normal text-aristech-heading">
                                        {value.title}
                                    </h3>
                                    <p className="flex-1 text-sm leading-relaxed text-aristech-text">
                                        {value.description}
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