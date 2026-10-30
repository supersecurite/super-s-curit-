import { ArrowRight } from 'lucide-react';
import { useTrans } from '@/hooks/use-trans';

/** Hero commun ; la confirmation garde son unique h1 dans le message de résultat. */
export default function RecruitmentV2Hero({
    confirmation = false,
}: {
    confirmation?: boolean;
}) {
    const { t } = useTrans();
    const Heading = confirmation ? 'p' : 'h1';

    return (
        <section className="recruitment-v2-hero">
            <img
                src={
                    confirmation
                        ? '/images/super-securite/zones-minieres-v2-hero.jpg'
                        : '/images/super-securite/recruitment-v2-hero.jpg'
                }
                alt=""
                width={1980}
                height={794}
                fetchPriority="high"
            />
            <div className="recruitment-v2-container">
                <p className="recruitment-v2-eyebrow">
                    {t('recruitment_v2.label')}
                </p>
                <Heading className="recruitment-v2-hero-title">
                    {t('recruitment_v2.title_lead')}
                    <strong>{t('recruitment_v2.title_accent')}</strong>
                </Heading>
                <p className="recruitment-v2-hero-description">
                    {t('recruitment_v2.description')}
                </p>
                {!confirmation && (
                    <a className="home-v2-button" href="#candidature">
                        {t('recruitment_v2.apply')}
                        <ArrowRight size={17} aria-hidden="true" />
                    </a>
                )}
            </div>
        </section>
    );
}
