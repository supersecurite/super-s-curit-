import { Head, setLayoutProps, usePage } from '@inertiajs/react';
import MarketingCampaignForm from '@/components/marketing-campaigns/marketing-campaign-form';
import { useTrans } from '@/hooks/use-trans';
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

type EmailAccountOption = {
    id: number;
    uuid: string;
    name: string;
    from_address: string;
    daily_send_limit: number | null;
    remaining_today: number | null;
};

type PageProps = {
    errors: Record<string, string>;
    lockedChannel: 'email' | 'whatsapp';
    lists: ListOption[];
    contacts: ContactOption[];
    templates: TemplateOption[];
    emailAccounts: EmailAccountOption[];
    defaultEmailAccountId: number | null;
    whatsappAccounts: WhatsAppAccountOption[];
    defaultWhatsappAccountId: number | null;
    variables: string[];
};

export default function MarketingCampaignsCreate() {
    const { t } = useTrans();
    const {
        errors,
        lockedChannel,
        lists,
        contacts,
        templates,
        emailAccounts,
        defaultEmailAccountId,
        whatsappAccounts,
        defaultWhatsappAccountId,
        variables,
    } = usePage<PageProps>().props;

    const isWhatsApp = lockedChannel === 'whatsapp';
    const title = isWhatsApp
        ? t('marketing_campaigns.create_whatsapp', 'Nouvelle campagne WhatsApp')
        : t('marketing_campaigns.create_email', 'Nouvelle campagne e-mail');
    const listHref = index.url({ query: { channel: lockedChannel } });
    const listTitle = isWhatsApp
        ? t('marketing_campaigns.title_whatsapp', 'Campagnes WhatsApp')
        : t('marketing_campaigns.title_email', 'Campagnes e-mail');

    setLayoutProps({
        breadcrumbs: [
            { title: listTitle, href: listHref },
            { title, href: create.url() },
        ],
    });

    return (
        <>
            <Head title={title} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {isWhatsApp
                            ? t(
                                  'marketing_campaigns.create_subtitle_whatsapp',
                                  'Préparez une campagne WhatsApp (template Meta) vers des groupes et/ou des contacts.',
                              )
                            : t(
                                  'marketing_campaigns.create_subtitle_email',
                                  'Préparez une campagne e-mail vers des groupes et/ou des contacts.',
                              )}
                    </p>
                </div>

                <MarketingCampaignForm
                    submitUrl={store.url()}
                    submitLabel={t(
                        'marketing_campaigns.submit_create',
                        'Créer la campagne',
                    )}
                    cancelHref={listHref}
                    errors={errors}
                    lockedChannel={lockedChannel}
                    lists={lists}
                    contacts={contacts}
                    templates={templates}
                    emailAccounts={emailAccounts}
                    defaultEmailAccountId={defaultEmailAccountId}
                    whatsappAccounts={whatsappAccounts}
                    defaultWhatsappAccountId={defaultWhatsappAccountId}
                    variables={variables}
                />
            </div>
        </>
    );
}
