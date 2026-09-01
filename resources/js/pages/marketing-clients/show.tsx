import { Head, Link, router, setLayoutProps, usePage } from '@inertiajs/react';
import { ArrowLeft, Building2, Contact, Mail, MapPin, MessageSquare, Phone, Pencil, Tag, Users } from 'lucide-react';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { CompanyChannelsDisplay } from '@/components/marketing-clients/company-channels-display';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { destroy, edit, index, show } from '@/routes/marketing-clients';
import { show as showConversation, startFromContact } from '@/routes/marketing-conversations';
import { show as showList } from '@/routes/marketing-lists';
import type { MarketingCompanyChannel } from '@/types/marketing-company-contact';

type CampaignChannelEntry = {
    value: string;
    label: string | null;
    person_name: string | null;
    scope: string;
};

type CampaignChannels = {
    emails: CampaignChannelEntry[];
    phones: CampaignChannelEntry[];
    whatsapp: CampaignChannelEntry[];
    cc_emails: string[];
};

type ContactData = {
    uuid: string;
    full_name: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    is_company: boolean;
    company_name: string | null;
    company_role: string | null;
    company_contacts: MarketingCompanyChannel[];
    campaign_channels: CampaignChannels;
    address: string | null;
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
    conversationUuid: string | null;
    canUpdate: boolean;
    canDelete: boolean;
    canReply: boolean;
};

export default function MarketingClientsShow() {
    const { contact, lists, conversationUuid, canUpdate, canDelete, canReply } =
        usePage<PageProps>().props;

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
                            <Badge variant={contact.is_company ? 'default' : 'secondary'}>
                                {contact.is_company ? 'Entreprise' : 'Particulier'}
                            </Badge>
                            <Badge variant={contact.marketing_consent ? 'default' : 'outline'}>
                                {contact.marketing_consent
                                    ? 'Consentement accordé'
                                    : 'Sans consentement'}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {conversationUuid ? (
                            <Button variant="outline" asChild>
                                <Link href={showConversation.url(conversationUuid)}>
                                    <MessageSquare className="size-4" aria-hidden />
                                    Conversation
                                </Link>
                            </Button>
                        ) : canReply && contact.email ? (
                            <Button
                                variant="outline"
                                onClick={() =>
                                    router.post(startFromContact.url(contact.uuid))
                                }
                            >
                                <MessageSquare className="size-4" aria-hidden />
                                Démarrer une conversation
                            </Button>
                        ) : null}
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
                            {!contact.is_company ? (
                                <div className="flex items-start gap-3">
                                    <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                    <div>
                                        <dt className="text-muted-foreground">Adresse</dt>
                                        <dd className="whitespace-pre-wrap">
                                            {contact.address ?? '—'}
                                        </dd>
                                    </div>
                                </div>
                            ) : null}
                        </dl>
                    </section>

                    {contact.is_company ? (
                        <section className="app-panel space-y-4 p-4">
                            <h2 className="font-semibold">Entreprise</h2>
                            <dl className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <Building2 className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                    <div>
                                        <dt className="text-muted-foreground">Nom</dt>
                                        <dd>{contact.company_name ?? '—'}</dd>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Users className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <dt className="text-muted-foreground mb-2">
                                            Canaux entreprise
                                        </dt>
                                        <dd>
                                            <CompanyChannelsDisplay
                                                companyRole={contact.company_role}
                                                channels={contact.company_contacts}
                                                campaignChannels={contact.campaign_channels}
                                            />
                                        </dd>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                    <div>
                                        <dt className="text-muted-foreground">Adresse</dt>
                                        <dd className="whitespace-pre-wrap">
                                            {contact.address ?? '—'}
                                        </dd>
                                    </div>
                                </div>
                            </dl>
                        </section>
                    ) : null}

                    <section className="app-panel space-y-4 p-4 lg:col-span-2">
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
