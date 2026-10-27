import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import MarketingLanguageSelect from '@/components/marketing/marketing-language-select';
import MarketingMobileNav from '@/components/marketing/marketing-mobile-nav';
import { superSecuriteImages } from '@/data/super-securite-images';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';
import type { SuperSecuriteConfig } from '@/types/super-securite';

/** Navigation de l'accueil V2 ; les autres pages gardent leur navigation actuelle. */
export default function HomeV2Header() {
    const { t } = useTrans();
    const lp = useLocalizedUrl();
    const { url, props } = usePage();
    const { superSecurite } = props as { superSecurite: SuperSecuriteConfig };
    const [open, setOpen] = useState(false);
    const links = [
        { label: t('nav.home'), href: lp('/'), active: true },
        { label: t('about.label'), href: lp('/a-propos') },
        { label: t('nav.services'), href: lp('/') + '#services' },
        { label: t('home_v2.references'), href: lp('/') + '#references' },
        { label: t('nav.news'), href: lp('/actualites') },
        { label: t('nav.contact'), href: lp('/contact') },
    ];

    return (
        <header className="home-v2-header" id="marketing-header">
            <div className="home-v2-header-inner">
                <Link
                    href={lp('/')}
                    className="home-v2-brand"
                    aria-label="Super Sécurité"
                >
                    <img
                        src={superSecuriteImages.brandBlackTransparent}
                        alt="Super Sécurité"
                        width={276}
                        height={74}
                    />
                </Link>
                <nav
                    className="home-v2-desktop-nav"
                    aria-label={t('nav.main_label')}
                >
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={link.active ? 'is-active' : undefined}
                            aria-current={link.active ? 'page' : undefined}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="home-v2-header-actions">
                    <MarketingLanguageSelect className="home-v2-language hidden sm:flex" />
                    <Link
                        href={lp('/contact')}
                        className="home-v2-button home-v2-header-quote"
                    >
                        {t('home_v2.quote_cta')}{' '}
                        <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                    <MarketingMobileNav
                        pathname={url.split('?')[0]}
                        superSecurite={superSecurite}
                        open={open}
                        onOpenChange={setOpen}
                        desktopBreakpoint="xl"
                    />
                </div>
            </div>
        </header>
    );
}
