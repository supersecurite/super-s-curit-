import { useEffect } from 'react';
import { getEcho } from '@/lib/echo';

export type CampaignProgressPayload = {
    campaign: {
        uuid: string;
        name: string;
        status: string;
        status_label: string;
        launched_at_formatted: string | null;
        completed_at_formatted: string | null;
        stats: {
            total: number;
            queued: number;
            sent: number;
            received: number;
            read: number;
            failed: number;
            bounced: number;
        };
    };
    send: {
        uuid: string;
        recipient_email: string | null;
        recipient_phone: string | null;
        recipient_name: string | null;
        status: string;
        status_label: string;
        sent_at_formatted: string | null;
        received_at_formatted: string | null;
        delivered_at_formatted: string | null;
        read_at_formatted: string | null;
        failed_at_formatted: string | null;
        failure_reason: string | null;
    } | null;
};

/**
 * Écoute les mises à jour WebSocket d'une campagne (envois, ouvertures, clôture).
 */
export function useMarketingCampaignRealtime(
    campaignUuid: string,
    enabled: boolean,
    onUpdate: (payload: CampaignProgressPayload) => void,
): void {
    useEffect(() => {
        if (!enabled) {
            return;
        }

        const echo = getEcho();

        if (echo === null) {
            return;
        }

        const channel = echo.private(`marketing-campaign.${campaignUuid}`);

        channel.listen('.progress.updated', (payload: CampaignProgressPayload) => {
            onUpdate(payload);
        });

        return () => {
            channel.stopListening('.progress.updated');
            echo.leave(`marketing-campaign.${campaignUuid}`);
        };
    }, [campaignUuid, enabled, onUpdate]);
}
