import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { superSecuriteWelcome } from '@/data/super-securite-content';
import { superSecuriteHoursShort } from '@/data/super-securite-hours';
import { superSecuriteStock } from '@/data/super-securite-stock';
import Reveal from '@/components/marketing/reveal';
import { about } from '@/routes';

export default function WelcomeSection() {
    return (
        <section id="bienvenue" className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <Reveal delay={200} variant="fade" className="order-2 lg:order-1">
                        <div className="relative overflow-hidden rounded-3xl border border-super-securite-border shadow-lg shadow-slate-900/10">
                            <img
                                src={superSecuriteStock.home.welcome2}
                                alt="Équipe Super Sécurité — sécurité privée à Conakry et région"
                                width={900}
                                height={600}
                                loading="lazy"
                                decoding="async"
                                className="aspect-[4/3] h-auto w-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-900/85 via-slate-900/50 to-transparent p-6 md:p-8">
                                <p className="font-heading text-3xl font-bold tracking-tight text-white md:text-4xl">
                                    {superSecuriteHoursShort}
                                </p>
                                <p className="mt-2 font-heading text-lg font-semibold text-white">
                                    Protection continue
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                                    Une équipe mobilisable à tout moment pour
                                    vos sites, événements et résidences.
                                </p>
                            </div>
                        </div>
                    </Reveal>
                    <Reveal className="order-1 lg:order-2">
                        <p className="marketing-label mb-3">Super SÉCURITÉ</p>
                        <h2 className="marketing-heading-section">
                            {superSecuriteWelcome.title}
                        </h2>
                        {superSecuriteWelcome.paragraphs.map((paragraph) => (
                            <p
                                key={paragraph.slice(0, 40)}
                                className="mt-4 text-sm leading-relaxed md:text-base"
                            >
                                {paragraph}
                            </p>
                        ))}
                        <Link
                            href={about.url()}
                            className="marketing-cta-secondary marketing-magnetic mt-8 inline-flex items-center gap-2"
                        >
                            Découvrez
                            <ArrowRight className="size-4" aria-hidden />
                        </Link>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
