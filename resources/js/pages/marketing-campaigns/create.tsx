import { Head, usePage } from '@inertiajs/react';
import MarketingCampaignForm from '@/components/marketing-campaigns/marketing-campaign-form';
import { create, index, store } from '@/routes/marketing-campaigns';

type ListOption = {
    id: number;
    uuid: string;
    name: string;
    contacts_count: number;
};

type ContactOption = {
    uuid: string;
    full_name: string;
    email: string | null;
    phone: string | null;
};

type TemplateOption = {
    id: number;
    uuid: string;
    name: string;
    channel: string;
    subject: string | null;
    body: string;
    meta_template_name?: string | null;
    meta_template_language?: string | null;
};

type WhatsAppAccountOption = {
    id: number;
    uuid: string;
    name: string;
};

type PageProps = {
    errors: Record<string, string>;
    lockedChannel: 'email' | 'whatsapp';
    lists: ListOption[];
    contacts: ContactOption[];
    templates: TemplateOption[];
    whatsappAccounts: WhatsAppAccountOption[];
    defaultWhatsappAccountId: number | null;
    variables: string[];
};

export default function MarketingCampaignsCreate() {
    const {
        errors,
        lockedChannel,
        lists,
        contacts,
        templates,
        whatsappAccounts,
        defaultWhatsappAccountId,
        variables,
    } = usePage<PageProps>().props;

    const isWhatsApp = lockedChannel === 'whatsapp';
    const title = isWhatsApp ? 'Nouvelle campagne WhatsApp' : 'Nouvelle campagne e-mail';
    const listHref = index.url({ query: { channel: lockedChannel } });

    return (
        <>
            <Head title={title} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {isWhatsApp
                            ? 'Préparez une campagne WhatsApp (template Meta) vers des groupes et/ou des contacts.'
                            : 'Préparez une campagne e-mail vers des groupes et/ou des contacts.'}
                    </p>
                </div>

                <MarketingCampaignForm
                    submitUrl={store.url()}
                    submitLabel="Créer la campagne"
                    cancelHref={listHref}
                    errors={errors}
                    lockedChannel={lockedChannel}
                    lists={lists}
                    contacts={contacts}
                    templates={templates}
                    whatsappAccounts={whatsappAccounts}
                    defaultWhatsappAccountId={defaultWhatsappAccountId}
                    variables={variables}
                />
            </div>
        </>
    );
}

MarketingCampaignsCreate.layout = {
    breadcrumbs: [
        { title: 'Campagnes', href: index.url({ query: { channel: 'email' } }) },
        { title: 'Nouvelle campagne', href: create.url() },
    ],
};
