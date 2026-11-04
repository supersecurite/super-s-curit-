import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    GraduationCap,
    Handshake,
    ShieldCheck,
    Users,
} from 'lucide-react';
import RecruitmentV2Hero from '@/components/marketing/recruitment-v2-hero';
import SeoHead from '@/components/marketing/seo-head';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';

type Benefit = { title: string; description: string };

type JobOfferRow = {
    uuid: string;
    slug: string;
    title: string;
    location: string;
    contract_type: string;
};

type Props = {
    offers: JobOfferRow[];
};

export default function MarketingCarrieres({ offers }: Props) {
    const { t, tNode } = useTrans();
    const lp = useLocalizedUrl();
    const benefits = tNode<Benefit[]>('recruitment_v2.benefits', []);
    const icons = [GraduationCap, Users, Handshake, ShieldCheck];

    return (
        <div className="recruitment-v2">
            <SeoHead />
            <RecruitmentV2Hero offersAnchor />
            <section className="recruitment-v2-benefits recruitment-v2-container">
                {benefits.map((benefit, index) => {
                    const Icon = icons[index % icons.length];

                    return (
                        <div key={benefit.title}>
                            <Icon
                                size={34}
                                strokeWidth={1.6}
                                aria-hidden="true"
                            />
                            <h2>{benefit.title}</h2>
                            <p>{benefit.description}</p>
                        </div>
                    );
                })}
            </section>
            <section
                id="offres"
                className="recruitment-v2-offers"
                aria-labelledby="carrieres-offers-title"
            >
                <div className="recruitment-v2-container">
                    <h2 id="carrieres-offers-title">
                        {t('carrieres.offers_title', "Offres d'emploi")}
                    </h2>
                    {offers.length === 0 ? (
                        <p className="recruitment-v2-offers-empty">
                            {t(
                                'carrieres.offers_empty',
                                'Aucune offre ouverte pour le moment. Revenez bientôt.',
                            )}
                        </p>
                    ) : (
                        <ul className="recruitment-v2-offers-list">
                            {offers.map((offer) => (
                                <li key={offer.uuid}>
                                    <div>
                                        <h3>{offer.title}</h3>
                                        <p>
                                            <span>{offer.location}</span>
                                            <span aria-hidden="true"> · </span>
                                            <span>{offer.contract_type}</span>
                                        </p>
                                    </div>
                                    <Link
                                        className="home-v2-button"
                                        href={lp(
                                            `/carrieres/${offer.slug}/postuler`,
                                        )}
                                    >
                                        {t('carrieres.apply', 'Postuler')}
                                        <ArrowRight
                                            size={17}
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </div>
    );
}
