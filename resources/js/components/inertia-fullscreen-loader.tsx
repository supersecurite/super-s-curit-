import { router } from '@inertiajs/react';
import type { Page } from '@inertiajs/core';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FullscreenLoader } from '@/components/ui/fullscreen-loader';
import { onShowNavigationLoader } from '@/lib/navigation-loader';
import { dashboard } from '@/routes';

/**
 * Délai avant affichage auto — évite flash et sensation de lenteur
 * sur navigations déjà en cache / prefetchées.
 * Le clic menu backoffice force l'affichage via `showNavigationLoader()`.
 */
const SHOW_DELAY_MS = 220;
const STUCK_AFTER_MS = 12_000;

const AUTH_PATH_PATTERN =
    /^\/(login|register|forgot-password|reset-password|two-factor-challenge|confirm-password)(\/|$)/;

type LoaderCopy = {
    loading: string;
    saving: string;
    stuck: string;
    please_wait: string;
    stuck_hint: string;
    refresh: string;
    leave: string;
};

const FALLBACK_COPY: Record<string, LoaderCopy> = {
    fr: {
        loading: 'Chargement…',
        saving: 'Enregistrement…',
        stuck: 'Chargement trop long',
        please_wait: 'Veuillez patienter',
        stuck_hint: 'Vous pouvez actualiser ou quitter cette page.',
        refresh: 'Actualiser',
        leave: 'Quitter',
    },
    en: {
        loading: 'Loading…',
        saving: 'Saving…',
        stuck: 'Taking longer than usual',
        please_wait: 'Please wait',
        stuck_hint: 'You can refresh or leave this page.',
        refresh: 'Refresh',
        leave: 'Leave',
    },
    zh: {
        loading: '加载中…',
        saving: '正在保存…',
        stuck: '加载时间过长',
        please_wait: '请稍候',
        stuck_hint: '您可以刷新或离开此页面。',
        refresh: '刷新',
        leave: '离开',
    },
};

function readNestedString(
    source: unknown,
    key: string,
): string | undefined {
    if (!source || typeof source !== 'object') {
        return undefined;
    }

    const value = (source as Record<string, unknown>)[key];

    return typeof value === 'string' ? value : undefined;
}

function resolveLocale(page?: Page): string {
    const fromProps = page?.props?.locale;

    if (typeof fromProps === 'string' && fromProps !== '') {
        return fromProps;
    }

    if (typeof document !== 'undefined') {
        const lang = document.documentElement.lang.split('-')[0];

        if (lang) {
            return lang;
        }
    }

    return 'fr';
}

function resolveCopy(page?: Page): LoaderCopy {
    const locale = resolveLocale(page);
    const fallback = FALLBACK_COPY[locale] ?? FALLBACK_COPY.fr;
    const group = (page?.props?.translations as Record<string, unknown> | undefined)
        ?.fullscreen_loader;

    return {
        loading: readNestedString(group, 'loading') ?? fallback.loading,
        saving: readNestedString(group, 'saving') ?? fallback.saving,
        stuck: readNestedString(group, 'stuck') ?? fallback.stuck,
        please_wait:
            readNestedString(group, 'please_wait') ?? fallback.please_wait,
        stuck_hint: readNestedString(group, 'stuck_hint') ?? fallback.stuck_hint,
        refresh: readNestedString(group, 'refresh') ?? fallback.refresh,
        leave: readNestedString(group, 'leave') ?? fallback.leave,
    };
}

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

function leaveFallbackUrl(): string {
    if (
        typeof document !== 'undefined' &&
        document.documentElement.classList.contains('marketing-page')
    ) {
        return '/';
    }

    return dashboard.url();
}

/**
 * Overlay plein écran pendant les navigations Inertia.
 *
 * Monté via `withApp` (hors provider `usePage`) — events `router` + bus menu.
 * Masquage immédiat sur `navigate` / `success` / `finish`.
 * Overlay non bloquant tant que la visite n'est pas bloquée (stuck).
 */
export function InertiaFullscreenLoader() {
    const [isLoading, setIsLoading] = useState(false);
    const [isForm, setIsForm] = useState(false);
    const [isStuck, setIsStuck] = useState(false);
    const [copy, setCopy] = useState<LoaderCopy>(() => resolveCopy());
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

        const syncCopy = (page: Page) => {
            setCopy(resolveCopy(page));
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

        const removeNavigate = router.on('navigate', (event) => {
            syncCopy(event.detail.page);
            hide();
        });

        const removeSuccess = router.on('success', (event) => {
            syncCopy(event.detail.page);
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

        window.location.assign(leaveFallbackUrl());
    };

    if (typeof document === 'undefined' || !isLoading) {
        return null;
    }

    return createPortal(
        <FullscreenLoader
            isLoading
            spinnerType="logo"
            spinnerSize={88}
            message={
                isStuck
                    ? copy.stuck
                    : isForm
                      ? copy.saving
                      : copy.loading
            }
            subtitle={isStuck ? copy.stuck_hint : copy.please_wait}
            overlayClassName="bg-black/55"
            blocking={isStuck}
            onRefresh={isStuck ? handleRefresh : undefined}
            onLeave={isStuck ? handleLeave : undefined}
            refreshLabel={copy.refresh}
            leaveLabel={copy.leave}
        />,
        document.body,
    );
}
