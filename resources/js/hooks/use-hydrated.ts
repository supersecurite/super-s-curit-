import { useEffect, useState } from 'react';

/**
 * Indique si le composant est monté côté client (après hydratation).
 *
 * Utile pour les widgets Radix dont le markup SSR diffère (Collapsible, etc.).
 */
export function useHydrated(): boolean {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    return hydrated;
}
