import { Head, Link, setLayoutProps, usePage } from '@inertiajs/react';
import { ArrowLeft, List, Pencil } from 'lucide-react';
import AddContactDialog from '@/components/marketing-lists/add-contact-dialog';
import RemoveContactDialog from '@/components/marketing-lists/remove-contact-dialog';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { destroy, edit, index, show } from '@/routes/marketing-lists';

type ContactRow = {
    uuid: string;
    full_name: string;
    email: string | null;
    phone: string | null;
};

type ListData = {
    uuid: string;
    name: string;
    description: string | null;
    contacts_count: number;
};

type PaginatedContacts = {
    data: ContactRow[];
    current_page: number;
    last_page: number;
    total: number;
};

type PageProps = {
    list: ListData;
    contacts: PaginatedContacts;
    availableContacts: ContactRow[];
    canUpdate: boolean;
    canDelete: boolean;
};

export default function MarketingListsShow() {
    const {
        list,
        contacts,
        availableContacts,
        canUpdate,
        canDelete,
    } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            { title: 'Groupes', href: index.url() },
            { title: list.name, href: show.url(list.uuid) },
        ],
    });

    return (
        <>
            <Head title={list.name} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <Link
                            href={index.url()}
                            className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-sm"
                        >
                            <ArrowLeft className="size-4" aria-hidden />
                            Retour à la liste
                        </Link>
                        <h1 className="font-heading flex items-center gap-2 text-2xl font-semibold tracking-tight">
                            <List className="size-6" aria-hidden />
                            {list.name}
                        </h1>
                        {list.description ? (
                            <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
                                {list.description}
                            </p>
                        ) : null}
                        <Badge variant="secondary" className="mt-3">
                            {list.contacts_count} contact(s)
                        </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {canUpdate ? (
                            <>
                                <AddContactDialog
                                    listUuid={list.uuid}
                                    availableContacts={availableContacts}
                                />
                                <Button variant="outline" asChild>
                                    <Link href={edit.url(list.uuid)}>
                                        <Pencil className="size-4" aria-hidden />
                                        Modifier les infos
                                    </Link>
                                </Button>
                            </>
                        ) : null}
                        {canDelete ? (
                            <ConfirmDeleteDialog
                                title="Supprimer ce groupe ?"
                                description={`Le groupe « ${list.name} » sera supprimé. Les contacts ne seront pas effacés.`}
                                deleteUrl={destroy.url(list.uuid)}
                                triggerLabel="Supprimer"
                                triggerVariant="outline"
                                triggerClassName="text-destructive hover:text-destructive"
                            />
                        ) : null}
                    </div>
                </div>

                <div className="app-panel overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[520px] text-left text-sm">
                            <thead className="bg-muted/50 border-b text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Nom</th>
                                    <th className="px-4 py-3 font-medium">E-mail</th>
                                    <th className="px-4 py-3 font-medium">Téléphone</th>
                                    {canUpdate ? (
                                        <th className="px-4 py-3 text-right font-medium">
                                            Action
                                        </th>
                                    ) : null}
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={canUpdate ? 4 : 3}
                                            className="text-muted-foreground px-4 py-8 text-center"
                                        >
                                            Aucun contact dans ce groupe.
                                            {canUpdate ? (
                                                <span className="mt-1 block">
                                                    Utilisez « Ajouter des contacts » pour commencer.
                                                </span>
                                            ) : null}
                                        </td>
                                    </tr>
                                ) : (
                                    contacts.data.map((contact) => (
                                        <tr
                                            key={contact.uuid}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {contact.full_name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {contact.email ?? '—'}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {contact.phone ?? '—'}
                                            </td>
                                            {canUpdate ? (
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end">
                                                        <RemoveContactDialog
                                                            listUuid={list.uuid}
                                                            contactUuid={contact.uuid}
                                                            contactName={contact.full_name}
                                                        />
                                                    </div>
                                                </td>
                                            ) : null}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {contacts.last_page > 1 && (
                    <div className="flex gap-2">
                        {contacts.current_page > 1 && (
                            <Button variant="outline" size="sm" asChild>
                                <Link
                                    href={show.url(list.uuid, {
                                        query: {
                                            contacts_page: contacts.current_page - 1,
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
                                    href={show.url(list.uuid, {
                                        query: {
                                            contacts_page: contacts.current_page + 1,
                                        },
                                    })}
                                >
                                    Suivant
                                </Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

MarketingListsShow.layout = {
    breadcrumbs: [
        { title: 'Groupes', href: index.url() },
        { title: 'Détail', href: show.url('') },
    ],
};
