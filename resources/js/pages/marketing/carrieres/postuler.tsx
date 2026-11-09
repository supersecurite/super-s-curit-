import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Briefcase,
    Mail,
    MapPin,
    Phone,
} from 'lucide-react';
import ContentRenderer from '@/components/lexical-editor/content-renderer';
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

const rhPhones = ['+224 613207531', '+224 623933385'] as const;
const rhEmail = 'rh@supersecurite.com';

function phoneHref(phone: string): string {
    return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export default function MarketingCarrieresPostuler({ jobOffer }: Props) {
    const { t } = useTrans();
    const lp = useLocalizedUrl();

    return (
        <div className="resources-v2 resource-v2-detail carrieres-offer-detail">
            <SeoHead />
            <section className="resource-v2-detail-hero is-empty">
                <div className="resource-v2-detail-intro">
                    <Link
                        className="resource-v2-back"
                        href={lp('/carrieres')}
                    >
                        <ArrowLeft size={17} aria-hidden="true" />
                        {t('carrieres.back_to_list', 'Retour aux offres')}
                    </Link>
                    <p className="resource-v2-detail-category">
                        {jobOffer.contract_type}
                    </p>
                    <h1>{jobOffer.title}</h1>
                    <div className="resource-v2-metadata">
                        <span>
                            <MapPin size={15} aria-hidden="true" />
                            {jobOffer.location}
                        </span>
                        <span>
                            <Briefcase size={15} aria-hidden="true" />
                            {jobOffer.contract_type}
                        </span>
                    </div>
                </div>
            </section>

            <div className="resources-v2-container resource-v2-reading-grid">
                <article id="resource-v2-content">
                    {jobOffer.description ? (
                        <section
                            className="carrieres-offer-body"
                            aria-labelledby="carrieres-offer-about"
                        >
                            <h2 id="carrieres-offer-about">
                                {t(
                                    'carrieres.offer_about',
                                    'À propos du poste',
                                )}
                            </h2>
                            <ContentRenderer
                                content={jobOffer.description}
                                className="carrieres-offer-richtext"
                            />
                        </section>
                    ) : null}

                    <div id="candidature" className="carrieres-apply-block">
                        <h2>
                            {t(
                                'carrieres.apply_form_title',
                                'Déposer votre candidature',
                            )}
                        </h2>
                        <SecurityAgentRegistrationForm jobOffer={jobOffer} />
                    </div>

                    <Link
                        className="resource-v2-back resource-v2-back-bottom"
                        href={lp('/carrieres')}
                    >
                        <ArrowLeft size={17} aria-hidden="true" />
                        {t('carrieres.back_to_list', 'Retour aux offres')}
                    </Link>
                </article>

                <aside className="resource-v2-sidebar">
                    <div>
                        <h2>
                            {t('carrieres.offer_summary', 'Résumé de l’offre')}
                        </h2>
                        <dl className="carrieres-offer-summary">
                            <div>
                                <dt>
                                    {t('carrieres.role_label', 'Poste')}
                                </dt>
                                <dd>{jobOffer.title}</dd>
                            </div>
                            <div>
                                <dt>
                                    {t('carrieres.location_label', 'Lieu')}
                                </dt>
                                <dd>{jobOffer.location}</dd>
                            </div>
                            <div>
                                <dt>
                                    {t('carrieres.contract_label', 'Contrat')}
                                </dt>
                                <dd>{jobOffer.contract_type}</dd>
                            </div>
                        </dl>
                        <a className="home-v2-button" href="#candidature">
                            {t('carrieres.apply', 'Postuler')}
                            <ArrowRight size={16} aria-hidden="true" />
                        </a>
                    </div>
                    <div>
                        <h2>{t('carrieres.rh_title', 'Coordonnées RH')}</h2>
                        <ul className="carrieres-offer-rh">
                            {rhPhones.map((phone) => (
                                <li key={phone}>
                                    <Phone size={16} aria-hidden="true" />
                                    <a href={phoneHref(phone)}>{phone}</a>
                                </li>
                            ))}
                            <li>
                                <Mail size={16} aria-hidden="true" />
                                <a href={`mailto:${rhEmail}`}>{rhEmail}</a>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
