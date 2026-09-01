import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import InputError from '@/components/input-error';
import MarketingTemplateEditor from '@/components/marketing-templates/marketing-template-editor';
import TemplateSubjectInput from '@/components/marketing-templates/template-subject-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
        subject: resolveInitialSubject(template),
        body: resolveInitialBody(template),
    });
    const [processing, setProcessing] = useState(false);

    const updateField = useCallback(
        (field: 'name' | 'subject' | 'body', value: string) => {
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
                channel: 'email',
                subject: formData.subject,
                body: formData.body,
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
                    key={template?.uuid ?? 'new-template'}
                    initialContent={isEditing ? formData.body : ''}
                    fallbackPlainContent={isEditing ? '' : formData.body}
                    onChange={(content) => updateField('body', content)}
                    variables={variables}
                />
                <InputError message={errors.body} />
            </div>

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
