import { Link } from '@inertiajs/react';
import { ArrowRight, Phone } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import Reveal from '@/components/marketing/reveal';
import { contact } from '@/routes';
import type { SuperSecuriteConfig } from '@/types/super-securite';

type SharedPageProps = {
    superSecurite: SuperSecuriteConfig;
};

export default function CtaBand() {
    const { superSecurite } = usePage<SharedPageProps>().props;

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
                                width: '20rem',
                                height: '20rem',
                                opacity: 0.15,
                            }}
                            aria-hidden
                        />

                        <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
                            <div className="max-w-xl">
                                <p className="marketing-label mb-3">
                                    Contactez-nous
                                </p>
                                <h2 className="font-heading text-3xl font-bold tracking-tight text-super-securite-heading md:text-4xl">
                                    Besoin d&apos;une équipe de{' '}
                                    <span className="marketing-text-gradient">
                                        sécurité ?
                                    </span>
                                </h2>
                                <p className="mt-4 text-sm leading-relaxed md:text-base">
                                    Téléphone : {superSecurite.phone}
                                    <br />
                                    E-mail : {superSecurite.email}
                                    <br />
                                    {superSecurite.address}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={superSecurite.phone_href}
                                    className="marketing-cta-primary marketing-magnetic inline-flex items-center gap-2"
                                >
                                    <Phone className="size-4" />
                                    Appeler
                                </a>
                                <Link
                                    href={contact.url()}
                                    className="marketing-cta-secondary marketing-magnetic group inline-flex items-center gap-2"
                                >
                                    Formulaire
                                    <ArrowRight
                                        className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                                        aria-hidden
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
