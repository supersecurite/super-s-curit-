import { Head, Link, setLayoutProps, usePage } from '@inertiajs/react';
import { ArrowLeft, FileText, Pencil } from 'lucide-react';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import ContentRenderer from '@/components/lexical-editor/content-renderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { variableTokenClassName } from '@/lib/marketing-template-variables';
import { destroy, edit, index, show } from '@/routes/marketing-templates';

type TemplateData = {
    uuid: string;
    name: string;
    channel: string;
    channel_label: string;
    subject: string | null;
    body: string;
    created_at_formatted: string | null;
    updated_at_formatted: string | null;
};

type PageProps = {
    template: TemplateData;
    variables: string[];
    canUpdate: boolean;
    canDelete: boolean;
};

export default function MarketingTemplatesShow() {
    const { template, variables, canUpdate, canDelete } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            { title: 'Templates', href: index.url() },
            { title: template.name, href: show.url(template.uuid) },
        ],
    });

    return (
        <>
            <Head title={template.name} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <Link
                            href={index.url()}
                            className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-sm"
                        >
                            <ArrowLeft className="size-4" aria-hidden />
                            Retour à la liste
                        </Link>
                        <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
                            <FileText className="size-6" aria-hidden />
                            {template.name}
                        </h1>
                        <div className="mt-2">
                            <Badge variant="outline">{template.channel_label}</Badge>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {canUpdate ? (
                            <Button asChild>
                                <Link href={edit.url(template.uuid)}>
                                    <Pencil className="size-4" aria-hidden />
                                    Modifier
                                </Link>
                            </Button>
                        ) : null}
                        {canDelete ? (
                            <ConfirmDeleteDialog
                                title="Supprimer ce template ?"
                                description={`Le template « ${template.name} » sera définitivement supprimé.`}
                                deleteUrl={destroy.url(template.uuid)}
                                triggerLabel="Supprimer"
                                triggerVariant="outline"
                                triggerClassName="text-destructive hover:text-destructive"
                            />
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <section className="app-panel space-y-4 p-4">
                        <h2 className="font-semibold">Détails</h2>
                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Objet</dt>
                                <dd>
                                    {template.subject ? (
                                        template.subject
                                            .split(/(\{\{[a-z_]+\}\})/g)
                                            .filter(Boolean)
                                            .map((part, partIndex) => {
                                                const match = part.match(/^\{\{([a-z_]+)\}\}$/);

                                                if (match) {
                                                    return (
                                                        <span
                                                            key={`subject-var-${partIndex}`}
                                                            className={variableTokenClassName()}
                                                        >
                                                            {part}
                                                        </span>
                                                    );
                                                }

                                                return (
                                                    <span key={`subject-text-${partIndex}`}>
                                                        {part}
                                                    </span>
                                                );
                                            })
                                    ) : (
                                        '—'
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </section>

                    <section className="app-panel space-y-4 p-4">
                        <h2 className="font-semibold">Variables</h2>
                        <div className="flex flex-wrap gap-1.5">
                            {variables.map((variable) => (
                                <Badge key={variable} variant="outline" className="font-mono text-xs">
                                    {`{{${variable}}}`}
                                </Badge>
                            ))}
                        </div>
                    </section>

                    <section className="app-panel space-y-4 p-4 lg:col-span-2">
                        <h2 className="font-semibold">Contenu</h2>
                        <ContentRenderer content={template.body} />
                    </section>
                </div>

                <p className="text-muted-foreground text-xs">
                    Créé le {template.created_at_formatted ?? '—'}
                    {template.updated_at_formatted
                        ? ` · Modifié le ${template.updated_at_formatted}`
                        : ''}
                </p>
            </div>
        </>
    );
}

MarketingTemplatesShow.layout = {
    breadcrumbs: [
        { title: 'Templates', href: index.url() },
        { title: 'Détail', href: show.url('') },
    ],
};
