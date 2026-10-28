import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Play,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Grid2X2,
    Handshake,
    MapPin,
    Settings2,
    ShieldCheck,
    UserCheck,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import SeoHead from '@/components/marketing/seo-head';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';
import { useWhyUsContent } from '@/hooks/use-why-us-content';
import type { GalleryVideoPublic } from '@/types/gallery';

type PageProps = { featuredVideo?: GalleryVideoPublic | null };
type CopyItem = { title: string; description: string };
type Fact = { value: string; label: string };

/** Présentation V2 : approche, valeurs, organisation et suivi des prestations. */
export default function MarketingAbout() {
    const { featuredVideo } = usePage<PageProps>().props;
    const { t, tNode } = useTrans();
    const lp = useLocalizedUrl();
    const whyUs = useWhyUsContent();
    const [videoPlaying, setVideoPlaying] = useState(false);
    const facts = tNode<Fact[]>('home_v2.facts', []);
    const values = tNode<CopyItem[]>('about_v2.values', []);
    const steps = tNode<CopyItem[]>('about_v2.steps', []);
    const factIcons = [Clock3, Grid2X2, MapPin, Settings2];
    const valueIcons = [UserCheck, ShieldCheck, Zap, Handshake];

    return (
        <div className="about-v2">
            <SeoHead />
            <section className="about-v2-hero" aria-labelledby="about-v2-title">
                <img
                    src="/images/super-securite/about-v2-team.jpg"
                    alt=""
                    width={1980}
                    height={794}
                    fetchPriority="high"
                />
                <div className="about-v2-container about-v2-hero-inner">
                    <div className="about-v2-hero-copy">
                        <p className="about-v2-eyebrow">
                            {t('about_v2.hero_label')}
                        </p>
                        <h1 id="about-v2-title">
                            {t('about_v2.title_lead')}
                            <strong>{t('about_v2.title_accent')}</strong>
                        </h1>
                        <p>{t('about_v2.hero_description')}</p>
                        <div className="about-v2-hero-actions">
                            <a href="#valeurs" className="home-v2-button">
                                {t('about_v2.values_cta')}
                                <ArrowRight size={17} aria-hidden="true" />
                            </a>
                            <Link
                                href={lp('/contact')}
                                className="home-v2-button home-v2-button-outline"
                            >
                                {t('home_v2.contact_cta')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="about-v2-facts"
                aria-label={t('about_v2.facts_label')}
            >
                <div className="about-v2-container about-v2-facts-grid">
                    {facts.map((fact, index) => {
                        const Icon = factIcons[index % factIcons.length];

                        return (
                            <div className="about-v2-fact" key={fact.label}>
                                <Icon
                                    size={38}
                                    strokeWidth={1.6}
                                    aria-hidden="true"
                                />
                                <div>
                                    <strong>{fact.value}</strong>
                                    <span>{fact.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section
                className="about-v2-container about-v2-approach"
                aria-labelledby="about-approach-title"
            >
                <div>
                    <p className="about-v2-eyebrow">
                        {t('about_v2.approach_label')}
                    </p>
                    <h2 id="about-approach-title">
                        {t('about_v2.approach_lead')}
                        <strong>{t('about_v2.approach_accent')}</strong>
                    </h2>
                    <p>{t('about_v2.approach_description')}</p>
                    <p>{t('about_v2.approach_followup')}</p>
                </div>
                <img
                    src="/images/super-securite/about-v2-supervision.jpg"
                    alt={t('about_v2.approach_image_alt')}
                    width={1564}
                    height={1006}
                    loading="lazy"
                />
            </section>

            <section
                id="valeurs"
                className="about-v2-container about-v2-values"
                aria-label={t('about_v2.values_cta')}
            >
                {values.map((value, index) => {
                    const Icon = valueIcons[index % valueIcons.length];

                    return (
                        <article key={value.title}>
                            <Icon
                                size={39}
                                strokeWidth={1.6}
                                aria-hidden="true"
                            />
                            <h2>{value.title}</h2>
                            <p>{value.description}</p>
                        </article>
                    );
                })}
            </section>

            <section
                className="about-v2-method"
                aria-labelledby="about-method-title"
            >
                <div className="about-v2-container about-v2-method-grid">
                    <div>
                        <p className="about-v2-eyebrow">
                            {t('about_v2.method_label')}
                        </p>
                        <h2 id="about-method-title">
                            {t('about_v2.method_title')}
                        </h2>
                        <p>{t('about_v2.method_description')}</p>
                    </div>
                    <ol className="about-v2-steps">
                        {steps.map((step, index) => (
                            <li key={step.title}>
                                <span>{index + 1}</span>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section
                className="about-v2-container about-v2-tools"
                aria-labelledby="about-tools-title"
            >
                <div className="about-v2-app-image">
                    <img
                        src="/images/super-securite/about/super-secu-App.jpeg"
                        alt={t('about_v2.app_image_alt')}
                        width={1122}
                        height={1402}
                        loading="lazy"
                    />
                </div>
                <div>
                    <p className="about-v2-eyebrow">
                        {t('about_v2.tools_label')}
                    </p>
                    <h2 id="about-tools-title">{t('about_v2.tools_title')}</h2>
                    <p>{t('about_v2.tools_description')}</p>
                    <ul className="about-v2-app-features">
                        {whyUs.appFeatures.map((feature) => (
                            <li key={feature.label}>
                                <CheckCircle2 size={21} aria-hidden="true" />
                                <span>{feature.label}</span>
                            </li>
                        ))}
                    </ul>
                    <a href="#engagements" className="home-v2-button">
                        {t('about_v2.approach_cta')}
                        <ArrowRight size={17} aria-hidden="true" />
                    </a>
                </div>
            </section>

            <section
                id="engagements"
                className="about-v2-commitments"
                aria-labelledby="about-commitments-title"
            >
                <div className="about-v2-container">
                    <p className="about-v2-eyebrow">
                        {t('why_us.section_label')}
                    </p>
                    <h2 id="about-commitments-title">
                        {t('about_v2.commitments_title')}
                    </h2>
                    <div className="about-v2-commitments-grid">
                        {whyUs.details.map((detail) => (
                            <details id={detail.id} key={detail.id}>
                                <summary>
                                    <span>{detail.title}</span>
                                    <ChevronDown size={18} aria-hidden="true" />
                                </summary>
                                <p>{detail.description}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {featuredVideo?.embed_url && (
                <section
                    className="about-v2-container about-v2-video"
                    aria-labelledby="about-video-title"
                >
                    <h2 id="about-video-title">{t('about_v2.video_title')}</h2>
                    <div>
                        {videoPlaying ? (
                            <iframe
                                src={featuredVideo.embed_url}
                                title={featuredVideo.title}
                                loading="lazy"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        ) : (
                            <button
                                type="button"
                                className="about-v2-video-poster"
                                onClick={() => setVideoPlaying(true)}
                                aria-label={
                                    t('about_v2.video_play') +
                                    ' — ' +
                                    featuredVideo.title
                                }
                            >
                                <img
                                    src={
                                        featuredVideo.thumbnail_url ||
                                        '/images/super-securite/about-v2-supervision.jpg'
                                    }
                                    alt=""
                                    width={1280}
                                    height={720}
                                    loading="lazy"
                                    onError={(event) => {
                                        event.currentTarget.onerror = null;
                                        event.currentTarget.src =
                                            '/images/super-securite/about-v2-supervision.jpg';
                                    }}
                                />
                                <span>
                                    <Play
                                        size={24}
                                        fill="currentColor"
                                        aria-hidden="true"
                                    />
                                    {t('about_v2.video_play')}
                                </span>
                            </button>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}
