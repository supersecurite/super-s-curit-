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
    meta_template_name?: string | null;
    meta_template_language?: string | null;
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
            {
                title: 'Templates',
                href: index.url({ query: { channel: template.channel } }),
            },
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
                            href={index.url({ query: { channel: template.channel } })}
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
                            {template.channel === 'whatsapp' ? (
                                <>
                                    <div>
                                        <dt className="text-muted-foreground">Modèle Meta</dt>
                                        <dd className="font-mono text-sm">
                                            {template.meta_template_name ?? '—'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-muted-foreground">Langue Meta</dt>
                                        <dd className="font-mono text-sm">
                                            {template.meta_template_language ?? '—'}
                                        </dd>
                                    </div>
                                </>
                            ) : (
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
                            )}
                        </dl>
                    </section>

                    {template.channel === 'email' ? (
                        <section className="app-panel space-y-4 p-4">
                            <h2 className="font-semibold">Variables</h2>
                            <div className="flex flex-wrap gap-1.5">
                                {variables.map((variable) => (
                                    <Badge
                                        key={variable}
                                        variant="outline"
                                        className="font-mono text-xs"
                                    >
                                        {`{{${variable}}}`}
                                    </Badge>
                                ))}
                            </div>
                        </section>
                    ) : (
                        <section className="app-panel space-y-4 p-4">
                            <h2 className="font-semibold">Paramètres Meta</h2>
                            <p className="text-muted-foreground text-sm">
                                Les variables positionnelles {'{{1}}'}, {'{{2}}'}, {'{{3}}'} du
                                modèle Meta sont remplies avec prénom, nom et entreprise du
                                destinataire lors de l&apos;envoi.
                            </p>
                        </section>
                    )}

                    {template.channel === 'email' ? (
                        <section className="app-panel space-y-4 p-4 lg:col-span-2">
                            <h2 className="font-semibold">Contenu</h2>
                            <ContentRenderer content={template.body} />
                        </section>
                    ) : (
                        <section className="app-panel space-y-4 p-4 lg:col-span-2">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold">Aperçu du message WhatsApp</h2>
                                <Badge variant="outline" className="text-xs">
                                    Modèle Meta : {template.meta_template_name}
                                </Badge>
                            </div>

                            <div className="grid gap-6 md:grid-cols-[1fr_320px] items-start">
                                {/* WhatsApp Phone Bubble */}
                                <div className="rounded-2xl border bg-muted/20 p-4 sm:p-6 flex flex-col items-center">
                                    <div className="w-full max-w-sm rounded-2xl bg-[#e5ddd5] dark:bg-[#0b141a] p-4 shadow-md space-y-2">
                                        <div className="rounded-xl bg-white dark:bg-[#1f2c34] p-3.5 shadow-xs text-xs text-foreground space-y-1.5">
                                            {template.subject ? (
                                                <p className="font-bold text-foreground border-b border-border/40 pb-1">
                                                    {template.subject}
                                                </p>
                                            ) : null}
                                            <p className="whitespace-pre-line leading-relaxed text-foreground/90">
                                                {template.body || `Bonjour {{1}}, message envoyé via le modèle approuvé ${template.meta_template_name}.`}
                                            </p>
                                            <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground/70 pt-1">
                                                <span>12:00</span>
                                                <span className="text-emerald-500 font-bold">✓✓</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-[11px] mt-2">
                                        Aperçu simulé du message reçu par le destinataire
                                    </p>
                                </div>

                                {/* Variables explanation */}
                                <div className="space-y-3 rounded-xl border bg-card p-4 text-xs">
                                    <h3 className="font-semibold text-sm">Variables positionnelles Meta</h3>
                                    <p className="text-muted-foreground">
                                        Les balises sont automatiquement remplies pour chaque destinataire :
                                    </p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2 rounded-lg border p-2 bg-muted/20">
                                            <code className="font-bold text-primary shrink-0">{'{{1}}'}</code>
                                            <span className="text-muted-foreground">Nom complet du contact</span>
                                        </li>
                                        <li className="flex items-start gap-2 rounded-lg border p-2 bg-muted/20">
                                            <code className="font-bold text-primary shrink-0">{'{{2}}'}</code>
                                            <span className="text-muted-foreground">Téléphone / Contact secondaire</span>
                                        </li>
                                        <li className="flex items-start gap-2 rounded-lg border p-2 bg-muted/20">
                                            <code className="font-bold text-primary shrink-0">{'{{3}}'}</code>
                                            <span className="text-muted-foreground">Nom de l&apos;entreprise</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    )}
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
