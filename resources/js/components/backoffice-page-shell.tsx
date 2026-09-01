import type { ReactNode } from 'react';
import { ActionHistoryAccordion } from '@/components/action-history-panel';
import { useCurrentUrl } from '@/hooks/use-current-url';

/**
 * Enveloppe le contenu backoffice : zone scrollable + accordéon journal en bas.
 * Masqué sur `/access-logs` (page dédiée avec le même tableau).
 */
export function BackofficePageShell({ children }: { children: ReactNode }) {
    const { currentUrl } = useCurrentUrl();
    const hideActionHistory = currentUrl === '/access-logs';

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
            {!hideActionHistory ? (
                <ActionHistoryAccordion currentPath={currentUrl} />
            ) : null}
        </div>
    );
}
