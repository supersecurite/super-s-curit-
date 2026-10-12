import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Phone } from 'lucide-react';
import Reveal from '@/components/marketing/reveal';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';
import type { SuperSecuriteConfig } from '@/types/super-securite';

type SharedPageProps = {
    superSecurite: SuperSecuriteConfig;
};

export default function CtaBand() {
    const { superSecurite } = usePage<SharedPageProps>().props;
    const { t } = useTrans();
    const localized = useLocalizedUrl();

    return (
        <section className="py-16 md:py-24">
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
                                    {t('contact.hero_label', 'Nous contacter')}
                                </p>
                                <h2 className="font-heading text-3xl font-bold tracking-tight text-super-securite-heading md:text-4xl">
                                    {t('contact.hero_title_lead', 'Parlons de votre')}{' '}
                                    <span className="text-black">
                                        {t(
                                            'contact.hero_title_highlight',
                                            'sécurité',
                                        )}
                                    </span>
                                </h2>
                                <p className="mt-4 text-sm leading-relaxed md:text-base">
                                    {t('contact.hero_description')}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={superSecurite.phone_href}
                                    className="marketing-cta-primary marketing-magnetic inline-flex items-center gap-2"
                                >
                                    <Phone className="size-4" />
                                    {t('home.cta_call', 'Appeler')}
                                </a>
                                <Link
                                    href={localized('/contact')}
                                    className="marketing-cta-secondary marketing-magnetic group inline-flex items-center gap-2"
                                >
                                    {t('home.cta_write', 'Ecrivez-nous')}
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
