import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    CarFront,
    Cctv,
    ChevronDown,
    ClipboardList,
    DoorOpen,
    Footprints,
    House,
    Moon,
    Factory,
    MapPinned,
    HardHat,
    Truck,
    Settings2,
    ShieldCheck,
    Siren,
    UserCheck,
    Users,
} from 'lucide-react';
import ServiceGallery from '@/components/marketing/service-gallery';
import type { ServicePageLayoutProps } from '@/components/marketing/service-layouts/types';
import VideoGallery from '@/components/marketing/video-gallery';
import { serviceV2Images } from '@/data/service-v2-images';
import { superSecuriteServiceById } from '@/data/super-securite-services';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';

type CopyItem = { title: string; description: string };

/** Pages services V2 : contenus localisés, médias publiés et présentation par activité. */
export default function ServiceV2Layout({
    content,
    faqs,
    serviceGalleryImages = [],
    serviceGalleryVideos = [],
}: ServicePageLayoutProps) {
    const { t, tNode } = useTrans();
    const lp = useLocalizedUrl();
    const serviceId = content.hero.id as keyof typeof serviceV2Images;
    const assets = serviceV2Images[serviceId];
    const copyKey =
        serviceId === 'entreprise'
            ? 'enterprise_v2'
            : 'services_v2.' + serviceId;
    const text = (key: string) => t(copyKey + '.' + key);
    const relatedServices = (
        Object.keys(serviceV2Images) as Array<keyof typeof serviceV2Images>
    ).filter((id) => id !== serviceId);
    const benefits = tNode<CopyItem[]>(copyKey + '.benefits', []);
    const advantages =
        serviceId === 'entreprise'
            ? tNode<CopyItem[]>('enterprise_v2.advantages', [])
            : [];
    const steps = tNode<CopyItem[]>(copyKey + '.steps', []);
    const benefitIcons = {
        entreprise: [DoorOpen, ShieldCheck, Siren, ClipboardList],
        residence: [Users, DoorOpen, ShieldCheck, Moon],
        chantiers: [DoorOpen, ShieldCheck, HardHat, ClipboardList],
        'zones-minieres': [DoorOpen, MapPinned, House, ClipboardList],
    }[serviceId];
    const advantageIcons = [Users, Settings2, Building2];
    const sectionIcons = {
        entreprise: [
            UserCheck,
            Cctv,
            Footprints,
            Siren,
            CarFront,
            ClipboardList,
        ],
        residence: [ShieldCheck, Users, DoorOpen, Footprints, Siren, Moon],
        chantiers: [DoorOpen, Cctv, Footprints, Truck, Siren, Users],
        'zones-minieres': [
            DoorOpen,
            House,
            CarFront,
            Factory,
            Footprints,
            Siren,
        ],
    }[serviceId];
    const gallery = serviceGalleryImages.length
        ? serviceGalleryImages.map(({ src, alt, caption }) => ({
              src,
              alt,
              caption: caption ?? undefined,
          }))
        : content.gallery;

    return (
        <div className={'enterprise-v2 service-v2-' + serviceId}>
            <section
                className="enterprise-v2-hero"
                aria-labelledby="enterprise-v2-title"
            >
                <img
                    src={assets.hero}
                    alt=""
                    width={1980}
                    height={794}
                    fetchPriority="high"
                />
                <div className="about-v2-container enterprise-v2-hero-inner">
                    <nav
                        className="enterprise-v2-breadcrumb"
                        aria-label={t('services.' + serviceId + '.title')}
                    >
                        <Link href={lp('/')}>{t('nav.home')}</Link>
                        <span aria-hidden="true">/</span>
                        <span>{t('services.' + serviceId + '.title')}</span>
                    </nav>
                    <h1 id="enterprise-v2-title">
                        {text('title_lead')}
                        <strong>{text('title_accent')}</strong>
                    </h1>
                    <p>{text('description')}</p>
                    <Link className="home-v2-button" href={lp('/contact')}>
                        {t('home_v2.quote_cta')}
                        <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                </div>
            </section>
            <div className="enterprise-v2-benefits about-v2-container">
                {benefits.map((item, index) => {
                    const Icon = benefitIcons[index % benefitIcons.length];

                    return (
                        <div key={item.title}>
                            <Icon
                                size={36}
                                strokeWidth={1.6}
                                aria-hidden="true"
                            />
                            <div>
                                <h2>{item.title}</h2>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <section className="enterprise-v2-intro about-v2-container">
                <img
                    className="enterprise-v2-site-photo"
                    src={assets.intro}
                    alt={text('intro_alt')}
                    width={800}
                    height={650}
                    loading="lazy"
                />
                <div>
                    <h2 className="enterprise-v2-heading">
                        {text('intro_title')}
                    </h2>
                    <p>{content.intro[1]}</p>
                    <div className="enterprise-v2-advantages">
                        {advantages.map((item, index) => {
                            const Icon =
                                advantageIcons[index % advantageIcons.length];

                            return (
                                <div key={item.title}>
                                    <Icon size={30} aria-hidden="true" />
                                    <div>
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
            <section className="enterprise-v2-perimeter">
                <div className="about-v2-container">
                    <div className="enterprise-v2-section-heading">
                        <h2 className="enterprise-v2-heading">
                            {serviceId === 'entreprise'
                                ? t('enterprise_v2.perimeter')
                                : content.sectionsTitle}
                        </h2>
                        <p>{content.intro[0]}</p>
                    </div>
                    <div className="enterprise-v2-service-grid">
                        {content.sections.map((item, index) => {
                            const Icon =
                                sectionIcons[index % sectionIcons.length];

                            return (
                                <article key={item.title}>
                                    <Icon
                                        size={40}
                                        strokeWidth={1.6}
                                        aria-hidden="true"
                                    />
                                    <div>
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>
            <section className="enterprise-v2-supervision">
                <div className="about-v2-container enterprise-v2-supervision-inner">
                    <img
                        src={assets.band}
                        alt={text('supervision_alt')}
                        width={1564}
                        height={1006}
                        loading="lazy"
                    />
                    <div>
                        <h2 className="enterprise-v2-heading">
                            {text('supervision_title')}
                        </h2>
                        <p>{text('supervision_text')}</p>
                        {serviceId === 'chantiers' && (
                            <dl className="service-v2-band-stats">
                                {content.hero.stats.map((stat) => (
                                    <div key={stat.label}>
                                        <dt>{stat.label}</dt>
                                        <dd>{stat.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        )}
                        <Link className="home-v2-button" href={lp('/a-propos')}>
                            {t('enterprise_v2.more')}
                            <ArrowRight size={17} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>
            <section className="enterprise-v2-method about-v2-container">
                <h2 className="enterprise-v2-heading">
                    {text('method_title')}
                </h2>
                <ol>
                    {steps.map((step, index) => (
                        <li key={step.title}>
                            <span>{index + 1}</span>
                            <div>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>
            <section className="enterprise-v2-sectors about-v2-container">
                <h2 className="enterprise-v2-heading">
                    {text('sectors_title')}
                </h2>
                {content.intro.slice(2).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                ))}
                <ul>
                    {content.introIndicators?.map((item) => (
                        <li key={item}>
                            <ShieldCheck size={18} aria-hidden="true" />
                            {item}
                        </li>
                    ))}
                </ul>
            </section>
            {content.highlights && content.highlights.length > 0 && (
                <section className="enterprise-v2-highlights about-v2-container">
                    <h2 className="enterprise-v2-heading">
                        {content.highlightsTitle}
                    </h2>
                    <ul>
                        {content.highlights.map((item) => (
                            <li key={item}>
                                <ShieldCheck size={20} aria-hidden="true" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            {gallery.length > 0 && (
                <section className="enterprise-v2-gallery about-v2-container">
                    <ServiceGallery
                        title={content.galleryTitle}
                        description={content.galleryDescription}
                        images={gallery}
                        variant="grid"
                    />
                </section>
            )}
            {serviceGalleryVideos.length > 0 && (
                <section className="enterprise-v2-videos about-v2-container">
                    <h2 className="enterprise-v2-heading">
                        {t('enterprise_v2.video_title')}
                    </h2>
                    <VideoGallery videos={serviceGalleryVideos} />
                </section>
            )}
            {faqs.length > 0 && (
                <section className="enterprise-v2-faq">
                    <div className="about-v2-container enterprise-v2-faq-inner">
                        <div>
                            <h2 className="enterprise-v2-heading">
                                {t('enterprise_v2.faq_title')}
                            </h2>
                            <p>{t('enterprise_v2.faq_text')}</p>
                            <Link
                                className="home-v2-button"
                                href={lp('/contact')}
                            >
                                {t('home_v2.contact_cta')}
                                <ArrowRight size={17} aria-hidden="true" />
                            </Link>
                        </div>
                        <div>
                            {faqs.map((faq) => (
                                <details key={faq.question}>
                                    <summary>
                                        {faq.question}
                                        <ChevronDown
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </summary>
                                    <p>{faq.answer}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            )}
            <section className="enterprise-v2-related about-v2-container">
                <h2 className="enterprise-v2-heading">
                    {t('enterprise_v2.related_title')}
                </h2>
                <div>
                    {relatedServices.map((id) => {
                        const service = superSecuriteServiceById[id];

                        return (
                            <Link key={id} href={lp(service.path)}>
                                <img
                                    src={serviceV2Images[id].hero}
                                    alt=""
                                    width={640}
                                    height={360}
                                    loading="lazy"
                                />
                                <div>
                                    <h3>{t('services.' + id + '.title')}</h3>
                                    <ArrowRight size={20} aria-hidden="true" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
