import { usePage } from '@inertiajs/react';

type TransPageProps = {
    locale?: string;
    locales?: string[];
    translations?: Record<string, unknown>;
};

/**
 * Traductions marketing partagées via Inertia (`lang/{locale}.json`).
 */
export function useTrans() {
    const {
        locale = 'fr',
        locales = ['fr', 'en', 'zh'],
        translations = {},
    } = usePage().props as TransPageProps;

    const t = (
        key: string,
        fallbackOrReplace?: string | Record<string, string | number>,
        replace?: Record<string, string | number>,
    ): string => {
        const fallback =
            typeof fallbackOrReplace === 'string'
                ? fallbackOrReplace
                : undefined;
        const vars =
            typeof fallbackOrReplace === 'object' && fallbackOrReplace !== null
                ? fallbackOrReplace
                : replace;

        if (!translations || typeof translations !== 'object') {
            return applyReplace(fallback ?? key, vars);
        }

        const segments = key.split('.');
        let current: unknown = translations;

        for (const segment of segments) {
            if (
                current &&
                typeof current === 'object' &&
                segment in (current as Record<string, unknown>)
            ) {
                current = (current as Record<string, unknown>)[segment];
            } else {
                return applyReplace(fallback ?? key, vars);
            }
        }

        if (typeof current === 'string') {
            return applyReplace(current, vars);
        }

        return applyReplace(fallback ?? key, vars);
    };

    /**
     * Résout une clé vers un tableau de chaînes (listes, paragraphes).
     */
    const tList = (key: string, fallback: string[] = []): string[] => {
        if (!translations || typeof translations !== 'object') {
            return fallback;
        }

        const segments = key.split('.');
        let current: unknown = translations;

        for (const segment of segments) {
            if (
                current &&
                typeof current === 'object' &&
                segment in (current as Record<string, unknown>)
            ) {
                current = (current as Record<string, unknown>)[segment];
            } else {
                return fallback;
            }
        }

        if (
            Array.isArray(current) &&
            current.every((item) => typeof item === 'string')
        ) {
            return current as string[];
        }

        return fallback;
    };

    /**
     * Résout une clé vers une valeur quelconque (objet, tableau, string…).
     */
    const tNode = <T = unknown>(key: string, fallback?: T): T => {
        if (!translations || typeof translations !== 'object') {
            return fallback as T;
        }

        const segments = key.split('.');
        let current: unknown = translations;

        for (const segment of segments) {
            if (
                current &&
                typeof current === 'object' &&
                segment in (current as Record<string, unknown>)
            ) {
                current = (current as Record<string, unknown>)[segment];
            } else {
                return fallback as T;
            }
        }

        return (current as T) ?? (fallback as T);
    };

    return {
        t,
        tList,
        tNode,
        locale,
        locales,
        translations,
    };
}

function applyReplace(
    value: string,
    vars?: Record<string, string | number>,
): string {
    if (!vars) {
        return value;
    }

    let result = value;

    for (const [search, replacement] of Object.entries(vars)) {
        result = result
            .replaceAll(`:${search}`, String(replacement))
            .replaceAll(`{${search}}`, String(replacement));
    }

    return result;
}
