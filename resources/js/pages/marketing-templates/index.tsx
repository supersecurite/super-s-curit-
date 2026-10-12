import { Head, Link, router, setLayoutProps, usePage } from '@inertiajs/react';
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
import ImportMetaTemplatesDialog from '@/components/marketing-templates/import-meta-templates-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { useTrans } from '@/hooks/use-trans';
import { useIndexTableSort, type TableSortState } from '@/hooks/use-index-table-sort';
import { withIndexTableQuery } from '@/lib/index-table-query';
import {
    create,
    destroy,
    edit,
    index,
    show,
} from '@/routes/marketing-templates';

type WhatsAppAccountOption = {
    id: number;
    uuid: string;
    name: string;
    is_default: boolean;
};

type TemplateRow = {
    uuid: string;
    name: string;
    channel: string;
    channel_label: string;
    subject: string | null;
    meta_template_name?: string | null;
    meta_template_language?: string | null;
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
    whatsappAccounts?: WhatsAppAccountOption[];
};

export default function MarketingTemplatesIndex() {
    const { t } = useTrans();
    const { templates, channel, filters, canCreate, whatsappAccounts = [] } = usePage<PageProps>().props;
    const activeChannel = channel === 'whatsapp' ? 'whatsapp' : 'email';
    const isWhatsApp = activeChannel === 'whatsapp';
    const title = isWhatsApp
        ? t('marketing_templates.title_whatsapp', 'Templates WhatsApp')
        : t('marketing_templates.title_email', 'Templates e-mail');

    setLayoutProps({
        breadcrumbs: [
            {
                title,
                href: index.url({ query: { channel: activeChannel } }),
            },
        ],
    });

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
                    <Link href={show.url(template.uuid)}>
                        {t('common.view', 'Voir')}
                    </Link>
                </Button>
                {template.can_update ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={edit.url(template.uuid)}>
                            <Pencil className="size-4" aria-hidden />
                            {t('common.modify', 'Modifier')}
                        </Link>
                    </Button>
                ) : null}
                {template.can_delete ? (
                    <ConfirmDeleteDialog
                        title={t(
                            'marketing_templates.delete_confirm',
                            'Supprimer ce template ?',
                        )}
                        description={t(
                            'marketing_templates.delete_description_full',
                            'Le template « :name » sera définitivement supprimé.',
                            { name: template.name },
                        )}
                        deleteUrl={destroy.url(template.uuid)}
                        triggerLabel={t('common.delete', 'Supprimer')}
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
                cell: (template) =>
                    isWhatsApp ? (
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                            <span className="font-medium text-foreground">
                                {template.meta_template_name ?? '—'}
                            </span>
                            {template.meta_template_language ? (
                                <Badge variant="outline" className="text-[10px]">
                                    {template.meta_template_language.toUpperCase()}
                                </Badge>
                            ) : null}
                        </div>
                    ) : (
                        template.subject ?? '—'
                    ),
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
    }, [isWhatsApp, t]);

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
                                ? t(
                                      'marketing_templates.subtitle_whatsapp',
                                      'Templates WhatsApp uniquement — importez vos modèles approuvés Meta ou créez-en de nouveaux.',
                                  )
                                : t(
                                      'marketing_templates.subtitle_email',
                                      'Templates e-mail uniquement — variables dynamiques pour les campagnes.',
                                  )}
                        </p>
                    </div>
                    {canCreate ? (
                        <div className="flex flex-wrap items-center gap-2">
                            {isWhatsApp && whatsappAccounts.length > 0 ? (
                                <ImportMetaTemplatesDialog accounts={whatsappAccounts} />
                            ) : null}
                            <Button asChild>
                                <Link href={create.url({ query: { channel: activeChannel } })}>
                                    <Plus className="size-4" aria-hidden />
                                    {isWhatsApp
                                        ? t(
                                              'marketing_templates.create_whatsapp',
                                              'Nouveau template WhatsApp',
                                          )
                                        : t(
                                              'marketing_templates.create_email',
                                              'Nouveau template e-mail',
                                          )}
                                </Link>
                            </Button>
                        </div>
                    ) : null}
                </div>

                <BackofficeFiltersBar>
                    <div className="relative min-w-0 flex-1 lg:min-w-[240px]">
                        <Label htmlFor="templates-search" className="sr-only">
                            {t(
                                'marketing_templates.search_label',
                                'Rechercher',
                            )}
                        </Label>
                        <Search
                            className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
                            aria-hidden
                        />
                        <Input
                            id="templates-search"
                            type="search"
                            defaultValue={filters.search ?? ''}
                            placeholder={t(
                                'marketing_templates.search_placeholder_extended',
                                'Titre, objet, contenu…',
                            )}
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
                        emptyMessage={
                            isWhatsApp
                                ? t(
                                      'marketing_templates.empty_whatsapp',
                                      'Aucun template WhatsApp.',
                                  )
                                : t(
                                      'marketing_templates.empty_email',
                                      'Aucun template e-mail.',
                                  )
                        }
                        minWidth="640px"
                        sort={filters}
                        onSort={handleSort}
                    />
                </BackofficeIndexPanel>

                <IndexTablePagination
                    paginated={templates}
                    itemLabel={t(
                        'marketing_templates.item_label',
                        'template(s)',
                    )}
                    buildPageUrl={buildPageUrl}
                />
            </div>
        </>
    );
}
