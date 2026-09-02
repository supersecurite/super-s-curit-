import { Head, usePage } from '@inertiajs/react';
import MarketingCampaignForm from '@/components/marketing-campaigns/marketing-campaign-form';
import { edit, index, show, update } from '@/routes/marketing-campaigns';

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

type CampaignData = {
    uuid: string;
    name: string;
    channel: string;
    list_uuids: string[];
    contact_uuids: string[];
    marketing_message_template_id: number | null;
    whatsapp_account_id: number | null;
    subject: string | null;
    body: string;
};

type PageProps = {
    campaign: CampaignData;
    lockedChannel: 'email' | 'whatsapp';
    errors: Record<string, string>;
    lists: ListOption[];
    contacts: ContactOption[];
    templates: TemplateOption[];
    whatsappAccounts: WhatsAppAccountOption[];
    variables: string[];
};

export default function MarketingCampaignsEdit() {
    const {
        campaign,
        lockedChannel,
        errors,
        lists,
        contacts,
        templates,
        whatsappAccounts,
        variables,
    } = usePage<PageProps>().props;

    const isWhatsApp = lockedChannel === 'whatsapp';
    const listHref = index.url({ query: { channel: lockedChannel } });

    return (
        <>
            <Head title={`Modifier — ${campaign.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Modifier la campagne {isWhatsApp ? 'WhatsApp' : 'e-mail'}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">{campaign.name}</p>
                </div>

                <MarketingCampaignForm
                    submitUrl={update.url(campaign.uuid)}
                    submitLabel="Enregistrer"
                    cancelHref={show.url(campaign.uuid)}
                    errors={errors}
                    campaign={campaign}
                    lockedChannel={lockedChannel}
                    lists={lists}
                    contacts={contacts}
                    templates={templates}
                    whatsappAccounts={whatsappAccounts}
                    variables={variables}
                    method="put"
                />
            </div>
        </>
    );
}

MarketingCampaignsEdit.layout = {
    breadcrumbs: [
        { title: 'Campagnes', href: index.url() },
        { title: 'Modifier', href: edit.url('') },
    ],
};
