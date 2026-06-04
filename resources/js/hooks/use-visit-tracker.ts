import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { duration as durationRoute } from '@/routes/analytics';

const VISITOR_COOKIE = 'super_securite_vid';
const HEARTBEAT_INTERVAL_MS = 30_000;
const MIN_DURATION_SECONDS = 1;

type SharedTracking = {
    tracking?: {
        visitor_uuid?: string | null;
    };
};

/**
 * Sends page duration to the server when the user leaves or periodically.
 * Attached to the marketing layout only.
 */
export function useVisitTracker() {
    const { tracking } = usePage<SharedTracking>().props;
    const startedAt = useRef<number>(Date.now());
    const path = useRef<string>(window.location.pathname);
    const visitorUuid = useRef<string | null>(
        tracking?.visitor_uuid ?? readCookie(VISITOR_COOKIE),
    );

    useEffect(() => {
        visitorUuid.current =
            tracking?.visitor_uuid ?? readCookie(VISITOR_COOKIE) ?? visitorUuid.current;
    }, [tracking?.visitor_uuid]);

    useEffect(() => {
        const unsubscribe = router.on('finish', () => {
            flushDuration(path.current, startedAt.current, visitorUuid.current);
            startedAt.current = Date.now();
            path.current = window.location.pathname;
            visitorUuid.current = readCookie(VISITOR_COOKIE) ?? visitorUuid.current;
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const flush = () => {
            flushDuration(path.current, startedAt.current, visitorUuid.current);
        };

        const onVisibility = () => {
            if (document.visibilityState === 'hidden') {
                flush();
            }
        };

        const heartbeat = window.setInterval(() => {
            if (document.visibilityState === 'visible') {
                flush();
            }
        }, HEARTBEAT_INTERVAL_MS);

        window.addEventListener('pagehide', flush);
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            window.clearInterval(heartbeat);
            window.removeEventListener('pagehide', flush);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);
}

function flushDuration(
    currentPath: string,
    startedAt: number,
    uuid: string | null,
): void {
    const duration = Math.round((Date.now() - startedAt) / 1000);
    if (duration < MIN_DURATION_SECONDS) {
        return;
    }

    sendDuration(currentPath, duration, uuid ?? readCookie(VISITOR_COOKIE));
}

function sendDuration(
    currentPath: string,
    duration: number,
    visitorUuid: string | null,
): void {
    const payload = JSON.stringify({
        visitor_uuid: visitorUuid,
        path: currentPath,
        duration,
    });

    const url = durationRoute.url();
    const csrfToken = getCsrfToken();

    if (!csrfToken) {
        return;
    }

    fetch(url, {
        method: 'POST',
        body: payload,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
        keepalive: true,
    }).catch(() => {});
}

function getCsrfToken(): string {
    return (
        document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
            ?.content ?? ''
    );
}

function readCookie(name: string): string | null {
    const prefix = `${name}=`;
    const cookies = document.cookie.split(';');
    for (const raw of cookies) {
        const cookie = raw.trim();
        if (cookie.startsWith(prefix)) {
            return decodeURIComponent(cookie.substring(prefix.length));
        }
    }
    return null;
}
