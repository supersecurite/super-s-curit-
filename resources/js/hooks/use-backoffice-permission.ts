import { usePage } from '@inertiajs/react';
import {
    canAccessBackofficeFeature,
    hasBackofficePermission,
} from '@/lib/backoffice-permissions';
import type { Auth } from '@/types';

type PageWithAuth = {
    auth: Auth;
};

export function useBackofficePermission() {
    const { auth } = usePage<PageWithAuth>().props;
    const permissions = auth.user?.permissions ?? [];

    return {
        permissions,
        has: (permission: string) =>
            hasBackofficePermission(permissions, permission),
        canAccessFeature: (feature: string) =>
            canAccessBackofficeFeature(permissions, feature),
        canApproveArticles: auth.user?.can_approve_articles ?? false,
        canApproveConseils: auth.user?.can_approve_conseils ?? false,
    };
}
