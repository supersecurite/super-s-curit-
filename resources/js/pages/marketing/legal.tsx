import { usePage } from '@inertiajs/react';
import SeoHead from '@/components/marketing/seo-head';
import { useTrans } from '@/hooks/use-trans';
import type { SuperSecuriteConfig } from '@/types/super-securite';

type PageProps = {
    superSecurite: SuperSecuriteConfig;
};

export default function LegalPage() {
    const { superSecurite } = usePage<PageProps>().props;
    const { t } = useTrans();

    return (
        <div className="legal-v2">
            <SeoHead />

            <section className="contact-v2-hero" aria-labelledby="legal-v2-title">
                <img
                    src="/images/super-securite/visuels-2026/noir/contact-v2-hero.jpg"
                    alt=""
                    width={1980}
                    height={794}
                    fetchPriority="high"
                />
                <div className="contact-v2-container">
                    <p className="contact-v2-eyebrow">{t('legal.label')}</p>
                    <h1 id="legal-v2-title">
                        {t('legal.title_lead')}
                        <strong>{t('legal.title_accent')}</strong>
                    </h1>
                    <p>{t('legal.description')}</p>
                </div>
            </section>

            <section className="legal-v2-main">
                <div className="contact-v2-container legal-v2-content">
                    <article className="legal-v2-block">
                        <h2>{t('legal.publisher')}</h2>
                        <p>
                            {t('legal.publisher_body')}
                            <br />
                            {superSecurite.address}
                        </p>
                    </article>

                    {superSecurite.rccm ? (
                        <article className="legal-v2-block">
                            <h2>{t('legal.rccm')}</h2>
                            <p>{superSecurite.rccm}</p>
                        </article>
                    ) : null}

                    <article className="legal-v2-block">
                        <h2>{t('legal.contact')}</h2>
                        <p>
                            <a href={`mailto:${superSecurite.email}`}>
                                {superSecurite.email}
                            </a>
                            {' — '}
                            <a href={superSecurite.phone_href}>
                                {superSecurite.phone}
                            </a>
                        </p>
                    </article>
                </div>
            </section>
        </div>
    );
}
