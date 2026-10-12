import { usePage } from '@inertiajs/react';
import SeoHead from '@/components/marketing/seo-head';
import PageHero from '@/components/marketing/page-hero';
import Reveal from '@/components/marketing/reveal';
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
            body: t('privacy.rights_body').replace(':email', superSecurite.email),
        },
    ] as const;

    return (
        <>
            <SeoHead />

            <PageHero
                label={t('privacy.label')}
                title={t('privacy.title')}
                description={t('privacy.description')}
                align="center"
            />

            <section className="pb-24">
                <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6 lg:px-8">
                    {sections.map((section, index) => (
                        <Reveal key={section.title} delay={index * 60}>
                            <h2 className="font-heading text-lg font-semibold text-super-securite-heading">
                                {section.title}
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-super-securite-muted">
                                {section.body}
                            </p>
                        </Reveal>
                    ))}
                </div>
            </section>
        </>
    );
}
