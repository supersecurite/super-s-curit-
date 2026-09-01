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
    subject: string | null;
    body: string;
};

type MarketingCampaignFormData = {
    uuid?: string;
    name: string;
    marketing_list_id: number | null;
    marketing_message_template_id: number | null;
    subject: string;
    body: string;
};

type MarketingCampaignFormProps = {
    submitUrl: string;
    submitLabel: string;
    cancelHref: string;
    errors: Record<string, string>;
    campaign?: MarketingCampaignFormData;
    lists: ListOption[];
    templates: TemplateOption[];
    variables: string[];
    method?: 'post' | 'put';
};

function resolveInitialSubject(campaign?: MarketingCampaignFormData): string {
    if (campaign?.subject?.trim()) {
        return campaign.subject;
    }

    return DEFAULT_MARKETING_TEMPLATE_SUBJECT;
}

function resolveInitialBody(campaign?: MarketingCampaignFormData): string {
    if (campaign?.body?.trim()) {
        return campaign.body;
    }

    return DEFAULT_MARKETING_TEMPLATE_BODY;
}

export default function MarketingCampaignForm({
    submitUrl,
    submitLabel,
    cancelHref,
    errors,
    campaign,
    lists,
    templates,
    variables,
    method = 'post',
}: MarketingCampaignFormProps) {
    const [formData, setFormData] = useState({
        name: campaign?.name ?? '',
        marketing_list_id: campaign?.marketing_list_id ?? null,
        marketing_message_template_id: campaign?.marketing_message_template_id ?? null,
        subject: resolveInitialSubject(campaign),
        body: resolveInitialBody(campaign),
    });
    const [processing, setProcessing] = useState(false);

    const updateField = useCallback(
        (field: keyof typeof formData, value: string | number | null) => {
            setFormData((previous) => ({ ...previous, [field]: value }));
        },
        [],
    );

    const applyTemplate = useCallback(
        (templateId: string) => {
            const parsedId = templateId === 'none' ? null : Number(templateId);
            updateField('marketing_message_template_id', parsedId);

            if (parsedId === null) {
                return;
            }

            const template = templates.find((item) => item.id === parsedId);

            if (!template) {
                return;
            }

            setFormData((previous) => ({
                ...previous,
                marketing_message_template_id: parsedId,
                subject: template.subject?.trim() || previous.subject,
                body: template.body?.trim() || previous.body,
            }));
        },
        [templates, updateField],
    );

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setProcessing(true);

        router.post(
            submitUrl,
            {
                _method: method === 'put' ? 'put' : undefined,
                name: formData.name,
                marketing_list_id: formData.marketing_list_id,
                marketing_message_template_id: formData.marketing_message_template_id,
                subject: formData.subject,
                body: formData.body,
            },
            {
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <form onSubmit={handleSubmit} className="app-panel max-w-3xl space-y-6 p-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nom de la campagne</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="marketing_list_id">Liste de diffusion</Label>
                <Select
                    value={formData.marketing_list_id?.toString() ?? ''}
                    onValueChange={(value) => updateField('marketing_list_id', Number(value))}
                    required
                >
                    <SelectTrigger id="marketing_list_id">
                        <SelectValue placeholder="Choisir une liste" />
                    </SelectTrigger>
                    <SelectContent>
                        {lists.map((list) => (
                            <SelectItem key={list.id} value={list.id.toString()}>
                                {list.name} ({list.contacts_count} contact
                                {list.contacts_count > 1 ? 's' : ''})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.marketing_list_id} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="marketing_message_template_id">Modèle (optionnel)</Label>
                <Select
                    value={formData.marketing_message_template_id?.toString() ?? 'none'}
                    onValueChange={applyTemplate}
                >
                    <SelectTrigger id="marketing_message_template_id">
                        <SelectValue placeholder="Sans modèle" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Sans modèle</SelectItem>
                        {templates.map((template) => (
                            <SelectItem key={template.id} value={template.id.toString()}>
                                {template.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.marketing_message_template_id} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="subject">Objet</Label>
                <TemplateSubjectInput
                    id="subject"
                    value={formData.subject}
                    onChange={(value) => updateField('subject', value)}
                    variables={variables}
                />
                <InputError message={errors.subject} />
            </div>

            <div className="space-y-2">
                <Label>Message</Label>
                <MarketingTemplateEditor
                    key={campaign?.uuid ?? 'new-campaign'}
                    initialContent={campaign?.body?.trim() ? campaign.body : ''}
                    fallbackPlainContent={campaign?.body?.trim() ? '' : formData.body}
                    onChange={(content) => updateField('body', content)}
                    variables={variables}
                />
                <InputError message={errors.body} />
            </div>

            <div className="flex flex-wrap gap-2">
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
