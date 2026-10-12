import { Head, Link, setLayoutProps, usePage } from '@inertiajs/react';
import { ArrowLeft, Building2, Contact, Mail, MapPin, Phone, Pencil, Tag, Users } from 'lucide-react';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { CompanyChannelsDisplay } from '@/components/marketing-clients/company-channels-display';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTrans } from '@/hooks/use-trans';
import { destroy, edit, index, show } from '@/routes/marketing-clients';
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
    name: string | null;
    email: string | null;
    phone: string | null;
    is_company: boolean;
    company_name: string | null;
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
    canUpdate: boolean;
    canDelete: boolean;
};

export default function MarketingClientsShow() {
    const { t } = useTrans();
    const { contact, lists, canUpdate, canDelete } =
        usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            {
                title: t('marketing_contacts.title', 'Contacts marketing'),
                href: index.url(),
            },
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
                            {t(
                                'marketing_contacts.back_to_list',
                                'Retour à la liste',
                            )}
                        </Link>
                        <h1 className="font-heading flex items-center gap-2 text-2xl font-semibold tracking-tight">
                            <Contact className="size-6" aria-hidden />
                            {contact.full_name}
                        </h1>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant={contact.is_company ? 'default' : 'secondary'}>
                                {contact.is_company
                                    ? t(
                                          'marketing_contacts.company',
                                          'Entreprise',
                                      )
                                    : t(
                                          'marketing_contacts.individual',
                                          'Particulier',
                                      )}
                            </Badge>
                            <Badge variant={contact.marketing_consent ? 'default' : 'outline'}>
                                {contact.marketing_consent
                                    ? t(
                                          'marketing_contacts.consent_granted',
                                          'Consentement accordé',
                                      )
                                    : t(
                                          'marketing_contacts.consent_denied',
                                          'Sans consentement',
                                      )}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {canUpdate ? (
                            <Button asChild>
                                <Link href={edit.url(contact.uuid)}>
                                    <Pencil className="size-4" aria-hidden />
                                    {t('common.modify', 'Modifier')}
                                </Link>
                            </Button>
                        ) : null}
                        {canDelete ? (
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
                                triggerLabel={t('common.delete', 'Supprimer')}
                                triggerVariant="outline"
                                triggerClassName="text-destructive hover:text-destructive"
                            />
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <section className="app-panel space-y-4 p-4">
                        <h2 className="font-semibold">
                            {t(
                                'marketing_contacts.coordinates_heading',
                                'Coordonnées',
                            )}
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <Mail className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                <div>
                                    <dt className="text-muted-foreground">
                                        {t('common.email_label', 'E-mail')}
                                    </dt>
                                    <dd>{contact.email ?? '—'}</dd>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                <div>
                                    <dt className="text-muted-foreground">
                                        {t('common.phone', 'Téléphone')}
                                    </dt>
                                    <dd>{contact.phone ?? '—'}</dd>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Tag className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                <div>
                                    <dt className="text-muted-foreground">
                                        {t('marketing_contacts.tags', 'Tags')}
                                    </dt>
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
                                        <dt className="text-muted-foreground">
                                            {t(
                                                'marketing_contacts.address',
                                                'Adresse',
                                            )}
                                        </dt>
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
                            <h2 className="font-semibold">
                                {t(
                                    'marketing_contacts.company_heading',
                                    'Entreprise',
                                )}
                            </h2>
                            <dl className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <Building2 className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                    <div>
                                        <dt className="text-muted-foreground">
                                            {t('common.name', 'Nom')}
                                        </dt>
                                        <dd>{contact.company_name ?? '—'}</dd>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Users className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <dt className="text-muted-foreground mb-2">
                                            {t(
                                                'marketing_contacts.company_channels',
                                                'Canaux entreprise',
                                            )}
                                        </dt>
                                        <dd>
                                            <CompanyChannelsDisplay
                                                channels={contact.company_contacts}
                                                campaignChannels={contact.campaign_channels}
                                            />
                                        </dd>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                    <div>
                                        <dt className="text-muted-foreground">
                                            {t(
                                                'marketing_contacts.address',
                                                'Adresse',
                                            )}
                                        </dt>
                                        <dd className="whitespace-pre-wrap">
                                            {contact.address ?? '—'}
                                        </dd>
                                    </div>
                                </div>
                            </dl>
                        </section>
                    ) : null}

                    <section className="app-panel space-y-4 p-4 lg:col-span-2">
                        <h2 className="font-semibold">
                            {t(
                                'marketing_contacts.lists_header',
                                'Groupes',
                            )}
                        </h2>
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
                                                {t(
                                                    'marketing_contacts.lists_contacts_count',
                                                    ':count contact(s)',
                                                    {
                                                        count: list.contacts_count,
                                                    },
                                                )}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                {t(
                                    'marketing_contacts.no_lists',
                                    "Ce contact n'appartient à aucun groupe.",
                                )}
                            </p>
                        )}
                    </section>
                </div>

                {contact.notes ? (
                    <section className="app-panel p-4">
                        <h2 className="mb-2 font-semibold">
                            {t(
                                'marketing_contacts.notes_heading',
                                'Notes',
                            )}
                        </h2>
                        <p className="text-muted-foreground whitespace-pre-wrap text-sm">
                            {contact.notes}
                        </p>
                    </section>
                ) : null}

                <p className="text-muted-foreground text-xs">
                    {t('marketing_contacts.created_at', 'Créé le :date', {
                        date: contact.created_at_formatted ?? '—',
                    })}
                    {contact.updated_at_formatted
                        ? ` · ${t(
                              'marketing_contacts.updated_at',
                              'Modifié le :date',
                              { date: contact.updated_at_formatted },
                          )}`
                        : ''}
                </p>
            </div>
        </>
    );
}
