import { Head, Link, router, usePage } from '@inertiajs/react';
import { FileText, Pencil, Plus, Search } from 'lucide-react';
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
} from '@/routes/marketing-templates';

type TemplateRow = {
    uuid: string;
    name: string;
    channel: string;
    channel_label: string;
    subject: string | null;
    can_update: boolean;
    can_delete: boolean;
    created_at_formatted: string | null;
};

type PaginatedTemplates = {
    data: TemplateRow[];
    current_page: number;
    last_page: number;
    total: number;
};

type PageProps = {
    templates: PaginatedTemplates;
    channel: 'email' | 'whatsapp';
    filters: TableSortState & { search?: string; channel?: string };
    canCreate: boolean;
};

export default function MarketingTemplatesIndex() {
    const { templates, channel, filters, canCreate } = usePage<PageProps>().props;
    const activeChannel = channel === 'whatsapp' ? 'whatsapp' : 'email';
    const isWhatsApp = activeChannel === 'whatsapp';
    const title = isWhatsApp ? 'Templates WhatsApp' : 'Templates e-mail';

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

    const columns = useMemo((): ResponsiveColumn<TemplateRow>[] => {
        const renderActions = (template: TemplateRow) => (
            <>
                <Button variant="outline" size="sm" asChild>
                    <Link href={show.url(template.uuid)}>Voir</Link>
                </Button>
                {template.can_update ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={edit.url(template.uuid)}>
                            <Pencil className="size-4" aria-hidden />
                            Modifier
                        </Link>
                    </Button>
                ) : null}
                {template.can_delete ? (
                    <ConfirmDeleteDialog
                        title="Supprimer ce template ?"
                        description={`Le template « ${template.name} » sera définitivement supprimé.`}
                        deleteUrl={destroy.url(template.uuid)}
                        triggerLabel="Supprimer"
                        triggerVariant="outline"
                        triggerSize="sm"
                        triggerClassName="text-destructive hover:text-destructive"
                    />
                ) : null}
            </>
        );

        return [
            {
                id: 'name',
                header: 'Titre',
                sortKey: 'name',
                sortable: true,
                mobileRole: 'title',
                cell: (template) => (
                    <Link
                        href={show.url(template.uuid)}
                        className="font-medium hover:underline"
                    >
                        {template.name}
                    </Link>
                ),
            },
            {
                id: 'channel',
                header: 'Canal',
                sortKey: 'channel',
                sortable: true,
                mobileRole: 'meta',
                cell: (template) => (
                    <Badge variant="outline">{template.channel_label}</Badge>
                ),
            },
            {
                id: 'subject',
                header: isWhatsApp ? 'Modèle Meta' : 'Objet',
                sortKey: 'subject',
                sortable: true,
                mobileRole: 'subtitle',
                className: 'text-muted-foreground',
                cell: (template) => template.subject ?? '—',
            },
            {
                id: 'created_at',
                header: 'Créé le',
                sortKey: 'created_at',
                sortable: true,
                mobileRole: 'meta',
                cell: (template) => template.created_at_formatted ?? '—',
            },
            {
                id: 'actions',
                header: 'Actions',
                mobileRole: 'actions',
                headerClassName: 'text-right',
                className: 'text-right',
                cell: renderActions,
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
                            <FileText className="size-6" aria-hidden />
                            {title}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {isWhatsApp
                                ? 'Templates WhatsApp uniquement — modèles Meta approuvés.'
                                : 'Templates e-mail uniquement — variables dynamiques pour les campagnes.'}
                        </p>
                    </div>
                    {canCreate ? (
                        <Button asChild>
                            <Link href={create.url({ query: { channel: activeChannel } })}>
                                <Plus className="size-4" aria-hidden />
                                Nouveau template {isWhatsApp ? 'WhatsApp' : 'e-mail'}
                            </Link>
                        </Button>
                    ) : null}
                </div>

                <BackofficeFiltersBar>
                    <div className="relative min-w-0 flex-1 lg:min-w-[240px]">
                        <Label htmlFor="templates-search" className="sr-only">
                            Rechercher
                        </Label>
                        <Search
                            className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
                            aria-hidden
                        />
                        <Input
                            id="templates-search"
                            type="search"
                            defaultValue={filters.search ?? ''}
                            placeholder="Titre, objet, contenu…"
                            className="pl-9"
                            onChange={(event) => debouncedSearch(event.target.value)}
                        />
                    </div>
                </BackofficeFiltersBar>

                <BackofficeIndexPanel>
                    <ResponsiveDataTable
                        rows={templates.data}
                        columns={columns}
                        getRowKey={(template) => template.uuid}
                        emptyMessage={`Aucun template ${isWhatsApp ? 'WhatsApp' : 'e-mail'}.`}
                        minWidth="640px"
                        sort={filters}
                        onSort={handleSort}
                    />
                </BackofficeIndexPanel>

                <IndexTablePagination
                    paginated={templates}
                    itemLabel="template(s)"
                    buildPageUrl={buildPageUrl}
                />
            </div>
        </>
    );
}

MarketingTemplatesIndex.layout = {
    breadcrumbs: [{ title: 'Templates', href: index.url({ query: { channel: 'email' } }) }],
};
