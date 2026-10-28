import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronDown,
    Mail,
    MapPin,
    Menu,
    Phone,
    X,
} from 'lucide-react';
import { useState } from 'react';
import MarketingLanguageSelect from '@/components/marketing/marketing-language-select';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useMarketingServiceNavLinks } from '@/data/marketing-nav';
import { superSecuriteImages } from '@/data/super-securite-images';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';
import {
    isMarketingNavActive,
    isMarketingServicesNavActive,
} from '@/lib/marketing-nav-active';
import { cn } from '@/lib/utils';
import type { SuperSecuriteConfig } from '@/types/super-securite';

type MarketingMobileNavProps = {
    desktopBreakpoint?: 'md' | 'xl';
    pathname: string;
    superSecurite: SuperSecuriteConfig;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type MenuLinkProps = {
    href: string;
    label: string;
    pathname: string;
    close: () => void;
    nested?: boolean;
};

function MobileMenuLink({
    href,
    label,
    pathname,
    close,
    nested = false,
}: MenuLinkProps) {
    const active = isMarketingNavActive(href, pathname);

    return (
        <Link
            href={href}
            onClick={close}
            aria-current={active ? 'page' : undefined}
            className={cn(
                nested
                    ? 'marketing-mobile-v2-sublink'
                    : 'marketing-mobile-v2-link',
                active && 'is-active',
            )}
        >
            <span>{label}</span>
            {!nested && <ArrowRight size={18} aria-hidden="true" />}
        </Link>
    );
}

type MenuBodyProps = Pick<
    MarketingMobileNavProps,
    'pathname' | 'superSecurite'
> & { close: () => void };

/** Monté à chaque ouverture : les sous-menus suivent la page active sans synchronisation d’état. */
function MobileMenuBody({ pathname, superSecurite, close }: MenuBodyProps) {
    const { t } = useTrans();
    const lp = useLocalizedUrl();
    const serviceLinks = useMarketingServiceNavLinks();
    const resourceLinks = [
        { href: lp('/actualites'), label: t('nav.news') },
        { href: lp('/conseils-securite'), label: t('footer.tips') },
        { href: lp('/galerie'), label: t('footer.gallery') },
    ];
    const servicesActive = isMarketingServicesNavActive(pathname);
    const resourcesActive = resourceLinks.some((link) =>
        isMarketingNavActive(link.href, pathname),
    );
    const [servicesOpen, setServicesOpen] = useState(servicesActive);
    const [resourcesOpen, setResourcesOpen] = useState(resourcesActive);

    return (
        <>
            <div className="marketing-mobile-v2-header">
                <Link
                    href={lp('/')}
                    onClick={close}
                    className="marketing-mobile-v2-brand"
                    aria-label="Super Sécurité"
                >
                    <img
                        src={superSecuriteImages.brandBlackTransparent}
                        alt="Super Sécurité"
                        width={200}
                        height={86}
                    />
                </Link>
                <SheetClose asChild>
                    <button
                        type="button"
                        className="marketing-mobile-v2-close"
                        aria-label={t('nav.close_menu')}
                    >
                        <X size={23} aria-hidden="true" />
                    </button>
                </SheetClose>
            </div>

            <div className="marketing-mobile-v2-scroll">
                <nav
                    className="marketing-mobile-v2-nav"
                    aria-label={t('nav.mobile_label')}
                >
                    <p className="marketing-mobile-v2-eyebrow">
                        {t('nav.navigation')}
                    </p>
                    <ul className="marketing-mobile-v2-list">
                        <li>
                            <MobileMenuLink
                                href={lp('/')}
                                label={t('nav.home')}
                                pathname={pathname}
                                close={close}
                            />
                        </li>
                        <li>
                            <MobileMenuLink
                                href={lp('/a-propos')}
                                label={t('about.label')}
                                pathname={pathname}
                                close={close}
                            />
                        </li>
                        <li>
                            <Collapsible
                                open={servicesOpen}
                                onOpenChange={setServicesOpen}
                                className={cn(
                                    'marketing-mobile-v2-group',
                                    servicesActive && 'is-active',
                                )}
                            >
                                <CollapsibleTrigger asChild>
                                    <button
                                        type="button"
                                        className="marketing-mobile-v2-link marketing-mobile-v2-group-trigger"
                                    >
                                        <span>{t('nav.services')}</span>
                                        <ChevronDown
                                            size={19}
                                            aria-hidden="true"
                                        />
                                    </button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <ul className="marketing-mobile-v2-sublinks">
                                        {serviceLinks.map((service) => (
                                            <li key={service.id}>
                                                <MobileMenuLink
                                                    href={service.href}
                                                    label={service.label}
                                                    pathname={pathname}
                                                    close={close}
                                                    nested
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </CollapsibleContent>
                            </Collapsible>
                        </li>
                        <li>
                            <Collapsible
                                open={resourcesOpen}
                                onOpenChange={setResourcesOpen}
                                className={cn(
                                    'marketing-mobile-v2-group',
                                    resourcesActive && 'is-active',
                                )}
                            >
                                <CollapsibleTrigger asChild>
                                    <button
                                        type="button"
                                        className="marketing-mobile-v2-link marketing-mobile-v2-group-trigger"
                                    >
                                        <span>{t('footer_v2.resources')}</span>
                                        <ChevronDown
                                            size={19}
                                            aria-hidden="true"
                                        />
                                    </button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <ul className="marketing-mobile-v2-sublinks">
                                        {resourceLinks.map((resource) => (
                                            <li key={resource.href}>
                                                <MobileMenuLink
                                                    href={resource.href}
                                                    label={resource.label}
                                                    pathname={pathname}
                                                    close={close}
                                                    nested
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </CollapsibleContent>
                            </Collapsible>
                        </li>
                        <li>
                            <MobileMenuLink
                                href={lp('/devenir-agent')}
                                label={t('footer_v2.recruitment')}
                                pathname={pathname}
                                close={close}
                            />
                        </li>
                        <li>
                            <MobileMenuLink
                                href={lp('/contact')}
                                label={t('nav.contact')}
                                pathname={pathname}
                                close={close}
                            />
                        </li>
                    </ul>
                </nav>
                <address className="marketing-mobile-v2-contact">
                    <a href={superSecurite.phone_href}>
                        <Phone size={17} aria-hidden="true" />
                        <span>{superSecurite.phone}</span>
                    </a>
                    <a href={'mailto:' + superSecurite.email}>
                        <Mail size={17} aria-hidden="true" />
                        <span>{superSecurite.email}</span>
                    </a>
                    <span>
                        <MapPin size={17} aria-hidden="true" />
                        <span>{superSecurite.address}</span>
                    </span>
                </address>
            </div>

            <div className="marketing-mobile-v2-actions">
                <Link
                    href={lp('/contact')}
                    onClick={close}
                    className="marketing-mobile-v2-quote"
                >
                    <span>{t('home_v2.quote_cta')}</span>
                    <ArrowRight size={19} aria-hidden="true" />
                </Link>
                <div className="marketing-mobile-v2-language-row">
                    <span>{t('language.label')}</span>
                    <MarketingLanguageSelect
                        className="marketing-mobile-v2-language"
                        onSelected={close}
                    />
                </div>
            </div>
        </>
    );
}

/** Navigation publique mobile V2 : panneau bleu nuit et rubriques regroupées. */
export default function MarketingMobileNav({
    desktopBreakpoint = 'md',
    pathname,
    superSecurite,
    open,
    onOpenChange,
}: MarketingMobileNavProps) {
    const { t } = useTrans();

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        'marketing-mobile-v2-trigger inline-flex',
                        desktopBreakpoint === 'xl' ? 'xl:hidden' : 'md:hidden',
                    )}
                    aria-label={t('nav.open_menu')}
                >
                    <Menu size={23} aria-hidden="true" />
                </button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="marketing-mobile-v2 [&>button]:hidden"
                aria-describedby={undefined}
            >
                <SheetTitle className="sr-only">
                    {t('nav.mobile_title')}
                </SheetTitle>
                <MobileMenuBody
                    key={pathname}
                    pathname={pathname}
                    superSecurite={superSecurite}
                    close={() => onOpenChange(false)}
                />
            </SheetContent>
        </Sheet>
    );
}
