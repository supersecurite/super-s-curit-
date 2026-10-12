import { Head, Link, router, setLayoutProps, usePage } from '@inertiajs/react';
import { Contact, Plus, Search, Upload, Pencil } from 'lucide-react';
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
import { useTrans } from '@/hooks/use-trans';
import { withIndexTableQuery } from '@/lib/index-table-query';
import {
    create,
    destroy,
    edit,
    importMethod as importPage,
    index,
    show,
} from '@/routes/marketing-clients';

type ContactRow = {
    uuid: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    company_name: string | null;
    tags: string[];
    marketing_consent: boolean;
    lists_count: number;
    can_update: boolean;
    can_delete: boolean;
};

type PaginatedContacts = {
    data: ContactRow[];
    current_page: number;
    last_page: number;
    total: number;
};

type PageProps = {
    contacts: PaginatedContacts;
    filters: TableSortState & { search?: string };
    canCreate: boolean;
    canImport: boolean;
};

export default function MarketingClientsIndex() {
    const { t } = useTrans();
    const { contacts, filters, canCreate, canImport } =
        usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            {
                title: t('marketing_contacts.title', 'Contacts marketing'),
                href: index.url(),
            },
        ],
    });

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

    const columns = useMemo((): ResponsiveColumn<ContactRow>[] => {
        const renderActions = (contact: ContactRow) => (
            <>
                <Button variant="outline" size="sm" asChild>
                    <Link href={show.url(contact.uuid)}>
                        {t('common.view', 'Voir')}
                    </Link>
                </Button>
                {contact.can_update ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={edit.url(contact.uuid)}>
                            <Pencil className="size-4" aria-hidden />
                            {t('common.modify', 'Modifier')}
                        </Link>
                    </Button>
                ) : null}
                {contact.can_delete ? (
                    <ConfirmDeleteDialog
                        title={t(
                            'marketing_contacts.delete_confirm',
                            'Supprimer ce contact ?',
                        )}
                        description={t(
                            'marketing_contacts.delete_description',
                            'Le contact « :name » sera définitivement supprimé.',
                            { name: contact.full_name },
                        )}
                        deleteUrl={destroy.url(contact.uuid)}
                        triggerSize="sm"
                        triggerVariant="outline"
                        triggerClassName="text-destructive hover:text-destructive"
                        aria-label={t(
                            'marketing_contacts.delete_aria',
                            'Supprimer :name',
                            { name: contact.full_name },
                        )}
                    />
                ) : null}
            </>
        );

        return [
            {
                id: 'name',
                header: t('common.name', 'Nom'),
                sortKey: 'full_name',
                sortable: true,
                mobileRole: 'title',
                cell: (contact) => (
                    <Link
                        href={show.url(contact.uuid)}
                        className="hover:text-primary hover:underline"
                    >
                        {contact.full_name}
                    </Link>
                ),
            },
            {
                id: 'email',
                header: t('common.email_label', 'E-mail'),
                sortKey: 'email',
                sortable: true,
                mobileRole: 'meta',
                cell: (contact) => contact.email ?? '—',
            },
            {
                id: 'phone',
                header: t('common.phone', 'Téléphone'),
                sortKey: 'phone',
                sortable: true,
                mobileRole: 'meta',
                className: 'text-muted-foreground',
                cell: (contact) => contact.phone ?? '—',
            },
            {
                id: 'company',
                header: t('marketing_contacts.company', 'Entreprise'),
                sortKey: 'company_name',
                sortable: true,
                mobileRole: 'subtitle',
                className: 'text-muted-foreground',
                cell: (contact) => contact.company_name ?? '—',
            },
            {
                id: 'tags',
                header: t('marketing_contacts.tags', 'Tags'),
                mobileRole: 'meta',
                cell: (contact) =>
                    contact.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {contact.tags.map((tag) => (
                                <Badge key={tag} variant="outline">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        '—'
                    ),
            },
            {
                id: 'consent',
                header: t('marketing_contacts.consent', 'Consentement'),
                sortKey: 'marketing_consent',
                sortable: true,
                mobileRole: 'meta',
                cell: (contact) => (
                    <Badge
                        variant={
                            contact.marketing_consent ? 'default' : 'outline'
                        }
                    >
                        {contact.marketing_consent
                            ? t('common.yes', 'Oui')
                            : t('common.no', 'Non')}
                    </Badge>
                ),
            },
            {
                id: 'lists',
                header: t('marketing_contacts.lists_header', 'Groupes'),
                sortKey: 'lists_count',
                sortable: true,
                mobileRole: 'meta',
                cell: (contact) => contact.lists_count,
            },
            {
                id: 'actions',
                header: t('common.actions', 'Actions'),
                mobileRole: 'actions',
                headerClassName: 'text-right',
                className: 'text-right',
                cell: renderActions,
            },
        ];
    }, [t]);

    return (
        <>
            <Head
                title={t('marketing_contacts.title', 'Contacts marketing')}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
                            <Contact className="size-6" aria-hidden />
                            {t('marketing_contacts.title', 'Contacts marketing')}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {t(
                                'marketing_contacts.subtitle',
                                'Gérez votre base de contacts pour les futures campagnes.',
                            )}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {canImport ? (
                            <Button variant="outline" asChild>
                                <Link href={importPage.url()}>
                                    <Upload className="size-4" aria-hidden />
                                    {t(
                                        'marketing_contacts.import_csv',
                                        'Importer CSV',
                                    )}
                                </Link>
                            </Button>
                        ) : null}
                        {canCreate ? (
                            <Button asChild>
                                <Link href={create.url()}>
                                    <Plus className="size-4" aria-hidden />
                                    {t(
                                        'marketing_contacts.create',
                                        'Nouveau contact',
                                    )}
                                </Link>
                            </Button>
                        ) : null}
                    </div>
                </div>

                <BackofficeFiltersBar>
                    <div className="relative min-w-0 flex-1 lg:min-w-[240px]">
                        <Label htmlFor="contacts-search" className="sr-only">
                            {t('common.search', 'Rechercher')}
                        </Label>
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            id="contacts-search"
                            type="search"
                            placeholder={t(
                                'marketing_contacts.search_placeholder',
                                'Rechercher par nom, e-mail ou téléphone…',
                            )}
                            defaultValue={filters.search ?? ''}
                            onChange={(event) =>
                                debouncedSearch(event.target.value)
                            }
                            className="pl-9"
                        />
                    </div>
                </BackofficeFiltersBar>

                <BackofficeIndexPanel>
                    <ResponsiveDataTable
                        rows={contacts.data}
                        columns={columns}
                        getRowKey={(contact) => contact.uuid}
                        emptyMessage={t(
                            'marketing_contacts.empty',
                            'Aucun contact pour le moment.',
                        )}
                        minWidth="860px"
                        sort={filters}
                        onSort={handleSort}
                    />
                </BackofficeIndexPanel>

                <IndexTablePagination
                    paginated={contacts}
                    itemLabel={t(
                        'marketing_contacts.item_label',
                        'contact(s)',
                    )}
                    buildPageUrl={buildPageUrl}
                />
            </div>
        </>
    );
}
