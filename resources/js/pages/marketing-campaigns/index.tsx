import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, Megaphone, Pencil, Plus, RotateCcw, Search } from 'lucide-react';
import { useMemo } from 'react';
import {
    BackofficeFiltersBar,
    BackofficeIndexPanel,
    IndexTablePagination,
    ResponsiveDataTable,
    type ResponsiveColumn,
} from '@/components/backoffice/responsive-data-table';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import CampaignLaunchDialog from '@/components/marketing-campaigns/campaign-launch-dialog';
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
    retry,
    show,
} from '@/routes/marketing-campaigns';

type CampaignRow = {
    uuid: string;
    name: string;
    channel: string;
    status: string;
    status_label: string;
    subject: string | null;
    list: { uuid: string; name: string } | null;
    lists: { uuid: string; name: string }[];
    audience_contacts: { uuid: string; full_name: string }[];
    sends_count: number;
    launched_at_formatted: string | null;
    scheduled_at_formatted: string | null;
    can_update: boolean;
    can_delete: boolean;
    can_send: boolean;
    can_retry?: boolean;
};

type PaginatedCampaigns = {
    data: CampaignRow[];
    current_page: number;
    last_page: number;
    total: number;
};

type PageProps = {
    campaigns: PaginatedCampaigns;
    channel: 'email' | 'whatsapp' | 'all';
    filters: TableSortState & { search?: string; channel?: string };
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
        case 'scheduled':
            return 'secondary';
        default:
            return 'outline';
    }
}

function audienceLabel(campaign: CampaignRow): string {
    const listNames = (campaign.lists ?? []).map((list) => list.name);
    const directCount = campaign.audience_contacts?.length ?? 0;

    if (listNames.length === 0 && directCount === 0) {
        return campaign.list?.name ?? '—';
    }

    const parts: string[] = [];

    if (listNames.length === 1) {
        parts.push(listNames[0]);
    } else if (listNames.length > 1) {
        parts.push(`${listNames.length} groupes`);
    }

    if (directCount > 0) {
        parts.push(
            `${directCount} contact${directCount > 1 ? 's' : ''} direct${directCount > 1 ? 's' : ''}`,
        );
    }

    return parts.join(' + ') || '—';
}

export default function MarketingCampaignsIndex() {
    const { campaigns, channel, filters, canCreate } = usePage<PageProps>().props;
    const activeChannel = channel === 'whatsapp' ? 'whatsapp' : 'email';
    const isWhatsApp = activeChannel === 'whatsapp';
    const title = isWhatsApp ? 'Campagnes WhatsApp' : 'Campagnes e-mail';

    const applyFilters = (
        updates: Partial<TableSortState & { search?: string; channel?: string; page?: number }>,
    ) => {
        const next = { ...filters, channel: activeChannel, ...updates };
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
        index.url({ query: withIndexTableQuery({ ...filters, channel: activeChannel }, page) });

    const columns = useMemo((): ResponsiveColumn<CampaignRow>[] => {
        const renderActions = (campaign: CampaignRow) => (
            <div className="flex items-center justify-end gap-1.5">
                {campaign.can_retry ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.post(retry.url(campaign.uuid), {}, { preserveScroll: true })}
                        title="Relancer les envois échoués"
                    >
                        <RotateCcw className="size-4" aria-hidden />
                        Relancer
                    </Button>
                ) : null}
                {campaign.can_send ? (
                    <CampaignLaunchDialog
                        campaignUuid={campaign.uuid}
                        campaignName={campaign.name}
                        triggerVariant="outline"
                        triggerSize="sm"
                        triggerLabel="Lancer"
                    />
                ) : null}
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
            </div>
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
                        {!isWhatsApp && campaign.subject ? (
                            <p className="text-muted-foreground mt-0.5 text-xs">{campaign.subject}</p>
                        ) : null}
                    </div>
                ),
            },
            {
                id: 'status',
                header: 'Statut',
                sortKey: 'status',
                cell: (campaign) => (
                    <div className="flex flex-col items-start gap-1">
                        <Badge variant={statusVariant(campaign.status)}>{campaign.status_label}</Badge>
                        {campaign.status === 'scheduled' && campaign.scheduled_at_formatted ? (
                            <span className="text-muted-foreground flex items-center gap-1 text-xs">
                                <Calendar className="size-3 shrink-0" aria-hidden />
                                {campaign.scheduled_at_formatted}
                            </span>
                        ) : null}
                    </div>
                ),
            },
            {
                id: 'audience',
                header: 'Audience',
                cell: (campaign) => audienceLabel(campaign),
            },
            {
                id: 'sends',
                header: 'Envois',
                cell: (campaign) => campaign.sends_count,
            },
            {
                id: 'launched_at',
                header: 'Lancée / Prévue le',
                sortKey: 'launched_at',
                cell: (campaign) => {
                    if (campaign.launched_at_formatted) {
                        return campaign.launched_at_formatted;
                    }
                    if (campaign.status === 'scheduled' && campaign.scheduled_at_formatted) {
                        return (
                            <span className="text-muted-foreground flex items-center gap-1 text-sm">
                                <Calendar className="size-3.5 shrink-0" aria-hidden />
                                <span>{campaign.scheduled_at_formatted}</span>
                            </span>
                        );
                    }
                    return '—';
                },
            },
            {
                id: 'actions',
                header: '',
                cell: renderActions,
                className: 'text-right',
            },
        ];
    }, [isWhatsApp]);

    return (
        <>
            <Head title={title} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
                            <Megaphone className="size-6" aria-hidden />
                            {title}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {isWhatsApp
                                ? 'Campagnes WhatsApp uniquement — templates Meta, accusés de réception et de lecture.'
                                : 'Campagnes e-mail uniquement — groupes, contacts et suivi d’ouvertures.'}
                        </p>
                    </div>

                    {canCreate ? (
                        <Button asChild>
                            <Link href={create.url({ query: { channel: activeChannel } })}>
                                <Plus className="size-4" aria-hidden />
                                Nouvelle campagne {isWhatsApp ? 'WhatsApp' : 'e-mail'}
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
                                    placeholder={isWhatsApp ? 'Nom…' : 'Nom ou objet…'}
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
                        emptyMessage={`Aucune campagne ${isWhatsApp ? 'WhatsApp' : 'e-mail'} pour le moment.`}
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
    breadcrumbs: [{ title: 'Campagnes', href: index.url({ query: { channel: 'email' } }) }],
};
