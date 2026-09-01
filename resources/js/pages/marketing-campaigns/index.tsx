import { Head, Link, router, usePage } from '@inertiajs/react';
import { Megaphone, Pencil, Plus, Search } from 'lucide-react';
import { useMemo } from 'react';
import {
    BackofficeFiltersBar,
    BackofficeIndexPanel,
    IndexTablePagination,
    ResponsiveDataTable,
    type ResponsiveColumn,
} from '@/components/backoffice/responsive-data-table';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { useIndexTableSort, type TableSortState } from '@/hooks/use-index-table-sort';
import { withIndexTableQuery } from '@/lib/index-table-query';
import {
    create,
    destroy,
    edit,
    index,
    show,
} from '@/routes/marketing-campaigns';

type CampaignRow = {
    uuid: string;
    name: string;
    status: string;
    status_label: string;
    subject: string;
    list: { uuid: string; name: string } | null;
    sends_count: number;
    launched_at_formatted: string | null;
    can_update: boolean;
    can_delete: boolean;
    can_send: boolean;
};

type PaginatedCampaigns = {
    data: CampaignRow[];
    current_page: number;
    last_page: number;
    total: number;
};

type PageProps = {
    campaigns: PaginatedCampaigns;
    filters: TableSortState & { search?: string };
    canCreate: boolean;
};

function statusVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
    switch (status) {
        case 'completed':
            return 'default';
        case 'failed':
            return 'destructive';
        case 'sending':
        case 'queued':
            return 'secondary';
        default:
            return 'outline';
    }
}

export default function MarketingCampaignsIndex() {
    const { campaigns, filters, canCreate } = usePage<PageProps>().props;

    const applyFilters = (updates: Partial<TableSortState & { search?: string; page?: number }>) => {
        const next = { ...filters, ...updates };
        Object.keys(next).forEach((key) => {
            if (next[key as keyof typeof next] === undefined || next[key as keyof typeof next] === '') {
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
        index.url({ query: withIndexTableQuery(filters, page) });

    const columns = useMemo((): ResponsiveColumn<CampaignRow>[] => {
        const renderActions = (campaign: CampaignRow) => (
            <>
                <Button variant="outline" size="sm" asChild>
                    <Link href={show.url(campaign.uuid)}>Voir</Link>
                </Button>
                {campaign.can_update ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={edit.url(campaign.uuid)}>
                            <Pencil className="size-4" aria-hidden />
                            Modifier
                        </Link>
                    </Button>
                ) : null}
                {campaign.can_delete ? (
                    <ConfirmDeleteDialog
                        title="Supprimer cette campagne ?"
                        description={`La campagne « ${campaign.name} » sera supprimée.`}
                        deleteUrl={destroy.url(campaign.uuid)}
                        triggerSize="sm"
                        triggerVariant="outline"
                        triggerClassName="text-destructive hover:text-destructive"
                        aria-label={`Supprimer ${campaign.name}`}
                    />
                ) : null}
            </>
        );

        return [
            {
                id: 'name',
                header: 'Campagne',
                sortKey: 'name',
                cell: (campaign) => (
                    <div>
                        <Link
                            href={show.url(campaign.uuid)}
                            className="font-medium hover:underline"
                        >
                            {campaign.name}
                        </Link>
                        <p className="text-muted-foreground mt-0.5 text-xs">{campaign.subject}</p>
                    </div>
                ),
            },
            {
                id: 'status',
                header: 'Statut',
                sortKey: 'status',
                cell: (campaign) => (
                    <Badge variant={statusVariant(campaign.status)}>{campaign.status_label}</Badge>
                ),
            },
            {
                id: 'list',
                header: 'Liste',
                cell: (campaign) => campaign.list?.name ?? '—',
            },
            {
                id: 'sends',
                header: 'Envois',
                cell: (campaign) => campaign.sends_count,
            },
            {
                id: 'launched_at',
                header: 'Lancée le',
                sortKey: 'launched_at',
                cell: (campaign) => campaign.launched_at_formatted ?? '—',
            },
            {
                id: 'actions',
                header: '',
                cell: renderActions,
                className: 'text-right',
            },
        ];
    }, []);

    return (
        <>
            <Head title="Campagnes e-mail" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
                            <Megaphone className="size-6" aria-hidden />
                            Campagnes e-mail
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Créez et suivez vos campagnes vers vos listes de contacts.
                        </p>
                    </div>

                    {canCreate ? (
                        <Button asChild>
                            <Link href={create.url()}>
                                <Plus className="size-4" aria-hidden />
                                Nouvelle campagne
                            </Link>
                        </Button>
                    ) : null}
                </div>

                <BackofficeIndexPanel>
                    <BackofficeFiltersBar>
                        <div className="space-y-1">
                            <Label htmlFor="search">Rechercher</Label>
                            <div className="relative">
                                <Search
                                    className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
                                    aria-hidden
                                />
                                <Input
                                    id="search"
                                    defaultValue={filters.search ?? ''}
                                    placeholder="Nom ou objet…"
                                    className="pl-8"
                                    onChange={(event) => debouncedSearch(event.target.value)}
                                />
                            </div>
                        </div>
                    </BackofficeFiltersBar>

                    <ResponsiveDataTable
                        rows={campaigns.data}
                        columns={columns}
                        getRowKey={(campaign) => campaign.uuid}
                        emptyMessage="Aucune campagne pour le moment."
                        minWidth="720px"
                        sort={filters}
                        onSort={handleSort}
                    />
                </BackofficeIndexPanel>

                <IndexTablePagination
                    paginated={campaigns}
                    itemLabel="campagne(s)"
                    buildPageUrl={buildPageUrl}
                />
            </div>
        </>
    );
}

MarketingCampaignsIndex.layout = {
    breadcrumbs: [{ title: 'Campagnes e-mail', href: index.url() }],
};
