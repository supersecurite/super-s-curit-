import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronDown,
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Twitter,
    Youtube,
} from 'lucide-react';
import { superSecuriteServices } from '@/data/super-securite-content';
import { superSecuriteImages } from '@/data/super-securite-images';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';
import type { SuperSecuriteConfig } from '@/types/super-securite';

type FooterPageProps = { superSecurite: SuperSecuriteConfig };

/** Pied de page commun : présence en Guinée, navigation et coordonnées localisées. */
export default function MarketingFooter() {
    const { superSecurite } = usePage<FooterPageProps>().props;
    const { t } = useTrans();
    const lp = useLocalizedUrl();
    const year = new Date().getFullYear();
    const socialLinks = [
        {
            name: 'LinkedIn',
            href: superSecurite.social.linkedin,
            icon: Linkedin,
        },
        {
            name: 'Facebook',
            href: superSecurite.social.facebook,
            icon: Facebook,
        },
        { name: 'YouTube', href: superSecurite.social.youtube, icon: Youtube },
        {
            name: 'Instagram',
            href: superSecurite.social.instagram,
            icon: Instagram,
        },
        { name: 'Twitter', href: superSecurite.social.twitter, icon: Twitter },
    ].filter((social) => social.href);

    return (
        <footer className="marketing-footer-v2">
            <section
                className="marketing-footer-presence"
                aria-labelledby="footer-presence-title"
            >
                <div className="marketing-footer-container marketing-footer-presence-grid">
                    <div className="marketing-footer-presence-copy">
                        <p className="marketing-footer-eyebrow">
                            {t('footer_v2.presence_label')}
                        </p>
                        <h2 id="footer-presence-title">
                            {t('footer_v2.presence_title')}
                        </h2>
                        <p>{t('footer_v2.presence_description')}</p>
                    </div>
                    <div className="marketing-footer-map" aria-hidden="true">
                        <img
                            src="/images/super-securite/guinea-outline.svg"
                            alt=""
                            width={280}
                            height={180}
                            loading="lazy"
                        />
                        <div className="marketing-footer-map-label">
                            <MapPin
                                size={38}
                                fill="currentColor"
                                strokeWidth={1.5}
                            />
                            <span>{t('footer_v2.country')}</span>
                        </div>
                    </div>
                    <div className="marketing-footer-project">
                        <p className="marketing-footer-eyebrow">
                            {t('footer_v2.project_label')}
                        </p>
                        <h3>{t('footer_v2.project_title')}</h3>
                        <p>{t('footer_v2.project_description')}</p>
                        <Link
                            href={lp('/contact')}
                            className="marketing-footer-quote"
                        >
                            {t('home_v2.quote_cta')}
                            <ArrowRight size={17} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>

            <div className="marketing-footer-main">
                <div className="marketing-footer-container marketing-footer-columns">
                    <div className="marketing-footer-brand">
                        <Link href={lp('/')} aria-label="Super Sécurité">
                            <img
                                src={superSecuriteImages.brandBlackTransparent}
                                alt="Super Sécurité"
                                width={220}
                                height={94}
                                loading="lazy"
                            />
                        </Link>
                        <p>{t('footer_v2.tagline')}</p>
                    </div>
                    <nav aria-label={t('footer_v2.links_title')}>
                        <h3>{t('footer_v2.links_title')}</h3>
                        <ul className="marketing-footer-links">
                            <li>
                                <Link href={lp('/')}>{t('nav.home')}</Link>
                            </li>
                            <li>
                                <Link href={lp('/a-propos')}>
                                    {t('about.label')}
                                </Link>
                            </li>
                            <li>
                                <Link href={lp('/') + '#services'}>
                                    {t('nav.services')}
                                </Link>
                            </li>
                            <li>
                                <details className="marketing-footer-resources">
                                    <summary>
                                        {t('footer_v2.resources')}
                                        <ChevronDown
                                            size={12}
                                            aria-hidden="true"
                                        />
                                    </summary>
                                    <ul>
                                        <li>
                                            <Link href={lp('/actualites')}>
                                                {t('nav.news')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={lp('/conseils-securite')}
                                            >
                                                {t('footer.tips')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={lp('/galerie')}>
                                                {t('footer.gallery')}
                                            </Link>
                                        </li>
                                    </ul>
                                </details>
                            </li>
                            <li>
                                <Link href={lp('/devenir-agent')}>
                                    {t('footer_v2.recruitment')}
                                </Link>
                            </li>
                            <li>
                                <Link href={lp('/contact')}>
                                    {t('nav.contact')}
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <nav aria-label={t('footer_v2.services_title')}>
                        <h3>{t('footer_v2.services_title')}</h3>
                        <ul className="marketing-footer-links">
                            {superSecuriteServices.map((service) => (
                                <li key={service.id}>
                                    <Link href={lp(service.path)}>
                                        {t(
                                            'services.' + service.id + '.title',
                                            service.title,
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="marketing-footer-contact">
                        <h3>{t('nav.contact')}</h3>
                        <address>
                            <span>
                                <MapPin size={18} aria-hidden="true" />
                                <span>{superSecurite.address}</span>
                            </span>
                            <a href={'mailto:' + superSecurite.email}>
                                <Mail size={18} aria-hidden="true" />
                                <span>{superSecurite.email}</span>
                            </a>
                            <a href={superSecurite.phone_href}>
                                <Phone size={16} aria-hidden="true" />
                                <span>{superSecurite.phone}</span>
                            </a>
                        </address>
                        {socialLinks.length > 0 && (
                            <ul
                                className="marketing-footer-socials"
                                aria-label={t('footer.networks')}
                            >
                                {socialLinks.map(
                                    ({ name, href, icon: Icon }) => (
                                        <li key={name}>
                                            <a
                                                href={href!}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={name}
                                            >
                                                <Icon
                                                    size={21}
                                                    aria-hidden="true"
                                                />
                                            </a>
                                        </li>
                                    ),
                                )}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <div className="marketing-footer-bottom">
                <div className="marketing-footer-container marketing-footer-bottom-inner">
                    <p>
                        {t('footer_v2.rights').replace(':year', String(year))}
                    </p>
                    <nav aria-label={t('footer_v2.legal_navigation')}>
                        <Link href={lp('/mentions-legales')}>
                            {t('footer.legal')}
                        </Link>
                        <span aria-hidden="true">·</span>
                        <Link href={lp('/politique-de-confidentialite')}>
                            {t('footer_v2.privacy')}
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
