import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import SeoHead from '@/components/marketing/seo-head';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';
import type { SuperSecuriteConfig } from '@/types/super-securite';

type Benefit = { title: string; description: string };

type JobOfferRow = {
    uuid: string;
    slug: string;
    title: string;
    location: string;
    contract_type: string;
    excerpt: string | null;
};

type Props = {
    offers: JobOfferRow[];
};

type SharedPageProps = {
    superSecurite: SuperSecuriteConfig;
};

const rhPhones = ['+224 613207531', '+224 623933385'] as const;
const rhEmail = 'rh@supersecurite.com';

const careerImages = {
    team: '/images/super-securite/visuels-2026/equipe-chemises-original.jpeg',
    training: '/images/super-securite/formation-agents-salle-cours.jpeg',
    briefing: '/images/super-securite/agents-securite-briefing-exterieur.jpeg',
    round: '/images/super-securite/agents-super-securite-ronde-site-exterieur.jpeg',
} as const;

function phoneHref(phone: string): string {
    return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

function offerIndex(index: number): string {
    return String(index + 1).padStart(2, '0');
}

function padCount(count: number): string {
    return String(count).padStart(2, '0');
}

export default function MarketingCarrieres({ offers }: Props) {
    const { superSecurite } = usePage<SharedPageProps>().props;
    const { t, tNode } = useTrans();
    const lp = useLocalizedUrl();
    const benefits = tNode<Benefit[]>('recruitment_v2.benefits', []);

    return (
        <div className="carrieres-index">
            <SeoHead />
            <section className="contact-v2-hero">
                <img
                    src="/images/super-securite/visuels-2026/noir/recruitment-v2-hero.jpg"
                    alt=""
                    width={1980}
                    height={794}
                    fetchPriority="high"
                />
                <div className="contact-v2-container">
                    <p className="contact-v2-eyebrow">
                        {t('recruitment_v2.label')}
                    </p>
                    <h1>
                        {t('recruitment_v2.title_lead')}
                        <strong>{t('recruitment_v2.title_accent')}</strong>
                    </h1>
                    <p>{t('recruitment_v2.description')}</p>
                </div>
            </section>

            <section
                id="offres"
                className="carrieres-offers"
                aria-labelledby="carrieres-offers-title"
            >
                <div className="carrieres-wrap">
                    <header className="carrieres-offers-intro">
                        <h2 id="carrieres-offers-title">
                            {t('carrieres.offers_title', "Offres d'emploi")}
                        </h2>
                        <p className="carrieres-offers-count">
                            {padCount(offers.length)}
                            <span>
                                {offers.length === 1
                                    ? t('carrieres.open_count_one', 'ouvert')
                                    : t(
                                        'carrieres.open_count_label',
                                        'ouverts',
                                    )}
                            </span>
                        </p>
                    </header>

                    {offers.length === 0 ? (
                        <p className="carrieres-empty" role="status">
                            {t(
                                'carrieres.offers_empty',
                                'Aucune offre ouverte pour le moment. Revenez bientôt.',
                            )}{' '}
                            <a href={`mailto:${rhEmail}`}>{rhEmail}</a>
                        </p>
                    ) : (
                        <>
                            <div
                                className="carrieres-offers-head"
                                aria-hidden="true"
                            >
                                <span>
                                    {t('carrieres.role_label', 'Poste')}
                                </span>
                                <span>
                                    {t('carrieres.location_label', 'Lieu')}
                                </span>
                                <span>
                                    {t('carrieres.contract_label', 'Contrat')}
                                </span>
                                <span />
                            </div>
                            <ul className="carrieres-offers-list">
                                {offers.map((offer, index) => (
                                    <li
                                        className="carrieres-offer"
                                        key={offer.uuid}
                                    >
                                        <div className="carrieres-offer-main">
                                            <span className="carrieres-offer-index">
                                                {offerIndex(index)}
                                            </span>
                                            <div>
                                                <h3>{offer.title}</h3>
                                                {offer.excerpt ? (
                                                    <p>{offer.excerpt}</p>
                                                ) : null}
                                            </div>
                                        </div>
                                        <p className="carrieres-offer-meta">
                                            <span className="carrieres-offer-key">
                                                {t(
                                                    'carrieres.location_label',
                                                    'Lieu',
                                                )}
                                            </span>
                                            {offer.location}
                                        </p>
                                        <p className="carrieres-offer-meta">
                                            <span className="carrieres-offer-key">
                                                {t(
                                                    'carrieres.contract_label',
                                                    'Contrat',
                                                )}
                                            </span>
                                            {offer.contract_type}
                                        </p>
                                        <Link
                                            className="home-v2-button"
                                            href={lp(
                                                `/carrieres/${offer.slug}/postuler`,
                                            )}
                                            aria-label={`${t('carrieres.apply', 'Postuler')} — ${offer.title}`}
                                        >
                                            {t('carrieres.apply', 'Postuler')}
                                            <ArrowRight
                                                size={16}
                                                aria-hidden="true"
                                            />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </section>

            <section
                className="carrieres-reach"
                aria-labelledby="carrieres-rh-title"
            >
                <div className="carrieres-wrap carrieres-reach-grid">
                    <div className="carrieres-reach-map">
                        <iframe
                            title={`${t('contact.map_iframe_title')}, ${superSecurite.address}`}
                            src={superSecurite.map.embedUrl}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                        />
                    </div>
                    <div className="carrieres-reach-copy">
                        <div>
                            <p className="carrieres-kicker">
                                {t(
                                    'carrieres.join_title',
                                    'Comment nous rejoindre',
                                )}
                            </p>
                            <h2 id="carrieres-rh-title">
                                {t('carrieres.rh_title', 'Coordonnées RH')}
                            </h2>
                            <p>
                                {t(
                                    'carrieres.join_text',
                                    'Notre siège est situé à :address. Pour une candidature ou une question RH, contactez-nous par téléphone ou par e-mail.',
                                    { address: superSecurite.address },
                                )}
                            </p>
                        </div>
                        <dl>
                            <div>
                                <dt>
                                    {t('carrieres.address_label', 'Adresse')}
                                </dt>
                                <dd>{superSecurite.address}</dd>
                            </div>
                            <div>
                                <dt>
                                    {t('carrieres.phone_label', 'Téléphone')}
                                </dt>
                                <dd className="carrieres-reach-phones">
                                    {rhPhones.map((phone) => (
                                        <a key={phone} href={phoneHref(phone)}>
                                            {phone}
                                        </a>
                                    ))}
                                </dd>
                            </div>
                            <div>
                                <dt>{t('carrieres.email_label', 'E-mail')}</dt>
                                <dd>
                                    <a href={`mailto:${rhEmail}`}>{rhEmail}</a>
                                </dd>
                            </div>
                        </dl>
                        <a
                            className="carrieres-directions"
                            href={superSecurite.map.directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t('contact.map_open_maps')}
                            <ArrowUpRight size={16} aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
