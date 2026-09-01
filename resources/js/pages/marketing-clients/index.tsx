import { Head, Link, router, usePage } from '@inertiajs/react';
import { Contact, Plus, Search, Upload, Pencil } from 'lucide-react';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
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
    filters: { search?: string };
    canCreate: boolean;
    canImport: boolean;
};

export default function MarketingClientsIndex() {
    const { contacts, filters, canCreate, canImport } =
        usePage<PageProps>().props;

    const applyFilters = (updates: Record<string, string | undefined>) => {
        const next = { ...filters, ...updates };
        Object.keys(next).forEach((key) => {
            if (next[key as keyof typeof next] === undefined) {
                delete next[key as keyof typeof next];
            }
        });
        router.get(index.url(), next, { preserveState: true, replace: true });
    };

    const debouncedSearch = useDebouncedCallback((search: string) => {
        applyFilters({ search: search || undefined });
    });

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

                <div className="relative max-w-md">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                        type="search"
                        placeholder="Rechercher par nom, e-mail ou téléphone..."
                        defaultValue={filters.search ?? ''}
                        onChange={(event) =>
                            debouncedSearch(event.target.value)
                        }
                        className="pl-9"
                    />
                </div>

                <div className="app-panel overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="bg-muted/50 border-b text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Nom</th>
                                    <th className="px-4 py-3 font-medium">E-mail</th>
                                    <th className="px-4 py-3 font-medium">Téléphone</th>
                                    <th className="px-4 py-3 font-medium">Tags</th>
                                    <th className="px-4 py-3 font-medium">Consentement</th>
                                    <th className="px-4 py-3 font-medium">Listes</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="text-muted-foreground px-4 py-8 text-center"
                                        >
                                            Aucun contact pour le moment.
                                        </td>
                                    </tr>
                                ) : (
                                    contacts.data.map((contact) => (
                                        <tr
                                            key={contact.uuid}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                <Link
                                                    href={show.url(contact.uuid)}
                                                    className="hover:text-primary hover:underline"
                                                >
                                                    {contact.full_name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3">
                                                {contact.email ?? '—'}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {contact.phone ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {contact.tags.length > 0 ? (
                                                        contact.tags.map((tag) => (
                                                            <Badge
                                                                key={tag}
                                                                variant="outline"
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            —
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        contact.marketing_consent
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                >
                                                    {contact.marketing_consent
                                                        ? 'Oui'
                                                        : 'Non'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                {contact.lists_count}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link href={show.url(contact.uuid)}>
                                                            Voir
                                                        </Link>
                                                    </Button>
                                                    {contact.can_update ? (
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={edit.url(
                                                                    contact.uuid,
                                                                )}
                                                                aria-label={`Modifier ${contact.full_name}`}
                                                            >
                                                                <Pencil
                                                                    className="size-4"
                                                                    aria-hidden
                                                                />
                                                            </Link>
                                                        </Button>
                                                    ) : null}
                                                    {contact.can_delete ? (
                                                        <ConfirmDeleteDialog
                                                            title="Supprimer ce contact ?"
                                                            description={`Le contact « ${contact.full_name} » sera définitivement supprimé.`}
                                                            deleteUrl={destroy.url(contact.uuid)}
                                                            triggerSize="icon"
                                                            triggerVariant="outline"
                                                            triggerClassName="text-destructive hover:text-destructive"
                                                            aria-label={`Supprimer ${contact.full_name}`}
                                                        />
                                                    ) : null}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {contacts.last_page > 1 && (
                    <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-4 text-sm">
                        <span>
                            Page {contacts.current_page} sur {contacts.last_page} (
                            {contacts.total} contacts)
                        </span>
                        <div className="flex gap-2">
                            {contacts.current_page > 1 && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link
                                        href={index.url({
                                            query: {
                                                page: contacts.current_page - 1,
                                                ...(filters.search
                                                    ? { search: filters.search }
                                                    : {}),
                                            },
                                        })}
                                    >
                                        Précédent
                                    </Link>
                                </Button>
                            )}
                            {contacts.current_page < contacts.last_page && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link
                                        href={index.url({
                                            query: {
                                                page: contacts.current_page + 1,
                                                ...(filters.search
                                                    ? { search: filters.search }
                                                    : {}),
                                            },
                                        })}
                                    >
                                        Suivant
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

MarketingClientsIndex.layout = {
    breadcrumbs: [{ title: 'Contacts marketing', href: index.url() }],
};
