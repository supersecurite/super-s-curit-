import { usePage } from '@inertiajs/react';
import SeoHead from '@/components/marketing/seo-head';
import ContactChannels from '@/components/marketing/contact-channels';
import ContactFaq from '@/components/marketing/contact-faq';
import ContactForm from '@/components/marketing/contact-form';
import PageHero from '@/components/marketing/page-hero';
import Reveal from '@/components/marketing/reveal';
import { aristechStock } from '@/data/aristech-stock';
import type { AristechConfig } from '@/types/aristech';

type SharedPageProps = {
    aristech: AristechConfig;
};

export default function MarketingContact() {
    const { aristech } = usePage<SharedPageProps>().props;

    return (
        <>
            <SeoHead />

            <PageHero
                label="Contact"
                title={
                    <>
                        Parlons de{' '}
                        <span className="marketing-text-gradient">
                            votre projet
                        </span>
                    </>
                }
                description="Besoin d'un devis pour un site web, une application ou une intégration de solutions à Conakry ? Décrivez votre projet : réponse sous 24 h ouvrées et cadrage gratuit."
                media={
                    <div className="relative mx-auto w-full max-w-lg">
                        <div
                            className="absolute -inset-4 rounded-3xl border border-dashed border-aristech-border/60"
                            aria-hidden
                        />
                        <div className="relative overflow-hidden rounded-3xl border border-aristech-border bg-aristech-surface shadow-xl shadow-slate-900/10">
                            <img
                                src={aristechStock.contact.heroSide}
                                alt="Réunion client chez ArisTech"
                                width={1200}
                                height={900}
                                className="aspect-[4/3] h-auto w-full object-cover"
                                fetchPriority="high"
                            />
                            <div
                                className="pointer-events-none absolute inset-0 bg-linear-to-t from-aristech-heading/30 via-transparent to-transparent"
                                aria-hidden
                            />
                        </div>
                    </div>
                }
            ></PageHero>

            <section className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="mb-12 max-w-2xl">
                        <p className="marketing-label mb-3">Canaux directs</p>
                        <h2 className="marketing-heading-section">
                            Choisissez le moyen{' '}
                            <span className="marketing-text-gradient">
                                qui vous convient
                            </span>
                        </h2>
                    </Reveal>

                    <ContactChannels aristech={aristech} />

                    {aristech.rccm && (
                        <Reveal delay={200} className="mt-10">
                            <p className="text-sm text-aristech-muted">
                                <span className="font-medium text-aristech-heading">
                                    ArisTech
                                </span>{' '}
                                · Conakry, Guinée · RCCM : {aristech.rccm}
                            </p>
                        </Reveal>
                    )}
                </div>
            </section>

            <section className="">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
                        <Reveal className="lg:col-span-3">
                            <ContactForm />
                        </Reveal>

                        <Reveal delay={150} className="lg:col-span-2">
                            <div className="sticky top-28 flex flex-col gap-6">
                                {/* <div className="relative overflow-hidden rounded-2xl border border-aristech-border shadow-md shadow-slate-900/5">
                                    <img
                                        src={aristechStock.contact.sidePanel}
                                        alt="Équipe ArisTech disponible pour répondre"
                                        width={900}
                                        height={600}
                                        loading="lazy"
                                        className="aspect-[3/3] h-auto w-full object-cover"
                                    />
                                    <div
                                        className="pointer-events-none absolute inset-0 bg-linear-to-t from-aristech-heading/60 via-aristech-heading/10 to-transparent"
                                        aria-hidden
                                    />
                                    <div className="absolute right-4 bottom-4 left-4">
                                        <p className="font-heading text-sm font-semibold text-white">
                                            Une vraie équipe à votre écoute
                                        </p>
                                        <p className="mt-1 text-xs text-white/80">
                                            Pas de robot, pas de centre
                                            d&apos;appel.
                                        </p>
                                    </div>
                                </div> */}

                                <div className="marketing-card">
                                    <p className="marketing-label mb-3">
                                        À quoi vous attendre ?
                                    </p>
                                    <h3 className="font-heading text-xl font-semibold text-aristech-heading">
                                        Notre processus en 4 étapes
                                    </h3>
                                    <ol className="mt-6 space-y-5">
                                        {[
                                            {
                                                step: '01',
                                                title: 'Réception',
                                                desc: 'Nous lisons votre message attentivement.',
                                            },
                                            {
                                                step: '02',
                                                title: 'Premier échange',
                                                desc: 'Un appel de 30 min pour cadrer vos besoins.',
                                            },
                                            {
                                                step: '03',
                                                title: 'Proposition',
                                                desc: 'Devis détaillé avec périmètre et planning.',
                                            },
                                            {
                                                step: '04',
                                                title: 'Lancement',
                                                desc: 'Démarrage du projet sous 1 à 2 semaines.',
                                            },
                                        ].map((item) => (
                                            <li
                                                key={item.step}
                                                className="flex gap-4"
                                            >
                                                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-aristech-accent/10 font-heading text-sm font-bold text-aristech-accent">
                                                    {item.step}
                                                </span>
                                                <div>
                                                    <p className="font-heading text-sm font-semibold text-aristech-heading">
                                                        {item.title}
                                                    </p>
                                                    <p className="mt-1 text-sm text-aristech-muted">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </div>

                                {aristech.rccm && (
                                    <div className="marketing-card bg-aristech-surface-elevated">
                                        <p className="marketing-label mb-3">
                                            Informations légales
                                        </p>
                                        <p className="text-sm leading-relaxed text-aristech-text">
                                            ArisTech · Conakry, Guinée
                                        </p>
                                        <p className="mt-2 font-heading text-sm font-semibold text-aristech-heading">
                                            RCCM : {aristech.rccm}
                                        </p>
                                    </div>
                                )}

                                <div className="marketing-card bg-aristech-surface-elevated">
                                    <p className="marketing-label mb-3">
                                        Confidentialité
                                    </p>
                                    <p className="text-sm leading-relaxed text-aristech-text">
                                        Vos informations ne sont utilisées que
                                        pour vous répondre. Nous signons
                                        volontiers un NDA si votre projet
                                        l&apos;exige.
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            <ContactFaq />
        </>
    );
}
