import Reveal from '@/components/marketing/reveal';
import { aristechProcess } from '@/data/aristech-about';
import { aristechStock } from '@/data/aristech-stock';

export default function ProcessTimeline() {
    return (
        <section className="border-y border-aristech-border bg-aristech-surface-elevated/80 py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-16 grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-7">
                        <p className="marketing-label mb-3">Notre processus</p>
                        <h2 className="marketing-heading-section">
                            Cinq étapes pour{' '}
                            <span className="marketing-text-gradient">
                                livrer sereinement
                            </span>
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-aristech-text">
                            Une méthodologie éprouvée, transparente, où chaque
                            jalon s&apos;accompagne de livrables concrets et
                            validés ensemble.
                        </p>
                    </div>

                    <div className="relative lg:col-span-5">
                        <div className="overflow-hidden rounded-2xl border border-aristech-border shadow-md shadow-slate-900/5">
                            <img
                                src={aristechStock.about.processBanner}
                                alt="Atelier de cadrage projet chez ArisTech"
                                width={1200}
                                height={800}
                                loading="lazy"
                                className="aspect-[4/3] h-auto w-full object-cover"
                            />
                        </div>
                    </div>
                </Reveal>

                <ol className="relative space-y-12 md:space-y-16">
                    <div
                        className="pointer-events-none absolute top-0 left-6 hidden h-full w-px bg-linear-to-b from-aristech-accent/40 via-aristech-border to-transparent md:block"
                        aria-hidden
                    />

                    {aristechProcess.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <Reveal
                                key={step.number}
                                delay={index * 80}
                                className="relative"
                            >
                                <li className="group relative grid gap-6 md:grid-cols-[3rem_1fr] md:gap-8">
                                    <div className="relative flex md:justify-center">
                                        <span className="relative z-10 inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-aristech-border bg-aristech-surface text-aristech-accent shadow-md shadow-slate-900/5 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                                            <Icon
                                                className="size-5"
                                                strokeWidth={2}
                                                aria-hidden
                                            />
                                        </span>
                                    </div>

                                    <div className="marketing-card flex-1">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex items-baseline gap-3">
                                                <span className="font-heading text-sm font-bold text-aristech-accent">
                                                    {step.number}
                                                </span>
                                                <h3 className="font-heading text-xl font-semibold text-aristech-heading md:text-2xl">
                                                    {step.title}
                                                </h3>
                                            </div>
                                            <span className="rounded-full border border-aristech-border bg-aristech-bg px-3 py-1 text-xs font-medium text-aristech-muted">
                                                {step.duration}
                                            </span>
                                        </div>

                                        <p className="mt-4 text-sm leading-relaxed md:text-base">
                                            {step.description}
                                        </p>

                                        <ul className="mt-6 flex flex-wrap gap-2">
                                            {step.deliverables.map((item) => (
                                                <li
                                                    key={item}
                                                    className="rounded-md border border-aristech-border bg-aristech-surface-elevated px-3 py-1.5 text-xs font-medium text-aristech-heading"
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            </Reveal>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}
