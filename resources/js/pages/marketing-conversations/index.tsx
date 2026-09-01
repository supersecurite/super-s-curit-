import { Head, Link, router, usePage } from '@inertiajs/react';
import { Mail, MessageSquare } from 'lucide-react';
import {
    BackofficeFiltersBar,
    BackofficeIndexPanel,
    IndexTablePagination,
    ResponsiveDataTable,
    type ResponsiveColumn,
} from '@/components/backoffice/responsive-data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { useIndexTableSort, type TableSortState } from '@/hooks/use-index-table-sort';
import { withIndexTableQuery } from '@/lib/index-table-query';
import { index, show } from '@/routes/marketing-conversations';

type ConversationRow = {
    uuid: string;
    subject: string | null;
    unread_inbound_count: number;
    last_message_at_formatted: string | null;
    contact: {
        uuid: string;
        full_name: string;
        email: string | null;
    } | null;
    can_reply: boolean;
};

type PaginatedConversations = {
    data: ConversationRow[];
    current_page: number;
    last_page: number;
    total: number;
};

type PageProps = {
    conversations: PaginatedConversations;
    filters: TableSortState & { search?: string; unread_only?: boolean };
};

export default function MarketingConversationsIndex() {
    const { conversations, filters } = usePage<PageProps>().props;

    const applyFilters = (
        updates: Partial<TableSortState & { search?: string; unread_only?: boolean; page?: number }>,
    ) => {
        const next = { ...filters, ...updates };
        Object.keys(next).forEach((key) => {
            const value = next[key as keyof typeof next];
            if (value === undefined || value === '' || value === false) {
                delete next[key as keyof typeof next];
            }
        });
        router.get(index.url(), next, { preserveState: true, replace: true });
    };

    const handleSort = useIndexTableSort(filters, applyFilters);
    const debouncedSearch = useDebouncedCallback((search: string) => {
        applyFilters({ search: search || undefined, page: 1 });
    });

    const buildPageUrl = (page: number) =>
        index.url({
            query: withIndexTableQuery(
                {
                    search: filters.search,
                    sort_by: filters.sort_by,
                    sort_direction: filters.sort_direction,
                    unread_only: filters.unread_only ? '1' : undefined,
                },
                page,
            ),
        });

    const columns: ResponsiveColumn<ConversationRow>[] = [
        {
            id: 'contact',
            header: 'Contact',
            cell: (row) => (
                <div>
                    <p className="font-medium">{row.contact?.full_name ?? '—'}</p>
                    {row.contact?.email ? (
                        <p className="text-muted-foreground text-xs">{row.contact.email}</p>
                    ) : null}
                </div>
            ),
        },
        {
            id: 'subject',
            header: 'Sujet',
            cell: (row) => row.subject ?? '—',
        },
        {
            id: 'unread',
            header: 'Non lus',
            cell: (row) =>
                row.unread_inbound_count > 0 ? (
                    <Badge variant="destructive">{row.unread_inbound_count}</Badge>
                ) : (
                    '—'
                ),
        },
        {
            id: 'last_message_at',
            header: 'Dernier message',
            sortKey: 'last_message_at',
            cell: (row) => row.last_message_at_formatted ?? '—',
        },
        {
            id: 'actions',
            header: '',
            cell: (row) => (
                <Button variant="outline" size="sm" asChild>
                    <Link href={show.url(row.uuid)}>Ouvrir</Link>
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Conversations e-mail" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
                            <MessageSquare className="size-6" aria-hidden />
                            Conversations e-mail
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Réponses des destinataires de campagnes et échanges manuels.
                        </p>
                    </div>
                </div>

                <BackofficeFiltersBar>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="search">Recherche</Label>
                            <Input
                                id="search"
                                defaultValue={filters.search ?? ''}
                                placeholder="Nom, e-mail…"
                                onChange={(event) => debouncedSearch(event.target.value)}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                type="button"
                                variant={filters.unread_only ? 'default' : 'outline'}
                                onClick={() =>
                                    applyFilters({
                                        unread_only: !filters.unread_only,
                                        page: 1,
                                    })
                                }
                            >
                                <Mail className="size-4" aria-hidden />
                                Non lus uniquement
                            </Button>
                        </div>
                    </div>
                </BackofficeFiltersBar>

                <BackofficeIndexPanel>
                    <ResponsiveDataTable<ConversationRow>
                        rows={conversations.data}
                        columns={columns}
                        getRowKey={(row) => row.uuid}
                        emptyMessage="Aucune conversation pour le moment."
                        sort={filters}
                        onSort={handleSort}
                    />
                    <IndexTablePagination
                        paginated={conversations}
                        itemLabel="conversations"
                        buildPageUrl={buildPageUrl}
                    />
                </BackofficeIndexPanel>
            </div>
        </>
    );
}

MarketingConversationsIndex.layout = {
    breadcrumbs: [{ title: 'Conversations e-mail', href: index.url() }],
};
