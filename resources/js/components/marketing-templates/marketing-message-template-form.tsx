import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import InputError from '@/components/input-error';
import MarketingTemplateEditor from '@/components/marketing-templates/marketing-template-editor';
import TemplateSubjectInput from '@/components/marketing-templates/template-subject-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    variables,
    method = 'post',
}: MarketingMessageTemplateFormProps) {
    const isEditing = method === 'put';
    const [formData, setFormData] = useState({
        name: template?.name ?? '',
        channel: template?.channel ?? 'email',
        subject: resolveInitialSubject(template),
        body: resolveInitialBody(template),
        meta_template_name: template?.meta_template_name ?? '',
        meta_template_language: template?.meta_template_language ?? 'fr',
    });
    const [processing, setProcessing] = useState(false);

    const isWhatsApp = formData.channel === 'whatsapp';

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
                <InputError message={errors.channel} />
            </div>

            {isWhatsApp ? (
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="meta_template_name">Nom du modèle Meta</Label>
                        <Input
                            id="meta_template_name"
                            value={formData.meta_template_name}
                            onChange={(event) =>
                                updateField('meta_template_name', event.target.value)
                            }
                            placeholder="hello_world"
                            required
                        />
                        <p className="text-muted-foreground text-xs">
                            Doit correspondre exactement à un modèle approuvé dans Meta
                            Business Manager. L&apos;envoi WhatsApp utilise uniquement ce
                            modèle (pas de message libre).
                        </p>
                        <InputError message={errors.meta_template_name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="meta_template_language">Langue Meta</Label>
                        <Input
                            id="meta_template_language"
                            value={formData.meta_template_language}
                            onChange={(event) =>
                                updateField('meta_template_language', event.target.value)
                            }
                            placeholder="fr"
                            required
                        />
                        <InputError message={errors.meta_template_language} />
                    </div>
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
