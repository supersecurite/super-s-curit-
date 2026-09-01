import { Head, usePage } from '@inertiajs/react';
import MarketingMessageTemplateForm from '@/components/marketing-templates/marketing-message-template-form';
import { create, index, store } from '@/routes/marketing-templates';

type PageProps = {
    errors: Record<string, string>;
    variables: string[];
};

export default function MarketingTemplatesCreate() {
    const { errors, variables } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Nouveau modèle" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Nouveau modèle e-mail
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Créez un modèle réutilisable avec variables dynamiques.
                    </p>
                </div>

                <MarketingMessageTemplateForm
                    submitUrl={store.url()}
                    submitLabel="Créer le modèle"
                    cancelHref={index.url()}
                    errors={errors}
                    variables={variables}
                />
            </div>
        </>
    );
}

MarketingTemplatesCreate.layout = {
    breadcrumbs: [
        { title: 'Modèles de messages', href: index.url() },
        { title: 'Nouveau modèle', href: create.url() },
    ],
};
