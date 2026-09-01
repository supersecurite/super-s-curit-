/**
 * Bus léger pour forcer le FullscreenLoader au clic menu.
 *
 * Les `Link prefetch` Inertia démarrent la visite en prefetch (ignorée par le
 * loader) ; au clic réel, on affiche immédiatement le loader jusqu'à
 * `navigate` / `success` (page appliquée), pas seulement le `finish` HTTP.
 */

type Listener = () => void;

const listeners = new Set<Listener>();

export function showNavigationLoader(): void {
    listeners.forEach((listener) => listener());
}

export function onShowNavigationLoader(listener: Listener): () => void {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}
