const DEFAULT_LOCALE = 'fr';
const URL_PREFIXES: Record<string, string> = {
    en: 'en',
};

/**
 * Chemin sans préfixe de locale (/en/contact → /contact).
 */
export function stripLocalePrefix(path: string): string {
    let normalized = '/' + path.replace(/^\/+/, '');
    normalized = normalized === '/' ? '/' : normalized.replace(/\/+$/, '');

    for (const [locale, prefix] of Object.entries(URL_PREFIXES)) {
        if (locale === DEFAULT_LOCALE) {
            continue;
        }

        const localePrefix = `/${prefix}`;

        if (normalized === localePrefix) {
            return '/';
        }

        if (normalized.startsWith(`${localePrefix}/`)) {
            const stripped = normalized.slice(localePrefix.length);

            return stripped === '' ? '/' : stripped;
        }
    }

    return normalized;
}

/**
 * Localise un chemin logique pour une locale (FR sans préfixe, EN avec /en).
 */
export function localizePath(path: string, locale: string = DEFAULT_LOCALE): string {
    const logical = stripLocalePrefix(path);
    const normalized = logical === '/' ? '/' : '/' + logical.replace(/^\/+|\/+$/g, '');

    if (locale === DEFAULT_LOCALE || !URL_PREFIXES[locale]) {
        return normalized;
    }

    const prefix = URL_PREFIXES[locale];

    return normalized === '/' ? `/${prefix}` : `/${prefix}${normalized}`;
}

/**
 * Équivalent de l'URL courante dans une autre locale.
 */
export function alternatePath(currentPath: string, targetLocale: string): string {
    return localizePath(stripLocalePrefix(currentPath), targetLocale);
}
