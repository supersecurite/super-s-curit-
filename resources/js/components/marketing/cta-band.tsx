import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/marketing/reveal';
import { contact } from '@/routes';

export default function CtaBand() {
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
                                width: '20rem',
                                height: '20rem',
                                opacity: 0.18,
                            }}
                            aria-hidden
                        />
                        <div
                            className="marketing-blob bg-sky-400"
                            style={{
                                bottom: '-6rem',
                                left: '-4rem',
                                width: '18rem',
                                height: '18rem',
                                opacity: 0.15,
                                animationDelay: '-8s',
                            }}
                            aria-hidden
                        />

                        <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
                            <div className="max-w-xl">
                                <p className="marketing-label mb-3">
                                    Prochaine étape
                                </p>
                                <h2 className="font-heading text-3xl font-bold tracking-tight text-aristech-heading md:text-4xl">
                                    Un projet en tête ?{' '}
                                    <span className="marketing-text-gradient">
                                        Discutons-en.
                                    </span>
                                </h2>
                                <p className="mt-4 text-sm leading-relaxed md:text-base">
                                    Décrivez votre besoin — nous vous répondons
                                    avec une approche technique claire et un
                                    devis adapté.
                                </p>
                            </div>
                            <Link
                                href={contact.url()}
                                className="marketing-cta-primary marketing-magnetic group inline-flex shrink-0 items-center gap-2"
                            >
                                Démarrer la conversation
                                <ArrowRight
                                    className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                                    aria-hidden
                                />
                            </Link>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
