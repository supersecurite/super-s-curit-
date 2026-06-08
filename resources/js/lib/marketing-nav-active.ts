import { marketingServiceNavLinks } from '@/data/marketing-nav';

export function isMarketingNavActive(
    href: string,
    currentUrl: string,
): boolean {
    const normalizedHref = href.replace(/\/$/, '') || '/';
    const normalizedCurrent = currentUrl.replace(/\/$/, '') || '/';

    if (normalizedHref === '/') {
        return normalizedCurrent === '/';
    }

    return (
        normalizedCurrent === normalizedHref ||
        normalizedCurrent.startsWith(`${normalizedHref}/`)
    );
}

export function isMarketingServicesNavActive(currentUrl: string): boolean {
    const pathname = currentUrl.split('?')[0] ?? '/';

    return marketingServiceNavLinks.some(
        (service) => pathname === service.href,
    );
}
