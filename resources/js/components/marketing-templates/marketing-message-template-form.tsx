import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import InputError from '@/components/input-error';
import MarketingTemplateEditor from '@/components/marketing-templates/marketing-template-editor';
import TemplateSubjectInput from '@/components/marketing-templates/template-subject-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DEFAULT_MARKETING_TEMPLATE_BODY,
    DEFAULT_MARKETING_TEMPLATE_SUBJECT,
} from '@/lib/marketing-template-variables';
import { store as storeMarketingEditorImage } from '@/routes/marketing-editor-images';

type MarketingMessageTemplateFormData = {
    uuid?: string;
    name: string;
    channel: string;
    subject?: string | null;
    body: string;
    meta_template_name?: string | null;
    meta_template_language?: string | null;
};

type MarketingMessageTemplateFormProps = {
    submitUrl: string;
    submitLabel: string;
    cancelHref: string;
    errors: Record<string, string>;
    template?: MarketingMessageTemplateFormData;
    lockedChannel?: 'email' | 'whatsapp';
    variables: string[];
    method?: 'post' | 'put';
};

function resolveInitialBody(template?: MarketingMessageTemplateFormData): string {
    if (template?.body?.trim()) {
        return template.body;
    }

    return DEFAULT_MARKETING_TEMPLATE_BODY;
}

function resolveInitialSubject(template?: MarketingMessageTemplateFormData): string {
    if (template?.subject?.trim()) {
        return template.subject;
    }

    return DEFAULT_MARKETING_TEMPLATE_SUBJECT;
}

export default function MarketingMessageTemplateForm({
    submitUrl,
    submitLabel,
    cancelHref,
    errors,
    template,
    lockedChannel,
    variables,
    method = 'post',
}: MarketingMessageTemplateFormProps) {
    const isEditing = method === 'put';
    const [formData, setFormData] = useState({
        name: template?.name ?? '',
        channel: template?.channel ?? lockedChannel ?? 'email',
        subject: resolveInitialSubject(template),
        body: resolveInitialBody(template),
        meta_template_name: template?.meta_template_name ?? '',
        meta_template_language: template?.meta_template_language ?? 'fr',
    });
    const [processing, setProcessing] = useState(false);

    const isWhatsApp = formData.channel === 'whatsapp';
    const channelLocked = lockedChannel !== undefined || isEditing;

    const updateField = useCallback(
        (
            field:
                | 'name'
                | 'channel'
                | 'subject'
                | 'body'
                | 'meta_template_name'
                | 'meta_template_language',
            value: string,
        ) => {
            setFormData((previous) => ({ ...previous, [field]: value }));
        },
        [],
    );

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setProcessing(true);

        router.post(
            submitUrl,
            {
                _method: method === 'put' ? 'put' : undefined,
                name: formData.name,
                channel: formData.channel,
                subject: isWhatsApp ? null : formData.subject,
                body: isWhatsApp ? '' : formData.body,
                meta_template_name: isWhatsApp ? formData.meta_template_name : null,
                meta_template_language: isWhatsApp
                    ? formData.meta_template_language
                    : null,
            },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border bg-card p-6"
        >
            <div className="space-y-2">
                <Label htmlFor="name">Titre interne</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    placeholder="Relance prospect Q1"
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="channel">Canal</Label>
                {channelLocked ? (
                    <div className="bg-muted/40 rounded-lg border px-3 py-2 text-sm">
                        Canal verrouillé :{' '}
                        <span className="font-medium">
                            {isWhatsApp ? 'WhatsApp' : 'E-mail'}
                        </span>
                    </div>
                ) : (
                    <Select
                        value={formData.channel}
                        onValueChange={(value) => updateField('channel', value)}
                    >
                        <SelectTrigger id="channel">
                            <SelectValue placeholder="Canal" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="email">E-mail</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                    </Select>
                )}
                <InputError message={errors.channel} />
            </div>

            {isWhatsApp ? (
                <div className="space-y-4 rounded-xl border bg-muted/10 p-4">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h2 className="text-sm font-semibold">Configuration du modèle Meta WhatsApp</h2>
                        <Badge variant="outline" className="text-xs">
                            Modèle approuvé
                        </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="meta_template_name">Nom du modèle Meta</Label>
                            <Input
                                id="meta_template_name"
                                value={formData.meta_template_name}
                                onChange={(event) =>
                                    updateField('meta_template_name', event.target.value)
                                }
                                placeholder="notification_securite"
                                required
                            />
                            <p className="text-muted-foreground text-xs">
                                Nom technique exact du modèle dans votre Meta Business Manager.
                            </p>
                            <InputError message={errors.meta_template_name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="meta_template_language">Code langue Meta</Label>
                            <Input
                                id="meta_template_language"
                                value={formData.meta_template_language}
                                onChange={(event) =>
                                    updateField('meta_template_language', event.target.value)
                                }
                                placeholder="fr"
                                required
                            />
                            <p className="text-muted-foreground text-xs">
                                Code langue officiel (ex. fr, en_US, etc.).
                            </p>
                            <InputError message={errors.meta_template_language} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">En-tête du message (optionnel)</Label>
                        <Input
                            id="subject"
                            value={formData.subject ?? ''}
                            onChange={(event) => updateField('subject', event.target.value)}
                            placeholder="Super Sécurité — Alerte"
                        />
                        <InputError message={errors.subject} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="body">Texte du modèle & Variables positionnelles</Label>
                        <textarea
                            id="body"
                            rows={4}
                            value={formData.body}
                            onChange={(event) => updateField('body', event.target.value)}
                            placeholder="Bonjour {{1}}, nous vous confirmons votre devis pour l'entreprise {{2}}..."
                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono text-xs"
                        />
                        <p className="text-muted-foreground text-xs">
                            Indiquez le texte du modèle Meta avec les variables positionnelles <code className="text-primary font-bold">{'{{1}}'}</code>, <code className="text-primary font-bold">{'{{2}}'}</code>, <code className="text-primary font-bold">{'{{3}}'}</code> pour prévisualiser le rendu final.
                        </p>
                        <InputError message={errors.body} />
                    </div>

                    {/* Live preview */}
                    {formData.body ? (
                        <div className="space-y-2 pt-2 border-t">
                            <Label className="text-xs text-muted-foreground">Aperçu du rendu WhatsApp</Label>
                            <div className="max-w-md rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 space-y-1 text-xs text-foreground shadow-xs">
                                {formData.subject ? (
                                    <p className="font-semibold text-foreground border-b border-emerald-500/10 pb-1">
                                        {formData.subject}
                                    </p>
                                ) : null}
                                <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                                    {formData.body
                                        .replace(/\{\{1\}\}/g, 'Mamadou Camara')
                                        .replace(/\{\{2\}\}/g, '+224 620 00 00 00')
                                        .replace(/\{\{3\}\}/g, 'Super Sécurité SARL')}
                                </p>
                                <p className="text-[10px] text-muted-foreground/60 text-right pt-1">
                                    12:00 ✓✓
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="subject">Objet de l&apos;e-mail</Label>
                        <TemplateSubjectInput
                            value={formData.subject}
                            onChange={(value) => updateField('subject', value)}
                            variables={variables}
                            placeholder={DEFAULT_MARKETING_TEMPLATE_SUBJECT}
                            required
                        />
                        <InputError message={errors.subject} />
                    </div>

                    <div className="space-y-2">
                        <Label>Contenu du message</Label>
                        <MarketingTemplateEditor
                            key={`${template?.uuid ?? 'new-template'}-${formData.channel}`}
                            initialContent={isEditing ? formData.body : ''}
                            fallbackPlainContent={isEditing ? '' : formData.body}
                            onChange={(content) => updateField('body', content)}
                            variables={variables}
                            imageUploadUrl={storeMarketingEditorImage.url()}
                        />
                        <InputError message={errors.body} />
                    </div>
                </>
            )}

            <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={processing}>
                    {submitLabel}
                </Button>
                <Button type="button" variant="outline" asChild>
                    <a href={cancelHref}>Annuler</a>
                </Button>
            </div>
        </form>
    );
}
