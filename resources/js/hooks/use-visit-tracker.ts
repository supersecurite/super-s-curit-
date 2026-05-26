import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { duration as durationRoute } from '@/routes/analytics';

/**
 * Sends page duration to the server when the user leaves.
 * Attached to every page via the app layout.
 */
export function useVisitTracker() {
    const startedAt = useRef<number>(Date.now());
    const path = useRef<string>(window.location.pathname);
    const sessionId = useRef<string>(getOrCreateSessionId());

    // Reset timer on every Inertia navigation
    useEffect(() => {
        const unsubscribe = router.on('navigate', () => {
            sendDuration(path.current, startedAt.current, sessionId.current);
            startedAt.current = Date.now();
            path.current = window.location.pathname;
        });

        return () => unsubscribe();
    }, []);

    // Also flush when the browser tab closes / navigates away
    useEffect(() => {
        const flush = () => {
            sendDuration(path.current, startedAt.current, sessionId.current);
        };

        window.addEventListener('beforeunload', flush);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                flush();
            }
        });

        return () => {
            window.removeEventListener('beforeunload', flush);
        };
    }, []);
}

function sendDuration(
    currentPath: string,
    startedAt: number,
    sessionId: string,
): void {
    const duration = Math.round((Date.now() - startedAt) / 1000);
    if (duration < 2) {
        return;
    }

    const payload = JSON.stringify({
        session_id: sessionId,
        path: currentPath,
        duration,
    });

    // Use sendBeacon when available (non-blocking, survives page unload)
    if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(durationRoute.url(), blob);
    } else {
        fetch(durationRoute.url(), {
            method: 'POST',
            body: payload,
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
        }).catch(() => {});
    }
}

function getOrCreateSessionId(): string {
    const key = 'aristech_sid';
    let id = sessionStorage.getItem(key);
    if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem(key, id);
    }

    return id;
}
