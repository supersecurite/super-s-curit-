import { usePage } from '@inertiajs/react';
import { localizePath } from '@/lib/locale-url';

/**
 * Préfixe les chemins marketing selon la locale Inertia courante.
 */
export function useLocalizedUrl() {
    const { locale = 'fr' } = usePage().props as { locale?: string };

    return (path: string): string => localizePath(path, locale);
}
