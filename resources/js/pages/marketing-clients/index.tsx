import { Head, Link, router, usePage } from '@inertiajs/react';
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
    const { contacts, filters, canCreate, canImport } =
        usePage<PageProps>().props;

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
                    <Link href={show.url(contact.uuid)}>Voir</Link>
                </Button>
                {contact.can_update ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={edit.url(contact.uuid)}>
                            <Pencil className="size-4" aria-hidden />
                            Modifier
                        </Link>
                    </Button>
                ) : null}
                {contact.can_delete ? (
                    <ConfirmDeleteDialog
                        title="Supprimer ce contact ?"
                        description={`Le contact « ${contact.full_name} » sera définitivement supprimé.`}
                        deleteUrl={destroy.url(contact.uuid)}
                        triggerSize="sm"
                        triggerVariant="outline"
                        triggerClassName="text-destructive hover:text-destructive"
                        aria-label={`Supprimer ${contact.full_name}`}
                    />
                ) : null}
            </>
        );

        return [
            {
                id: 'name',
                header: 'Nom',
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
                header: 'E-mail',
                sortKey: 'email',
                sortable: true,
                mobileRole: 'meta',
                cell: (contact) => contact.email ?? '—',
            },
            {
                id: 'phone',
                header: 'Téléphone',
                sortKey: 'phone',
                sortable: true,
                mobileRole: 'meta',
                className: 'text-muted-foreground',
                cell: (contact) => contact.phone ?? '—',
            },
            {
                id: 'company',
                header: 'Entreprise',
                sortKey: 'company_name',
                sortable: true,
                mobileRole: 'subtitle',
                className: 'text-muted-foreground',
                cell: (contact) => contact.company_name ?? '—',
            },
            {
                id: 'tags',
                header: 'Tags',
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
                header: 'Consentement',
                sortKey: 'marketing_consent',
                sortable: true,
                mobileRole: 'meta',
                cell: (contact) => (
                    <Badge
                        variant={
                            contact.marketing_consent ? 'default' : 'outline'
                        }
                    >
                        {contact.marketing_consent ? 'Oui' : 'Non'}
                    </Badge>
                ),
            },
            {
                id: 'lists',
                header: 'Groupes',
                sortKey: 'lists_count',
                sortable: true,
                mobileRole: 'meta',
                cell: (contact) => contact.lists_count,
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
    }, []);

    return (
        <>
            <Head title="Contacts marketing" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
                            <Contact className="size-6" aria-hidden />
                            Contacts marketing
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Gérez votre base de contacts pour les futures campagnes.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {canImport ? (
                            <Button variant="outline" asChild>
                                <Link href={importPage.url()}>
                                    <Upload className="size-4" aria-hidden />
                                    Importer CSV
                                </Link>
                            </Button>
                        ) : null}
                        {canCreate ? (
                            <Button asChild>
                                <Link href={create.url()}>
                                    <Plus className="size-4" aria-hidden />
                                    Nouveau contact
                                </Link>
                            </Button>
                        ) : null}
                    </div>
                </div>

                <BackofficeFiltersBar>
                    <div className="relative min-w-0 flex-1 lg:min-w-[240px]">
                        <Label htmlFor="contacts-search" className="sr-only">
                            Recherche
                        </Label>
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            id="contacts-search"
                            type="search"
                            placeholder="Rechercher par nom, e-mail ou téléphone…"
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
                        emptyMessage="Aucun contact pour le moment."
                        minWidth="860px"
                        sort={filters}
                        onSort={handleSort}
                    />
                </BackofficeIndexPanel>

                <IndexTablePagination
                    paginated={contacts}
                    itemLabel="contact(s)"
                    buildPageUrl={buildPageUrl}
                />
            </div>
        </>
    );
}

MarketingClientsIndex.layout = {
    breadcrumbs: [{ title: 'Contacts marketing', href: index.url() }],
};
