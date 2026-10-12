import { usePage } from '@inertiajs/react';
import SeoHead from '@/components/marketing/seo-head';
import PageHero from '@/components/marketing/page-hero';
import Reveal from '@/components/marketing/reveal';
import { useTrans } from '@/hooks/use-trans';
import type { SuperSecuriteConfig } from '@/types/super-securite';

type PageProps = {
    superSecurite: SuperSecuriteConfig;
};

export default function LegalPage() {
    const { superSecurite } = usePage<PageProps>().props;
    const { t } = useTrans();

    return (
        <>
            <SeoHead />

            <PageHero
                label={t('legal.label')}
                title={t('legal.title')}
                description={t('legal.description')}
                align="center"
            />

            <section className="pb-24">
                <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6 lg:px-8 text-sm leading-relaxed text-super-securite-muted">
                    <Reveal>
                        <p>
                            <strong className="text-super-securite-heading">{t('legal.publisher')} :</strong>{' '}
                            {t('legal.publisher_body')}
                            <br />
                            {superSecurite.address}
                        </p>
                    </Reveal>
                    {superSecurite.rccm && (
                        <Reveal delay={60}>
                            <p>
                                <strong className="text-super-securite-heading">{t('legal.rccm')} :</strong>{' '}
                                {superSecurite.rccm}
                            </p>
                        </Reveal>
                    )}
                    <Reveal delay={120}>
                        <p>
                            <strong className="text-super-securite-heading">{t('legal.contact')} :</strong>{' '}
                            <a href={`mailto:${superSecurite.email}`} className="text-super-securite-accent">
                                {superSecurite.email}
                            </a>{' '}
                            —{' '}
                            <a href={superSecurite.phone_href} className="text-super-securite-accent">
                                {superSecurite.phone}
                            </a>
                        </p>
                    </Reveal>
                    <Reveal delay={180}>
                        <p>
                            <strong className="text-super-securite-heading">
                                {t('legal.director', 'Directeur de publication')} :
                            </strong>{' '}
                            Aristide Gnimassou.
                        </p>
                    </Reveal>
                    <Reveal delay={240}>
                        <p>
                            <strong className="text-super-securite-heading">{t('legal.hosting')} :</strong>{' '}
                            {t('legal.hosting_body', 'Hostinger International Ltd. — site accessible via HTTPS.')}
                        </p>
                    </Reveal>
                </div>
            </section>
        </>
    );
}
