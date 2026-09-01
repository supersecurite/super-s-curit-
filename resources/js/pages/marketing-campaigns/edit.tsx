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
    subject: string | null;
    body: string;
};

type CampaignData = {
    uuid: string;
    name: string;
    marketing_list_id: number;
    marketing_message_template_id: number | null;
    subject: string;
    body: string;
};

type PageProps = {
    campaign: CampaignData;
    errors: Record<string, string>;
    lists: ListOption[];
    templates: TemplateOption[];
    variables: string[];
};

export default function MarketingCampaignsEdit() {
    const { campaign, errors, lists, templates, variables } = usePage<PageProps>().props;

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
                    variables={variables}
                    method="put"
                />
            </div>
        </>
    );
}

MarketingCampaignsEdit.layout = {
    breadcrumbs: [
        { title: 'Campagnes e-mail', href: index.url() },
        { title: 'Modifier', href: edit.url('') },
    ],
};
