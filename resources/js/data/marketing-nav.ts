import { superSecuriteServiceDefinitions } from '@/data/super-securite-services';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';

export const marketingPrimaryNavPaths = [
    { path: '/', labelKey: 'nav.home' },
    { path: '/a-propos', labelKey: 'nav.why_us' },
    { path: '/actualites', labelKey: 'nav.news' },
    { path: '/conseils-securite', labelKey: 'nav.tips' },
    { path: '/galerie', labelKey: 'nav.gallery' },
    { path: '/contact', labelKey: 'nav.contact' },
] as const;

/** Chemins de services (labels via t(`services.${id}.title`)). */
export const marketingServiceNavLinks = superSecuriteServiceDefinitions.map(
    (service) => ({
        href: service.path,
        id: service.id,
        label: service.title,
        description: service.cardDescription,
    }),
) as readonly {
    href: string;
    id: string;
    label: string;
    description: string;
}[];

/** @deprecated Préférer useMarketingPrimaryNavLinks */
export const marketingPrimaryNavLinks = marketingPrimaryNavPaths.map((item) => ({
    href: item.path,
    label:
        item.labelKey === 'nav.home'
            ? 'Accueil'
            : item.labelKey === 'nav.why_us'
              ? 'Pourquoi nous'
              : item.labelKey === 'nav.news'
                ? 'Actualités'
                : item.labelKey === 'nav.tips'
                  ? 'Conseils'
                  : item.labelKey === 'nav.gallery'
                    ? 'Galerie'
                    : 'Nous contacter',
})) as readonly { href: string; label: string }[];

export function useMarketingPrimaryNavLinks() {
    const { t } = useTrans();
    const localized = useLocalizedUrl();

    return marketingPrimaryNavPaths.map((item) => ({
        href: localized(item.path),
        label: t(item.labelKey),
        path: item.path,
    }));
}

/**
 * Chemins bruts des services (sans préfixe locale) pour la détection d'item actif.
 */
export const marketingServicePaths: readonly string[] =
    superSecuriteServiceDefinitions.map((service) => service.path);

export function useMarketingServiceNavLinks() {
    const { t } = useTrans();
    const localized = useLocalizedUrl();

    return marketingServiceNavLinks.map((service) => ({
        href: localized(service.href),
        id: service.id,
        label: t(`services.${service.id}.title`, service.label),
        description: t(
            `services.${service.id}.description`,
            service.description,
        ),
    }));
}
