import { Link, usePage } from '@inertiajs/react';
import { ChevronUp, History, Loader2 } from 'lucide-react';
import { useState } from 'react';
import {
    AccessLogsTable,
    type AccessLogFilterOptions,
    type AccessLogUserOption,
} from '@/components/access-logs/access-logs-table';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useAccessLogsFeed } from '@/hooks/use-access-logs-feed';
import { useBackofficePermission } from '@/hooks/use-backoffice-permission';
import { useHydrated } from '@/hooks/use-hydrated';
import { cn } from '@/lib/utils';
import { index as accessLogsIndex } from '@/routes/access-logs';

type SharedProps = {
    accessLogFilterUsers?: AccessLogUserOption[];
    accessLogFilterOptions?: AccessLogFilterOptions;
};

const defaultFilterOptions: AccessLogFilterOptions = {
    countries: [],
    browsers: [],
    methods: ['DELETE', 'GET', 'PATCH', 'POST', 'PUT'],
};

/**
 * Accordéon d'historique des actions — fixé en bas de toutes les pages backoffice.
 */
export function ActionHistoryAccordion({ currentPath }: { currentPath: string }) {
    const { has } = useBackofficePermission();
    const canView = has('access_logs.view');
    const hydrated = useHydrated();
    const { accessLogFilterUsers = [], accessLogFilterOptions = defaultFilterOptions } =
        usePage<SharedProps>().props;

    const [open, setOpen] = useState(false);

    const { filters, logs, users, filterOptions, loading, updateFilters, resetFilters } =
        useAccessLogsFeed({
            currentPath,
            enabled: open && canView,
            initialUsers: accessLogFilterUsers,
            initialFilterOptions: accessLogFilterOptions,
        });

    if (!canView) {
        return null;
    }

    const triggerClassName =
        'flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40 md:px-5';

    const panelClassName =
        'sticky bottom-0 z-20 mt-auto shrink-0 border-t border-border/60 bg-card/95 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur supports-[backdrop-filter]:bg-card/85';

    if (!hydrated) {
        return (
            <details className={panelClassName}>
                <summary className={cn(triggerClassName, 'list-none [&::-webkit-details-marker]:hidden')}>
                    <span className="flex min-w-0 items-center gap-2 text-sm font-semibold">
                        <History className="size-4 shrink-0 text-primary" aria-hidden />
                        Historique des actions
                    </span>
                    <ChevronUp className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </summary>
            </details>
        );
    }

    return (
        <Collapsible open={open} onOpenChange={setOpen} className={panelClassName}>
            <CollapsibleTrigger asChild>
                <button type="button" className={triggerClassName} aria-expanded={open}>
                    <span className="flex min-w-0 items-center gap-2 text-sm font-semibold">
                        <History className="size-4 shrink-0 text-primary" aria-hidden />
                        Historique des actions
                    </span>
                    <ChevronUp
                        className={cn(
                            'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                            open && 'rotate-180',
                        )}
                        aria-hidden
                    />
                </button>
            </CollapsibleTrigger>

            <CollapsibleContent className="border-t border-border/50">
                <div className="space-y-4 px-4 py-4 md:px-5">
                    <p className="text-sm">
                        <span className="font-semibold text-foreground">
                            Consultations et modifications
                        </span>{' '}
                        <span className="text-muted-foreground">
                            enregistrées automatiquement.
                        </span>
                    </p>

                    {loading && logs.data.length === 0 ? (
                        <div className="flex items-center justify-center py-10 text-muted-foreground">
                            <Loader2 className="size-5 animate-spin" aria-hidden />
                        </div>
                    ) : (
                        <AccessLogsTable
                            logs={logs}
                            users={users}
                            filterOptions={filterOptions}
                            filters={filters}
                            loading={loading}
                            embedded
                            onFiltersChange={updateFilters}
                            onPageChange={(page) => updateFilters({ page })}
                            onResetFilters={resetFilters}
                        />
                    )}

                    <div className="flex justify-end border-t border-border/50 pt-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={accessLogsIndex.url()}>
                                Ouvrir le journal complet
                            </Link>
                        </Button>
                    </div>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

/** @deprecated Utiliser `ActionHistoryAccordion`. */
export const ActionHistoryPanel = ActionHistoryAccordion;

export type { AccessLogRow as ActivityFeedItem } from '@/components/access-logs/access-logs-table';
