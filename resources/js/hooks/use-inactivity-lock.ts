import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'super-securite-profile-locked';

const ACTIVITY_EVENTS = [
    'mousedown',
    'mousemove',
    'keydown',
    'touchstart',
    'scroll',
    'click',
] as const;

type UseInactivityLockOptions = {
    enabled: boolean;
    timeoutMs: number;
};

export function useInactivityLock({
    enabled,
    timeoutMs,
}: UseInactivityLockOptions) {
    const [locked, setLocked] = useState(
        () =>
            typeof window !== 'undefined' &&
            sessionStorage.getItem(STORAGE_KEY) === '1',
    );
    const lastActivityRef = useRef(0);
    const isLockedRef = useRef(false);
    const enabledRef = useRef(enabled);

    const isLocked = enabled && locked;

    useEffect(() => {
        enabledRef.current = enabled;
        isLockedRef.current = isLocked;
    }, [enabled, isLocked]);

    const lock = useCallback(() => {
        if (!enabledRef.current) {
            return;
        }

        sessionStorage.setItem(STORAGE_KEY, '1');
        setLocked(true);
    }, []);

    const unlock = useCallback(() => {
        sessionStorage.removeItem(STORAGE_KEY);
        setLocked(false);
        lastActivityRef.current = performance.now();
    }, []);

    const registerActivity = useCallback(() => {
        if (!enabledRef.current || isLockedRef.current) {
            return;
        }

        lastActivityRef.current = performance.now();
    }, []);

    useEffect(() => {
        if (!enabled) {
            sessionStorage.removeItem(STORAGE_KEY);

            return;
        }

        lastActivityRef.current = performance.now();

        let throttleId: ReturnType<typeof setTimeout> | null = null;

        const onThrottledActivity = (): void => {
            if (throttleId) {
                return;
            }

            throttleId = setTimeout(() => {
                throttleId = null;
                registerActivity();
            }, 1000);
        };

        ACTIVITY_EVENTS.forEach((event) => {
            window.addEventListener(event, onThrottledActivity, {
                passive: true,
            });
        });

        const intervalId = window.setInterval(() => {
            if (isLockedRef.current || !enabledRef.current) {
                return;
            }

            if (performance.now() - lastActivityRef.current >= timeoutMs) {
                lock();
            }
        }, 5_000);

        registerActivity();

        return () => {
            ACTIVITY_EVENTS.forEach((event) => {
                window.removeEventListener(event, onThrottledActivity);
            });

            if (throttleId) {
                clearTimeout(throttleId);
            }

            window.clearInterval(intervalId);
        };
    }, [enabled, timeoutMs, lock, registerActivity]);

    return { isLocked, lock, unlock };
}
