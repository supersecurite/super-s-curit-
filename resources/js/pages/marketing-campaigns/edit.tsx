import { Head, usePage } from '@inertiajs/react';
import MarketingCampaignForm from '@/components/marketing-campaigns/marketing-campaign-form';
import { edit, index, show, update } from '@/routes/marketing-campaigns';

type ListOption = {
    id: number;
    uuid: string;
    name: string;
    contacts_count: number;
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
    marketing_list_id: number;
    marketing_message_template_id: number | null;
    whatsapp_account_id: number | null;
    subject: string;
    body: string;
};

type PageProps = {
    campaign: CampaignData;
    errors: Record<string, string>;
    lists: ListOption[];
    templates: TemplateOption[];
    whatsappAccounts: WhatsAppAccountOption[];
    variables: string[];
};

export default function MarketingCampaignsEdit() {
    const { campaign, errors, lists, templates, whatsappAccounts, variables } =
        usePage<PageProps>().props;

    return (
        <>
            <Head title={`Modifier — ${campaign.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Modifier la campagne
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">{campaign.name}</p>
                </div>

                <MarketingCampaignForm
                    submitUrl={update.url(campaign.uuid)}
                    submitLabel="Enregistrer"
                    cancelHref={show.url(campaign.uuid)}
                    errors={errors}
                    campaign={campaign}
                    lists={lists}
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
