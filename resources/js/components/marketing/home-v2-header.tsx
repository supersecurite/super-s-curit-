import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import MarketingLanguageSelect from '@/components/marketing/marketing-language-select';
import MarketingMobileNav from '@/components/marketing/marketing-mobile-nav';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { superSecuriteServices } from '@/data/super-securite-content';
import { superSecuriteImages } from '@/data/super-securite-images';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';
import { isMarketingNavActive } from '@/lib/marketing-nav-active';
import type { SuperSecuriteConfig } from '@/types/super-securite';

type NavLink = { label: string; href: string };

function DesktopNavGroup({
    label,
    links,
    pathname,
}: {
    label: string;
    links: NavLink[];
    pathname: string;
}) {
    const active = links.some((link) =>
        isMarketingNavActive(link.href, pathname),
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={'home-v2-nav-link' + (active ? ' is-active' : '')}
            >
                {label}
                <ChevronDown size={13} aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="home-v2-dropdown" sideOffset={14}>
                {links.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                        <Link
                            href={link.href}
                            className="home-v2-dropdown-item"
                            aria-current={
                                isMarketingNavActive(link.href, pathname)
                                    ? 'page'
                                    : undefined
                            }
                        >
                            {link.label}
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/** Navigation commune aux pages Accueil et À propos de la refonte V2. */
export default function HomeV2Header() {
    const { t } = useTrans();
    const lp = useLocalizedUrl();
    const { url, props, component } = usePage();
    const { superSecurite } = props as { superSecurite: SuperSecuriteConfig };
    const [open, setOpen] = useState(false);
    const pathname = url.split('?')[0];
    const services = superSecuriteServices.map((service) => ({
        href: lp(service.path),
        label: t('services.' + service.id + '.title', service.title),
    }));
    const resources = [
        { label: t('nav.news'), href: lp('/actualites') },
        { label: t('footer.tips'), href: lp('/conseils-securite') },
        { label: t('footer.gallery'), href: lp('/galerie') },
    ];
    const link = (path: string, label: string) => (
        <Link
            href={lp(path)}
            className={
                'home-v2-nav-link' +
                (isMarketingNavActive(lp(path), pathname) ? ' is-active' : '')
            }
            aria-current={
                isMarketingNavActive(lp(path), pathname) ? 'page' : undefined
            }
        >
            {label}
        </Link>
    );

    return (
        <header
            className={
                'home-v2-header' +
                (component === 'marketing/about' ? ' home-v2-header-solid' : '')
            }
            id="marketing-header"
        >
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
                    {link('/', t('nav.home'))}
                    {link('/a-propos', t('about.label'))}
                    <DesktopNavGroup
                        label={t('nav.services')}
                        links={services}
                        pathname={pathname}
                    />
                    <DesktopNavGroup
                        label={t('footer_v2.resources')}
                        links={resources}
                        pathname={pathname}
                    />
                    {link('/devenir-agent', t('footer_v2.recruitment'))}
                    {link('/contact', t('nav.contact'))}
                </nav>
                <div className="home-v2-header-actions">
                    <MarketingLanguageSelect className="home-v2-language hidden sm:flex" />
                    <Link
                        href={lp('/contact')}
                        className="home-v2-button home-v2-header-quote"
                    >
                        {t('home_v2.quote_cta')}
                        <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                    <MarketingMobileNav
                        pathname={pathname}
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
