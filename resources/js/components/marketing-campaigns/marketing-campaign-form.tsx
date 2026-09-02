import { router } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CampaignListAudiencePanel, {
    type ListAudiencePayload,
} from '@/components/marketing-campaigns/campaign-list-audience-panel';
import CampaignTemplatePreviewPanel from '@/components/marketing-campaigns/campaign-template-preview-panel';
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
import { listAudience } from '@/routes/marketing-campaigns';

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

type MarketingCampaignFormData = {
    uuid?: string;
    name: string;
    channel?: string;
    marketing_list_id: number | null;
    marketing_message_template_id: number | null;
    whatsapp_account_id?: number | null;
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
    whatsappAccounts?: WhatsAppAccountOption[];
    defaultWhatsappAccountId?: number | null;
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
    whatsappAccounts = [],
    defaultWhatsappAccountId = null,
    variables,
    method = 'post',
}: MarketingCampaignFormProps) {
    const [formData, setFormData] = useState({
        name: campaign?.name ?? '',
        channel: campaign?.channel ?? 'email',
        marketing_list_id: campaign?.marketing_list_id ?? null,
        marketing_message_template_id: campaign?.marketing_message_template_id ?? null,
        whatsapp_account_id:
            campaign?.whatsapp_account_id ?? defaultWhatsappAccountId ?? null,
        subject: resolveInitialSubject(campaign),
        body: resolveInitialBody(campaign),
    });
    const [processing, setProcessing] = useState(false);
    const [audience, setAudience] = useState<ListAudiencePayload | null>(null);
    const [audienceLoading, setAudienceLoading] = useState(false);
    const [audienceError, setAudienceError] = useState<string | null>(null);

    const isWhatsApp = formData.channel === 'whatsapp';

    const channelTemplates = useMemo(
        () => templates.filter((template) => template.channel === formData.channel),
        [formData.channel, templates],
    );

    const selectedList = useMemo(
        () => lists.find((list) => list.id === formData.marketing_list_id) ?? null,
        [formData.marketing_list_id, lists],
    );

    const selectedTemplate = useMemo(
        () =>
            channelTemplates.find(
                (template) => template.id === formData.marketing_message_template_id,
            ) ?? null,
        [formData.marketing_message_template_id, channelTemplates],
    );

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

            const template = channelTemplates.find((item) => item.id === parsedId);

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
        [channelTemplates, updateField],
    );

    useEffect(() => {
        setFormData((previous) => {
            const stillValid = channelTemplates.some(
                (template) => template.id === previous.marketing_message_template_id,
            );

            if (stillValid) {
                return previous;
            }

            return { ...previous, marketing_message_template_id: null };
        });
    }, [channelTemplates]);

    useEffect(() => {
        if (selectedList === null) {
            setAudience(null);
            setAudienceError(null);
            setAudienceLoading(false);

            return;
        }

        const controller = new AbortController();

        setAudienceLoading(true);
        setAudienceError(null);

        const url = listAudience.url(selectedList.uuid, {
            query: { channel: formData.channel },
        });

        fetch(url, {
            headers: { Accept: 'application/json' },
            signal: controller.signal,
        })
            .then(async (response) => {
                if (! response.ok) {
                    throw new Error('Impossible de charger les contacts du groupe.');
                }

                return response.json() as Promise<ListAudiencePayload>;
            })
            .then((payload) => {
                setAudience(payload);
            })
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === 'AbortError') {
                    return;
                }

                setAudience(null);
                setAudienceError(
                    error instanceof Error
                        ? error.message
                        : 'Impossible de charger les contacts du groupe.',
                );
            })
            .finally(() => {
                setAudienceLoading(false);
            });

        return () => controller.abort();
    }, [selectedList, formData.channel]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setProcessing(true);

        router.post(
            submitUrl,
            {
                _method: method === 'put' ? 'put' : undefined,
                name: formData.name,
                channel: formData.channel,
                marketing_list_id: formData.marketing_list_id,
                marketing_message_template_id: formData.marketing_message_template_id,
                whatsapp_account_id: isWhatsApp ? formData.whatsapp_account_id : null,
                subject: isWhatsApp ? formData.subject || 'WhatsApp' : formData.subject,
                body: formData.body,
            },
            {
                onFinish: () => setProcessing(false),
            },
        );
    };

    const editorKey = `campaign-body-${campaign?.uuid ?? 'new'}-${formData.channel}-${formData.marketing_message_template_id ?? 'none'}`;

    return (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] xl:items-start">
            <form onSubmit={handleSubmit} className="app-panel space-y-6 p-4 xl:max-w-none">
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
                    <div className="space-y-2">
                        <Label htmlFor="whatsapp_account_id">Compte WhatsApp</Label>
                        <Select
                            value={formData.whatsapp_account_id?.toString() ?? ''}
                            onValueChange={(value) =>
                                updateField('whatsapp_account_id', Number(value))
                            }
                            required
                        >
                            <SelectTrigger id="whatsapp_account_id">
                                <SelectValue placeholder="Choisir un compte" />
                            </SelectTrigger>
                            <SelectContent>
                                {whatsappAccounts.map((account) => (
                                    <SelectItem key={account.id} value={account.id.toString()}>
                                        {account.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.whatsapp_account_id} />
                    </div>
                ) : null}

                <div className="space-y-2">
                    <Label htmlFor="marketing_list_id">Groupe</Label>
                    <Select
                        value={formData.marketing_list_id?.toString() ?? ''}
                        onValueChange={(value) => updateField('marketing_list_id', Number(value))}
                        required
                    >
                        <SelectTrigger id="marketing_list_id">
                            <SelectValue placeholder="Choisir un groupe" />
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
                    <Label htmlFor="marketing_message_template_id">
                        {isWhatsApp ? 'Template WhatsApp' : 'Template (optionnel)'}
                    </Label>
                    <Select
                        value={formData.marketing_message_template_id?.toString() ?? 'none'}
                        onValueChange={applyTemplate}
                    >
                        <SelectTrigger id="marketing_message_template_id">
                            <SelectValue
                                placeholder={isWhatsApp ? 'Choisir un template' : 'Sans template'}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {!isWhatsApp ? (
                                <SelectItem value="none">Sans template</SelectItem>
                            ) : null}
                            {channelTemplates.map((template) => (
                                <SelectItem key={template.id} value={template.id.toString()}>
                                    {template.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.marketing_message_template_id} />
                </div>

                {!isWhatsApp ? (
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
                ) : (
                    <p className="text-muted-foreground text-sm">
                        L&apos;envoi utilise le modèle Meta approuvé du template. Le « lu »
                        WhatsApp dépend des réglages de confidentialité du destinataire.
                    </p>
                )}

                <div className="space-y-2">
                    <Label>{isWhatsApp ? 'Aperçu / variables' : 'Message'}</Label>
                    <MarketingTemplateEditor
                        key={editorKey}
                        initialContent={formData.body?.trim() ? formData.body : ''}
                        fallbackPlainContent={formData.body?.trim() ? '' : formData.body}
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

            <aside className="space-y-4 xl:sticky xl:top-4">
                {selectedList !== null ? (
                    <CampaignListAudiencePanel
                        audience={audience}
                        loading={audienceLoading}
                        error={audienceError}
                    />
                ) : null}

                {selectedTemplate !== null ? (
                    <CampaignTemplatePreviewPanel template={selectedTemplate} />
                ) : null}

                {selectedList === null && selectedTemplate === null ? (
                    <section className="app-panel p-4">
                        <p className="text-muted-foreground text-sm">
                            Sélectionnez un groupe pour voir l&apos;audience, ou un template pour
                            prévisualiser le message.
                        </p>
                    </section>
                ) : null}
            </aside>
        </div>
    );
}
