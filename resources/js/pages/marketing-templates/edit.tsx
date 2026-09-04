import { Head, setLayoutProps, usePage } from '@inertiajs/react';
import MarketingMessageTemplateForm from '@/components/marketing-templates/marketing-message-template-form';
import { edit, index, show, update } from '@/routes/marketing-templates';

type PageProps = {
    template: {
        uuid: string;
        name: string;
        channel: string;
        subject: string | null;
        body: string;
    };
    errors: Record<string, string>;
    variables: string[];
};

export default function MarketingTemplatesEdit() {
    const { template, errors, variables } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Templates',
                href: index.url({ query: { channel: template.channel } }),
            },
            { title: template.name, href: show.url(template.uuid) },
            { title: 'Modifier', href: edit.url(template.uuid) },
        ],
    });

    return (
        <>
            <Head title={`Modifier — ${template.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Modifier le template
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">{template.name}</p>
                </div>

                <MarketingMessageTemplateForm
                    submitUrl={update.url(template.uuid)}
                    submitLabel="Enregistrer"
                    cancelHref={show.url(template.uuid)}
                    errors={errors}
                    template={template}
                    variables={variables}
                    method="put"
                />
            </div>
        </>
    );
}
