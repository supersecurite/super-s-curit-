import { Link } from '@inertiajs/react';
import { ArrowRight, Check, Info, Mail } from 'lucide-react';
import RecruitmentV2Hero from '@/components/marketing/recruitment-v2-hero';
import RecruitmentV2Steps from '@/components/marketing/recruitment-v2-steps';
import SeoHead from '@/components/marketing/seo-head';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';

export default function MarketingDevenirAgentMerci() {
    const { t } = useTrans();
    const lp = useLocalizedUrl();

    return (
        <div className="recruitment-v2 recruitment-v2-confirmation">
            <SeoHead />
            <RecruitmentV2Hero confirmation />
            <section className="recruitment-v2-result recruitment-v2-container">
                <span className="recruitment-v2-success-icon">
                    <Check size={52} strokeWidth={2.5} aria-hidden="true" />
                </span>
                <h1>{t('devenir_agent.thank_you.title')}</h1>
                <p>{t('devenir_agent.thank_you.description')}</p>
            </section>
            <section className="recruitment-v2-container">
                <div className="recruitment-v2-next">
                    <h2>{t('recruitment_v2.next_title')}</h2>
                    <p>{t('recruitment_v2.next_description')}</p>
                    <RecruitmentV2Steps confirmation />
                </div>
                <div className="recruitment-v2-result-actions">
                    <Link className="home-v2-button" href={lp('/')}>
                        {t('devenir_agent.thank_you.home_button')}
                        <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                    <Link
                        className="recruitment-v2-outline"
                        href={lp('/a-propos')}
                    >
                        {t('recruitment_v2.about_button')}
                    </Link>
                </div>
            </section>
            <section className="recruitment-v2-team recruitment-v2-container">
                <img
                    src="/images/super-securite/about-v2-team.jpg"
                    alt={t('recruitment_v2.team_alt')}
                    width={1980}
                    height={794}
                    loading="lazy"
                />
                <div>
                    <h2 className="resource-v2-section-title">
                        {t('recruitment_v2.team_title')}
                    </h2>
                    <p>{t('recruitment_v2.team_description')}</p>
                    <Link
                        className="recruitment-v2-question"
                        href={lp('/contact')}
                    >
                        <Mail size={28} aria-hidden="true" />
                        <span>
                            {t('recruitment_v2.question')}
                            <strong>{t('recruitment_v2.contact')}</strong>
                        </span>
                        <ArrowRight size={20} aria-hidden="true" />
                    </Link>
                </div>
            </section>
            <div className="recruitment-v2-container">
                <p className="recruitment-v2-reminder">
                    <Info size={26} aria-hidden="true" />
                    {t('recruitment_v2.keep_updated')}
                </p>
            </div>
        </div>
    );
}
