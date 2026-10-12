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
        locales = ['fr', 'en'],
        translations = {},
    } = usePage().props as TransPageProps;

    const t = (key: string, fallback?: string): string => {
        if (!translations || typeof translations !== 'object') {
            return fallback ?? key;
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
                return fallback ?? key;
            }
        }

        if (typeof current === 'string') {
            return current;
        }

        return fallback ?? key;
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

        if (Array.isArray(current) && current.every((item) => typeof item === 'string')) {
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
