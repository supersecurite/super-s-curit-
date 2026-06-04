import Reveal from '@/components/marketing/reveal';
import { superSecuriteValues } from '@/data/super-securite-about';
import { superSecuriteStock } from '@/data/super-securite-stock';

export default function AboutApproachSection() {
    return (
        <section className="border-y border-super-securite-border bg-super-securite-surface/40 py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
                    <Reveal className="lg:col-span-5">
                        <p className="marketing-label mb-3">Notre approche</p>
                        <h2 className="marketing-heading-section">
                            Un partenaire sécurité{' '}
                            <span className="marketing-text-gradient">
                                de bout en bout
                            </span>
                        </h2>
                        <p className="mt-6 text-base leading-relaxed text-super-securite-text">
                            De l&apos;audit de vos besoins au déploiement sur
                            site, nous alignons protocoles, effectifs et
                            supervision sur des standards professionnels —
                            sans compromis sur la réactivité ni sur la
                            qualité de service.
                        </p>
                        <p className="mt-4 text-base leading-relaxed text-super-securite-muted">
                            Que vous sécurisiez un bureau, un chantier, un site
                            industriel ou un événement, la même exigence guide
                            chaque mission.
                        </p>

                        <div className="mt-10 overflow-hidden rounded-2xl border border-super-securite-border shadow-md shadow-slate-900/5">
                            <img
                                src={superSecuriteStock.about.story}
                                alt="Équipe de sécurité Super Sécurité à Conakry"
                                width={900}
                                height={600}
                                loading="lazy"
                                className="aspect-[4/3] h-auto w-full object-cover"
                            />
                        </div>
                    </Reveal>

                    <div className="flex flex-col gap-6 lg:col-span-7">
                        {superSecuriteValues.map((pillar, index) => {
                            const Icon = pillar.icon;

                            return (
                                <Reveal key={pillar.title} delay={index * 100}>
                                    <article className="group flex gap-6 rounded-2xl border border-super-securite-border bg-white p-6 shadow-sm shadow-slate-900/5 transition-colors duration-300 hover:border-super-securite-accent/30 md:p-8">
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-super-securite-accent/15 bg-super-securite-accent/10 transition-colors group-hover:bg-super-securite-accent/20">
                                            <Icon
                                                className="size-5 text-super-securite-accent"
                                                strokeWidth={1.8}
                                                aria-hidden
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-heading text-xl font-semibold text-super-securite-heading">
                                                {pillar.title}
                                            </h3>
                                            <p className="mt-3 text-sm leading-relaxed text-super-securite-text md:text-base">
                                                {pillar.description}
                                            </p>
                                        </div>
                                    </article>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
