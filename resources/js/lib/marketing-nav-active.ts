import { marketingServicePaths } from '@/data/marketing-nav';
import { stripLocalePrefix } from '@/lib/locale-url';

export function isMarketingNavActive(
    href: string,
    currentUrl: string,
): boolean {
    const normalizedHref = stripLocalePrefix(href).replace(/\/$/, '') || '/';
    const normalizedCurrent = stripLocalePrefix(currentUrl).replace(/\/$/, '') || '/';

    if (normalizedHref === '/') {
        return normalizedCurrent === '/';
    }

    return (
        normalizedCurrent === normalizedHref ||
        normalizedCurrent.startsWith(`${normalizedHref}/`)
    );
}

export function isMarketingServicesNavActive(currentUrl: string): boolean {
    const pathname = stripLocalePrefix(currentUrl.split('?')[0] ?? '/');

    return marketingServicePaths.some(
        (servicePath) => pathname === servicePath,
    );
}
