import { Head, Link, setLayoutProps, usePage } from '@inertiajs/react';
import { ArrowLeft, Contact, Mail, Phone, Pencil, Tag } from 'lucide-react';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { destroy, edit, index, show } from '@/routes/marketing-clients';
import { show as showList } from '@/routes/marketing-lists';

type ContactData = {
    uuid: string;
    full_name: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    tags: string[];
    marketing_consent: boolean;
    notes: string | null;
    created_at_formatted: string | null;
    updated_at_formatted: string | null;
};

type ListSummary = {
    uuid: string;
    name: string;
    contacts_count: number;
};

type PageProps = {
    contact: ContactData;
    lists: ListSummary[];
    canUpdate: boolean;
    canDelete: boolean;
};

export default function MarketingClientsShow() {
    const { contact, lists, canUpdate, canDelete } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            { title: 'Contacts marketing', href: index.url() },
            { title: contact.full_name, href: show.url(contact.uuid) },
        ],
    });

    return (
        <>
            <Head title={contact.full_name} />

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
                            <Contact className="size-6" aria-hidden />
                            {contact.full_name}
                        </h1>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant={contact.marketing_consent ? 'default' : 'outline'}>
                                {contact.marketing_consent
                                    ? 'Consentement accordé'
                                    : 'Sans consentement'}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {canUpdate ? (
                            <Button asChild>
                                <Link href={edit.url(contact.uuid)}>
                                    <Pencil className="size-4" aria-hidden />
                                    Modifier
                                </Link>
                            </Button>
                        ) : null}
                        {canDelete ? (
                            <ConfirmDeleteDialog
                                title="Supprimer ce contact ?"
                                description={`Le contact « ${contact.full_name} » sera définitivement supprimé.`}
                                deleteUrl={destroy.url(contact.uuid)}
                                triggerLabel="Supprimer"
                                triggerVariant="outline"
                                triggerClassName="text-destructive hover:text-destructive"
                            />
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <section className="app-panel space-y-4 p-4">
                        <h2 className="font-semibold">Coordonnées</h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <Mail className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                <div>
                                    <dt className="text-muted-foreground">E-mail</dt>
                                    <dd>{contact.email ?? '—'}</dd>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                <div>
                                    <dt className="text-muted-foreground">Téléphone</dt>
                                    <dd>{contact.phone ?? '—'}</dd>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Tag className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                <div>
                                    <dt className="text-muted-foreground">Tags</dt>
                                    <dd className="mt-1 flex flex-wrap gap-1">
                                        {contact.tags.length > 0 ? (
                                            contact.tags.map((tag) => (
                                                <Badge key={tag} variant="outline">
                                                    {tag}
                                                </Badge>
                                            ))
                                        ) : (
                                            '—'
                                        )}
                                    </dd>
                                </div>
                            </div>
                        </dl>
                    </section>

                    <section className="app-panel space-y-4 p-4">
                        <h2 className="font-semibold">Listes de diffusion</h2>
                        {lists.length > 0 ? (
                            <ul className="space-y-2">
                                {lists.map((list) => (
                                    <li key={list.uuid}>
                                        <Link
                                            href={showList.url(list.uuid)}
                                            className="hover:bg-muted/50 flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors"
                                        >
                                            <span className="font-medium">{list.name}</span>
                                            <span className="text-muted-foreground">
                                                {list.contacts_count} contact(s)
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                Ce contact n&apos;appartient à aucune liste.
                            </p>
                        )}
                    </section>
                </div>

                {contact.notes ? (
                    <section className="app-panel p-4">
                        <h2 className="mb-2 font-semibold">Notes</h2>
                        <p className="text-muted-foreground whitespace-pre-wrap text-sm">
                            {contact.notes}
                        </p>
                    </section>
                ) : null}

                <p className="text-muted-foreground text-xs">
                    Créé le {contact.created_at_formatted ?? '—'}
                    {contact.updated_at_formatted
                        ? ` · Modifié le ${contact.updated_at_formatted}`
                        : ''}
                </p>
            </div>
        </>
    );
}

MarketingClientsShow.layout = {
    breadcrumbs: [
        { title: 'Contacts marketing', href: index.url() },
        { title: 'Détail', href: show.url('') },
    ],
};
