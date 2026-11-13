import { usePage } from '@inertiajs/react';
import SeoHead from '@/components/marketing/seo-head';
import { useTrans } from '@/hooks/use-trans';
import type { SuperSecuriteConfig } from '@/types/super-securite';

type PageProps = {
    superSecurite: SuperSecuriteConfig;
};

export default function PrivacyPage() {
    const { superSecurite } = usePage<PageProps>().props;
    const { t } = useTrans();

    const sections = [
        {
            title: t('privacy.controller_title'),
            body: t('privacy.controller_body')
                .replace(':address', superSecurite.address)
                .replace(':email', superSecurite.email),
        },
        {
            title: t('privacy.data_title'),
            body: t('privacy.data_body'),
        },
        {
            title: t('privacy.purpose_title'),
            body: t('privacy.purpose_body'),
        },
        {
            title: t('privacy.cookies_title'),
            body: t('privacy.cookies_body'),
        },
        {
            title: t('privacy.retention_title'),
            body: t('privacy.retention_body'),
        },
        {
            title: t('privacy.rights_title'),
            body: t('privacy.rights_body').replace(
                ':email',
                superSecurite.email,
            ),
        },
    ] as const;

    return (
        <div className="legal-v2">
            <SeoHead />

            <section
                className="contact-v2-hero"
                aria-labelledby="privacy-v2-title"
            >
                <img
                    src="/images/super-securite/visuels-2026/noir/contact-v2-hero.jpg"
                    alt=""
                    width={1980}
                    height={794}
                    fetchPriority="high"
                />
                <div className="contact-v2-container">
                    <p className="contact-v2-eyebrow">{t('privacy.label')}</p>
                    <h1 id="privacy-v2-title">
                        {t('privacy.title_lead')}
                        <strong>{t('privacy.title_accent')}</strong>
                    </h1>
                    <p>{t('privacy.description')}</p>
                </div>
            </section>

            <section className="legal-v2-main">
                <div className="contact-v2-container legal-v2-content">
                    {sections.map((section) => (
                        <article className="legal-v2-block" key={section.title}>
                            <h2>{section.title}</h2>
                            <p>{section.body}</p>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}
