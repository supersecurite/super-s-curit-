import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import InactivityLockScreen from '@/components/inactivity-lock-screen';
import { useInactivityLock } from '@/hooks/use-inactivity-lock';

export default function InactivityLockProvider({
    children,
}: {
    children: ReactNode;
}) {
    const { auth, inactivityLock } = usePage().props;
    const isAuthenticated = auth?.user !== null && auth?.user !== undefined;

    const { isLocked, unlock } = useInactivityLock({
        enabled: isAuthenticated && inactivityLock.enabled,
        timeoutMs: inactivityLock.timeoutMs,
    });

    return (
        <>
            {children}
            {isAuthenticated && isLocked && (
                <InactivityLockScreen onUnlock={unlock} />
            )}
        </>
    );
}
