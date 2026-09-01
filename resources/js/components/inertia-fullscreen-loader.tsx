import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FullscreenLoader } from '@/components/ui/fullscreen-loader';
import { onShowNavigationLoader } from '@/lib/navigation-loader';
import { dashboard } from '@/routes';

/**
 * Délai avant affichage auto (évite un flash sur navigations déjà en cache).
 * Le clic menu force l'affichage immédiatement via `showNavigationLoader()`.
 */
const SHOW_DELAY_MS = 150;
const STUCK_AFTER_MS = 12_000;

const AUTH_PATH_PATTERN =
    /^\/(login|register|forgot-password|reset-password|two-factor-challenge|confirm-password)(\/|$)/;

function isAuthPage(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    return AUTH_PATH_PATTERN.test(window.location.pathname);
}

function shouldTrackVisit(visit: {
    prefetch?: boolean;
    only?: string[];
}): boolean {
    if (visit.prefetch) {
        return false;
    }

    if (visit.only && visit.only.length > 0) {
        return false;
    }

    if (isAuthPage()) {
        return false;
    }

    return true;
}

/**
 * Overlay plein écran pendant les navigations Inertia.
 *
 * Monté au niveau racine (hors provider `usePage`) — events `router` + bus menu.
 * Masquage sur `navigate` / `success` (page appliquée), y compris prefetch.
 */
export function InertiaFullscreenLoader() {
    const [isLoading, setIsLoading] = useState(false);
    const [isForm, setIsForm] = useState(false);
    const [isStuck, setIsStuck] = useState(false);
    const showTimeoutRef = useRef<number | undefined>(undefined);
    const stuckTimeoutRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const clearShowTimeout = () => {
            if (showTimeoutRef.current !== undefined) {
                window.clearTimeout(showTimeoutRef.current);
                showTimeoutRef.current = undefined;
            }
        };

        const clearStuckTimeout = () => {
            if (stuckTimeoutRef.current !== undefined) {
                window.clearTimeout(stuckTimeoutRef.current);
                stuckTimeoutRef.current = undefined;
            }
        };

        const hide = () => {
            clearShowTimeout();
            clearStuckTimeout();
            setIsLoading(false);
            setIsForm(false);
            setIsStuck(false);
        };

        const armStuckTimer = () => {
            clearStuckTimeout();
            setIsStuck(false);
            stuckTimeoutRef.current = window.setTimeout(() => {
                setIsStuck(true);
            }, STUCK_AFTER_MS);
        };

        const show = (asForm = false) => {
            clearShowTimeout();
            setIsForm(asForm);
            setIsLoading(true);
            armStuckTimer();
        };

        const removeForceShow = onShowNavigationLoader(() => {
            show(false);
        });

        const removeStart = router.on('start', (event) => {
            const visit = event.detail.visit;

            if (!shouldTrackVisit(visit)) {
                return;
            }

            const method = String(visit.method).toLowerCase();
            const asForm = method !== 'get' && method !== 'head';
            clearShowTimeout();
            clearStuckTimeout();
            setIsStuck(false);
            setIsForm(asForm);

            showTimeoutRef.current = window.setTimeout(() => {
                show(asForm);
            }, SHOW_DELAY_MS);
        });

        const removeNavigate = router.on('navigate', () => {
            hide();
        });

        const removeSuccess = router.on('success', () => {
            hide();
        });

        const removeFinish = router.on('finish', (event) => {
            if (!shouldTrackVisit(event.detail.visit)) {
                return;
            }

            hide();
        });

        const removeError = router.on('error', () => {
            hide();
        });

        const removeNetworkError = router.on('networkError', () => {
            hide();
        });

        const removeCancel = router.on('cancel', () => {
            hide();
        });

        return () => {
            clearShowTimeout();
            clearStuckTimeout();
            removeForceShow();
            removeStart();
            removeNavigate();
            removeSuccess();
            removeFinish();
            removeError();
            removeNetworkError();
            removeCancel();
        };
    }, []);

    const handleRefresh = () => {
        router.cancelAll();
        window.location.reload();
    };

    const handleLeave = () => {
        router.cancelAll();
        setIsLoading(false);
        setIsStuck(false);

        if (window.history.length > 1) {
            window.history.back();

            return;
        }

        window.location.assign(dashboard.url());
    };

    if (typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <FullscreenLoader
            isLoading={isLoading}
            spinnerType="logo"
            spinnerSize={88}
            message={
                isStuck
                    ? 'Chargement trop long'
                    : isForm
                      ? 'Enregistrement…'
                      : 'Chargement…'
            }
            subtitle={
                isStuck
                    ? 'Vous pouvez actualiser ou quitter cette page.'
                    : 'Veuillez patienter'
            }
            onRefresh={isStuck ? handleRefresh : undefined}
            onLeave={isStuck ? handleLeave : undefined}
            refreshLabel="Actualiser"
            leaveLabel="Quitter"
        />,
        document.body,
    );
}
