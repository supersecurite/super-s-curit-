import { Quote } from 'lucide-react';
import Reveal from '@/components/marketing/reveal';
import { superSecuriteImages } from '@/data/super-securite-images';

export default function FounderSection() {
    return (
        <section className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal>
                    <div className="relative overflow-hidden rounded-3xl border border-super-securite-border bg-super-securite-surface px-6 py-12 shadow-lg shadow-slate-900/5 md:px-12 md:py-16">
                        <div
                            className="marketing-blob bg-super-securite-accent"
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
                                    className="absolute -inset-2 rounded-2xl border-2 border-dashed border-super-securite-accent/40"
                                    aria-hidden
                                />
                                <img
                                    src={superSecuriteImages.brand}
                                    alt="Super Sécurité — sécurité privée à Conakry"
                                    width={224}
                                    height={224}
                                    className="relative size-44 rounded-2xl border border-super-securite-border object-contain p-4 shadow-md lg:size-56"
                                />
                            </div>

                            <div>
                                <p className="marketing-label mb-3">
                                    Notre engagement
                                </p>
                                <h2 className="font-heading text-3xl font-bold tracking-tight text-super-securite-heading md:text-4xl">
                                    Le meilleur pour votre sécurité
                                </h2>

                                <figure className="mt-6">
                                    <Quote
                                        className="size-8 text-super-securite-accent/40"
                                        aria-hidden
                                    />
                                    <blockquote className="mt-2 font-heading text-lg leading-relaxed text-super-securite-heading md:text-xl">
                                        « La sécurité est un besoin
                                        fondamental. Nous protégeons ce qui
                                        compte le plus pour vous, 24h/24 et
                                        7j/7. »
                                    </blockquote>
                                    <figcaption className="mt-4 text-sm text-super-securite-muted">
                                        Super Sécurité — Conakry, Guinée
                                    </figcaption>
                                </figure>

                                <p className="mt-6 text-sm leading-relaxed md:text-base">
                                    Depuis 2020, Super Sécurité accompagne
                                    entreprises et particuliers avec du
                                    gardiennage, de la surveillance industrielle
                                    et de la sécurité événementielle. Une équipe
                                    certifiée, réactive et disponible en
                                    permanence à Lambanyi et sur l&apos;ensemble
                                    de Conakry.
                                </p>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
