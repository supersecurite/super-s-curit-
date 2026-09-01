import type { InertiaLinkProps } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { toUrl } from '@/lib/utils';

export type IsCurrentUrlFn = (
    urlToCheck: NonNullable<InertiaLinkProps['href']> | null | undefined,
    currentUrl?: string,
    startsWith?: boolean,
) => boolean;

export type IsCurrentOrParentUrlFn = (
    urlToCheck: NonNullable<InertiaLinkProps['href']> | null | undefined,
    currentUrl?: string,
) => boolean;

export type WhenCurrentUrlFn = <TIfTrue, TIfFalse = null>(
    urlToCheck: NonNullable<InertiaLinkProps['href']> | null | undefined,
    ifTrue: TIfTrue,
    ifFalse?: TIfFalse,
) => TIfTrue | TIfFalse;

export type UseCurrentUrlReturn = {
    currentUrl: string;
    isCurrentUrl: IsCurrentUrlFn;
    isCurrentOrParentUrl: IsCurrentOrParentUrlFn;
    whenCurrentUrl: WhenCurrentUrlFn;
};

const UUID_SEGMENT =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const NAV_DISCRIMINATOR_KEYS = ['tab'] as const;

function resolveUrl(urlString: string, origin: string): URL | null {
    try {
        return new URL(urlString, origin);
    } catch {
        return null;
    }
}

function normalizePath(path: string): string {
    return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

function hrefSearchMatches(
    hrefParams: URLSearchParams,
    currentParams: URLSearchParams,
): boolean {
    for (const [key, value] of hrefParams.entries()) {
        if (currentParams.get(key) !== value) {
            return false;
        }
    }

    return true;
}

function bareHrefBlockedByDiscriminator(
    currentParams: URLSearchParams,
): boolean {
    for (const key of NAV_DISCRIMINATOR_KEYS) {
        const value = currentParams.get(key);

        if (value) {
            return true;
        }
    }

    return false;
}

export function useCurrentUrl(): UseCurrentUrlReturn {
    const page = usePage();
    const origin =
        typeof window !== 'undefined'
            ? window.location.origin
            : 'http://localhost';

    const current = resolveUrl(page.url, origin) ?? new URL(origin);
    const currentUrlPath = normalizePath(current.pathname);

    const isCurrentUrl: IsCurrentUrlFn = (
        urlToCheck,
        currentUrl?: string,
        startsWith: boolean = false,
    ) => {
        if (urlToCheck == null) {
            return false;
        }

        const urlString = toUrl(urlToCheck);

        if (urlString === '#') {
            return false;
        }

        const href = resolveUrl(urlString, origin);

        if (!href) {
            return false;
        }

        const hrefPath = normalizePath(href.pathname);
        const comparePath = currentUrl
            ? normalizePath(
                  resolveUrl(currentUrl, origin)?.pathname ?? currentUrl,
              )
            : currentUrlPath;
        const compareParams = currentUrl
            ? (resolveUrl(currentUrl, origin)?.searchParams ??
              current.searchParams)
            : current.searchParams;

        const hrefHasQuery = [...href.searchParams.keys()].length > 0;

        if (hrefHasQuery) {
            return (
                comparePath === hrefPath &&
                hrefSearchMatches(href.searchParams, compareParams)
            );
        }

        if (!startsWith) {
            return (
                comparePath === hrefPath &&
                !bareHrefBlockedByDiscriminator(compareParams)
            );
        }

        if (hrefPath === '/') {
            return comparePath === '/';
        }

        if (comparePath === hrefPath) {
            return !bareHrefBlockedByDiscriminator(compareParams);
        }

        if (!comparePath.startsWith(`${hrefPath}/`)) {
            return false;
        }

        const rest = comparePath.slice(hrefPath.length + 1);

        return rest.split('/').some((segment) => UUID_SEGMENT.test(segment));
    };

    const isCurrentOrParentUrl: IsCurrentOrParentUrlFn = (
        urlToCheck,
        currentUrl?: string,
    ) => {
        return isCurrentUrl(urlToCheck, currentUrl, true);
    };

    const whenCurrentUrl: WhenCurrentUrlFn = <TIfTrue, TIfFalse = null>(
        urlToCheck: NonNullable<InertiaLinkProps['href']> | null | undefined,
        ifTrue: TIfTrue,
        ifFalse: TIfFalse = null as TIfFalse,
    ): TIfTrue | TIfFalse => {
        return isCurrentUrl(urlToCheck) ? ifTrue : ifFalse;
    };

    return {
        currentUrl: currentUrlPath,
        isCurrentUrl,
        isCurrentOrParentUrl,
        whenCurrentUrl,
    };
}
