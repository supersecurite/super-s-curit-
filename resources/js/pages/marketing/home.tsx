import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    Clock3,
    Factory,
    Handshake,
    MapPin,
    MonitorCheck,
    Settings2,
    ShieldCheck,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';
import HomeV2ResourceHighlights from '@/components/marketing/home-v2-resource-highlights';
import SeoHead from '@/components/marketing/seo-head';
import { superSecuriteServices } from '@/data/super-securite-content';
import { superSecuritePartners } from '@/data/super-securite-partners';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';
import type { MarketingContentPreview } from '@/types/marketing-content';

type CopyItem = { title: string; description: string };
type Fact = { value: string; label: string };
type HomePageProps = {
    featuredArticles?: MarketingContentPreview[];
    featuredSecurityTips?: MarketingContentPreview[];
    partners?: { name: string; logo: string }[];
};

const images = {
    hero: '/images/super-securite/visuels-2026/home-v2-hero-daylight-shaded.jpg',
    fallback:
        '/images/super-securite/zone-miniere-chargeuse-camion-benne-terre-rouge.jpeg',
    why: '/images/super-securite/visuels-2026/home-v3-fire-training.jpg',
    services: {
        entreprise:
            '/images/super-securite/visuels-2026/agent-chemise-bleue-original.jpeg',
        residence:
            '/images/super-securite/visuels-2026/residence-v2-detail.jpg',
        chantiers:
            '/images/super-securite/visuels-2026/formation-incendie-original.jpeg',
        'zones-minieres':
            '/images/super-securite/zone-miniere-chargeuse-camion-benne-terre-rouge.jpeg',
    },
} as const;

/** Accueil V2 : composition terrain, services et engagements, avec contenus FR/EN/ZH. */
export default function MarketingHome() {
    const { t, tNode } = useTrans();
    const lp = useLocalizedUrl();
    const {
        featuredArticles = [],
        featuredSecurityTips = [],
        partners = [],
    } = usePage<HomePageProps>().props;
    const pillars = tNode<CopyItem[]>('home_v2.pillars', []);
    const facts = tNode<Fact[]>('home_v2.facts', []);
    const values = tNode<CopyItem[]>('home_v2.values', []);
    const partnerList = partners.length ? partners : superSecuritePartners;
    const pillarIcons = [ShieldCheck, Users, Factory, TrendingUp];
    const factIcons = [Clock3, Building2, MapPin, Settings2];
    const valueIcons = [ShieldCheck, Zap, MonitorCheck, Handshake];

    return (
        <div className="home-v2">
            <SeoHead />
            <section className="home-v2-hero" aria-labelledby="home-v2-title">
                <img
                    className="home-v2-hero-photo"
                    src={images.hero}
                    alt=""
                    width={1920}
                    height={840}
                    fetchPriority="high"
                    onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = images.fallback;
                    }}
                />
                <div className="home-v2-hero-inner">
                    <div className="home-v2-hero-copy">
                        <p className="home-v2-eyebrow">
                            <span />
                            {t('home_v2.eyebrow')}
                        </p>
                        <h1 id="home-v2-title">
                            <span className="text-white">
                                {t('home_v2.title_lead')}
                            </span>
                            <strong>{t('home_v2.title_accent')}</strong>
                        </h1>
                        <p className="home-v2-intro">
                            {t('home_v2.description')}
                        </p>
                        <div className="home-v2-hero-actions">
                            <a href="#services" className="home-v2-button">
                                {t('home_v2.services_cta')}
                                <ArrowRight size={18} aria-hidden="true" />
                            </a>
                            <Link
                                href={lp('/contact')}
                                className="home-v2-button home-v2-button-outline"
                            >
                                {t('home_v2.contact_cta')}
                            </Link>
                        </div>
                    </div>
                    <ul className="home-v2-pillars">
                        {pillars.map((pillar, index) => {
                            const Icon = pillarIcons[index];

                            return (
                                <li key={pillar.title}>
                                    <Icon
                                        size={30}
                                        strokeWidth={1.6}
                                        aria-hidden="true"
                                    />
                                    <div>
                                        <span>{pillar.title}</span>
                                        <small>{pillar.description}</small>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </section>
            <section
                id="services"
                className="home-v2-services"
                aria-labelledby="home-v2-services-title"
            >
                <h2 id="home-v2-services-title" className="sr-only">
                    {t('home_v2.services_label')}
                </h2>
                <div className="home-v2-services-grid">
                    {superSecuriteServices.map((service) => {
                        const Icon = service.icon;

                        return (
                            <article
                                className="home-v2-service-card"
                                key={service.id}
                            >
                                <Link
                                    href={lp(service.path)}
                                    className="home-v2-service-image"
                                    tabIndex={-1}
                                    aria-hidden="true"
                                >
                                    <img
                                        src={
                                            images.services[
                                                service.id as keyof typeof images.services
                                            ]
                                        }
                                        alt=""
                                        width={480}
                                        height={280}
                                        loading="lazy"
                                    />
                                </Link>
                                <div className="home-v2-service-body">
                                    <span className="home-v2-service-icon">
                                        <Icon
                                            size={24}
                                            strokeWidth={1.6}
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <h3>
                                        <Link href={lp(service.path)}>
                                            {t(
                                                'services.' +
                                                    service.id +
                                                    '.title',
                                                service.title,
                                            )}
                                        </Link>
                                    </h3>
                                    <p>
                                        {t(
                                            'services.' +
                                                service.id +
                                                '.description',
                                            service.description,
                                        )}
                                    </p>
                                    <Link
                                        href={lp(service.path)}
                                        className="home-v2-text-link"
                                        aria-label={
                                            t('common.learn_more') +
                                            ' — ' +
                                            t(
                                                'services.' +
                                                    service.id +
                                                    '.title',
                                                service.title,
                                            )
                                        }
                                    >
                                        {t('common.learn_more')}
                                        <ArrowRight
                                            size={15}
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                    <div className="home-v2-facts">
                        {facts.map((fact, index) => {
                            const Icon = factIcons[index];

                            return (
                                <div className="home-v2-fact" key={fact.label}>
                                    <span className="home-v2-fact-icon">
                                        <Icon
                                            size={25}
                                            strokeWidth={1.5}
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <div>
                                        <strong>{fact.value}</strong>
                                        <span>{fact.label}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
            <section
                id="references"
                className="home-v2-partners"
                aria-label={t('home_v2.partners_label')}
            >
                <div className="home-v2-partners-inner">
                    <h2>
                        {t('home_v2.partners_label')}
                        <span />
                    </h2>
                    <div className="home-v2-partner-logos">
                        {partnerList.map((partner) => (
                            <img
                                key={partner.name}
                                src={partner.logo}
                                alt={partner.name}
                                width={150}
                                height={150}
                                loading="lazy"
                            />
                        ))}
                    </div>
                </div>
            </section>
            <section
                className="home-v2-why"
                aria-labelledby="home-v2-why-title"
            >
                <div className="home-v2-why-story">
                    <img
                        src={images.why}
                        alt=""
                        width={800}
                        height={600}
                        loading="lazy"
                    />
                    <div
                        className="home-v2-why-story-shade"
                        aria-hidden="true"
                    />
                    <div className="home-v2-why-copy">
                        <p className="home-v2-eyebrow">
                            <span />
                            {t('home_v2.why_label')}
                        </p>
                        <h2 id="home-v2-why-title">{t('home_v2.why_title')}</h2>
                        <p>{t('home_v2.why_description')}</p>
                    </div>
                </div>
                <div className="home-v2-values">
                    {values.map((value, index) => {
                        const Icon = valueIcons[index];

                        return (
                            <div className="home-v2-value" key={value.title}>
                                <span>
                                    <Icon
                                        size={27}
                                        strokeWidth={1.6}
                                        aria-hidden="true"
                                    />
                                </span>
                                <div>
                                    <h3>{value.title}</h3>
                                    <p>{value.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
            <HomeV2ResourceHighlights
                articles={featuredArticles}
                tips={featuredSecurityTips}
            />
        </div>
    );
}
