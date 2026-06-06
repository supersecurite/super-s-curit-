import { router } from '@inertiajs/react';
import { useSyncExternalStore } from 'react';

type InertiaVisit = {
    method?: string;
    prefetch?: boolean;
    only?: string[];
};

type LoaderState = {
    activeVisits: number;
    message?: string;
    subtitle?: string;
};

let state: LoaderState = {
    activeVisits: 0,
};

const listeners = new Set<() => void>();
let routerSubscribed = false;

const AUTH_PATH_PATTERN =
    /^\/(login|register|forgot-password|reset-password|two-factor-challenge|confirm-password)(\/|$)/;

function emit(): void {
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
    listeners.add(listener);

    return () => listeners.delete(listener);
}

function getSnapshot(): LoaderState {
    return state;
}

function isAuthPage(): boolean {
    return AUTH_PATH_PATTERN.test(window.location.pathname);
}

function shouldShowLoader(visit: InertiaVisit): boolean {
    if (visit.prefetch) {
        return false;
    }

    if (visit.only && visit.only.length > 0) {
        return false;
    }

    if (isAuthPage()) {
        return false;
    }

    const method = (visit.method ?? 'get').toLowerCase();

    return method !== 'get' && method !== 'head';
}

function loaderMessage(method?: string): {
    message: string;
    subtitle: string;
} {
    return {
        message: 'Traitement en cours...',
        subtitle:
            method === 'delete'
                ? 'Suppression en cours, veuillez patienter'
                : 'Veuillez patienter quelques instants',
    };
}

function resetLoader(): void {
    if (state.activeVisits === 0 && state.message === undefined) {
        return;
    }

    state = {
        activeVisits: 0,
        message: undefined,
        subtitle: undefined,
    };
    emit();
}

function subscribeToRouterOnce(): void {
    if (routerSubscribed) {
        return;
    }

    routerSubscribed = true;

    router.on('start', (event) => {
        const visit = (event as CustomEvent<{ visit: InertiaVisit }>).detail
            .visit;

        if (!shouldShowLoader(visit)) {
            return;
        }

        const labels = loaderMessage(visit.method);

        state = {
            activeVisits: state.activeVisits + 1,
            message: labels.message,
            subtitle: labels.subtitle,
        };
        emit();
    });

    router.on('before', resetLoader);
    router.on('finish', resetLoader);
    router.on('error', resetLoader);
    router.on('cancel', resetLoader);
}

subscribeToRouterOnce();

export function useGlobalFullscreenLoader(): {
    isLoading: boolean;
    message?: string;
    subtitle?: string;
} {
    const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    return {
        isLoading: snapshot.activeVisits > 0,
        message: snapshot.message,
        subtitle: snapshot.subtitle,
    };
}
