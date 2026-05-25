import { Quote } from 'lucide-react';
import Reveal from '@/components/marketing/reveal';
import { aristechImages } from '@/data/aristech-images';

export default function FounderSection() {
    return (
        <section className="py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal>
                    <div className="relative overflow-hidden rounded-3xl border border-aristech-border bg-aristech-surface px-6 py-12 shadow-lg shadow-slate-900/5 md:px-12 md:py-16">
                        <div
                            className="marketing-blob bg-aristech-accent"
                            style={{
                                top: '-4rem',
                                right: '-4rem',
                                width: '18rem',
                                height: '18rem',
                                opacity: 0.16,
                            }}
                            aria-hidden
                        />

                        <div className="relative grid items-center gap-10 md:grid-cols-[12rem_1fr] md:gap-12 lg:grid-cols-[14rem_1fr]">
                            <div className="relative mx-auto md:mx-0">
                                <div
                                    className="absolute -inset-2 rounded-2xl border-2 border-dashed border-aristech-accent/40"
                                    aria-hidden
                                />
                                <img
                                    src={aristechImages.founder}
                                    alt="Aristide Gnimassou, fondateur d'ArisTech"
                                    width={224}
                                    height={224}
                                    className="relative size-44 rounded-2xl border border-aristech-border object-cover shadow-md lg:size-56"
                                />
                            </div>

                            <div>
                                <p className="marketing-label mb-3">
                                    Fondateur &amp; développeur principal
                                </p>
                                <h2 className="font-heading text-3xl font-bold tracking-tight text-aristech-heading md:text-4xl">
                                    Aristide Gnimassou
                                </h2>

                                <figure className="mt-6">
                                    <Quote
                                        className="size-8 text-aristech-accent/40"
                                        aria-hidden
                                    />
                                    <blockquote className="mt-2 font-heading text-lg leading-relaxed text-aristech-heading md:text-xl">
                                        « Mon métier, c&apos;est traduire une
                                        vision en produit qui fonctionne. Sans
                                        jargon, sans surpromesse — juste du code
                                        propre qui sert vos utilisateurs. »
                                    </blockquote>
                                    <figcaption className="mt-4 text-sm text-aristech-muted">
                                        Aristide, sur sa façon de travailler
                                    </figcaption>
                                </figure>

                                <p className="mt-6 text-sm leading-relaxed md:text-base">
                                    Développeur full-stack passionné par les
                                    produits qui résolvent de vrais problèmes,
                                    Aristide dirige ArisTech depuis 2020. Il
                                    code lui-même la majorité des projets et
                                    s&apos;entoure d&apos;experts (design,
                                    DevOps, mobile) pour les missions
                                    nécessitant plus de spécialisation.
                                </p>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
