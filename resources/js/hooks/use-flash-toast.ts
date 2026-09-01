import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import {
    playSuccessSound,
    playWelcomeSound,
    unlockNotificationSound,
} from '@/lib/notification-sound';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    useEffect(() => unlockNotificationSound(), []);

    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashToast | undefined;

            if (!data) {
                return;
            }

            toast[data.type](data.message);

            if (data.sound === false) {
                return;
            }

            if (data.sound === 'welcome') {
                playWelcomeSound();

                return;
            }

            if (data.sound === 'success' || data.type === 'success') {
                playSuccessSound();
            }
        });
    }, []);
}
