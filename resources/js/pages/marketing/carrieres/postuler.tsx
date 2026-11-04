import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import SecurityAgentRegistrationForm from '@/components/marketing/security-agent-registration-form';
import SeoHead from '@/components/marketing/seo-head';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';

type JobOfferRow = {
    uuid: string;
    slug: string;
    title: string;
    location: string;
    contract_type: string;
    description: string | null;
};

type Props = {
    jobOffer: JobOfferRow;
};

export default function MarketingCarrieresPostuler({ jobOffer }: Props) {
    const { t } = useTrans();
    const lp = useLocalizedUrl();

    return (
        <div className="recruitment-v2">
            <SeoHead />
            <section className="recruitment-v2-apply-hero recruitment-v2-container">
                <Link
                    className="recruitment-v2-back"
                    href={lp('/carrieres')}
                >
                    <ArrowLeft size={16} aria-hidden="true" />
                    {t('carrieres.back_to_list', 'Retour aux offres')}
                </Link>
                <p className="recruitment-v2-eyebrow">
                    {t('recruitment_v2.label', 'Carrières')}
                </p>
                <h1>{jobOffer.title}</h1>
                <p className="recruitment-v2-apply-meta">
                    <span>{jobOffer.location}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{jobOffer.contract_type}</span>
                </p>
                {jobOffer.description ? (
                    <p className="recruitment-v2-apply-description">
                        {jobOffer.description}
                    </p>
                ) : null}
            </section>
            <section className="recruitment-v2-application">
                <div className="recruitment-v2-container recruitment-v2-apply-form">
                    <div id="candidature" className="recruitment-v2-form">
                        <SecurityAgentRegistrationForm jobOffer={jobOffer} />
                    </div>
                </div>
            </section>
        </div>
    );
}
