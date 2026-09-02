import { Head, usePage } from '@inertiajs/react';
import MarketingCampaignForm from '@/components/marketing-campaigns/marketing-campaign-form';
import { create, index, store } from '@/routes/marketing-campaigns';

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

type PageProps = {
    errors: Record<string, string>;
    lists: ListOption[];
    templates: TemplateOption[];
    whatsappAccounts: WhatsAppAccountOption[];
    defaultWhatsappAccountId: number | null;
    variables: string[];
};

export default function MarketingCampaignsCreate() {
    const {
        errors,
        lists,
        templates,
        whatsappAccounts,
        defaultWhatsappAccountId,
        variables,
    } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Nouvelle campagne" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Nouvelle campagne
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Préparez une campagne e-mail ou WhatsApp vers un groupe.
                    </p>
                </div>

                <MarketingCampaignForm
                    submitUrl={store.url()}
                    submitLabel="Créer la campagne"
                    cancelHref={index.url()}
                    errors={errors}
                    lists={lists}
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
        { title: 'Campagnes', href: index.url() },
        { title: 'Nouvelle campagne', href: create.url() },
    ],
};
