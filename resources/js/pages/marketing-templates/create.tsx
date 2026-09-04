import { Head, usePage } from '@inertiajs/react';
import MarketingMessageTemplateForm from '@/components/marketing-templates/marketing-message-template-form';
import { create, index, store } from '@/routes/marketing-templates';

type WhatsAppAccountOption = {
    id: number;
    uuid: string;
    name: string;
    is_default: boolean;
};

type PageProps = {
    errors: Record<string, string>;
    lockedChannel: 'email' | 'whatsapp';
    variables: string[];
    whatsappAccounts?: WhatsAppAccountOption[];
};

export default function MarketingTemplatesCreate() {
    const { errors, lockedChannel, variables, whatsappAccounts = [] } = usePage<PageProps>().props;
    const isWhatsApp = lockedChannel === 'whatsapp';
    const title = isWhatsApp ? 'Nouveau template WhatsApp' : 'Nouveau template e-mail';
    const listHref = index.url({ query: { channel: lockedChannel } });

    return (
        <>
            <Head title={title} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {isWhatsApp
                                ? 'Créez votre modèle WhatsApp — il sera automatiquement soumis pour approbation Meta.'
                                : 'Créez un template e-mail réutilisable avec variables dynamiques.'}
                        </p>
                    </div>
                </div>

                <MarketingMessageTemplateForm
                    submitUrl={store.url()}
                    submitLabel={isWhatsApp ? 'Créer et soumettre à Meta' : 'Créer le template'}
                    cancelHref={listHref}
                    errors={errors}
                    lockedChannel={lockedChannel}
                    variables={variables}
                    whatsappAccounts={whatsappAccounts}
                />
            </div>
        </>
    );
}

MarketingTemplatesCreate.layout = {
    breadcrumbs: [
        { title: 'Templates', href: index.url({ query: { channel: 'email' } }) },
        { title: 'Nouveau template', href: create.url() },
    ],
};
