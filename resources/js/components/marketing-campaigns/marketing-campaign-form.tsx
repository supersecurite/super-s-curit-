import { router } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CampaignAudiencePanel, {
    type AudiencePreviewPayload,
} from '@/components/marketing-campaigns/campaign-audience-panel';
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
import { SearchableMultiSelect } from '@/components/ui/searchable-multi-select';
import { audiencePreview } from '@/routes/marketing-campaigns';
import { store as storeMarketingEditorImage } from '@/routes/marketing-editor-images';

type ListOption = {
    id: number;
    uuid: string;
    name: string;
    contacts_count: number;
};

type ContactOption = {
    uuid: string;
    full_name: string;
    email: string | null;
    phone: string | null;
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

type EmailAccountOption = {
    id: number;
    uuid: string;
    name: string;
    from_address: string;
    daily_send_limit: number | null;
    remaining_today: number | null;
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
    list_uuids?: string[];
    contact_uuids?: string[];
    marketing_message_template_id: number | null;
    marketing_email_account_id?: number | null;
    whatsapp_account_id?: number | null;
    subject: string | null;
    body: string;
};

type MarketingCampaignFormProps = {
    submitUrl: string;
    submitLabel: string;
    cancelHref: string;
    errors: Record<string, string>;
    campaign?: MarketingCampaignFormData;
    lockedChannel: 'email' | 'whatsapp';
    lists: ListOption[];
    contacts: ContactOption[];
    templates: TemplateOption[];
    emailAccounts?: EmailAccountOption[];
    defaultEmailAccountId?: number | null;
    whatsappAccounts?: WhatsAppAccountOption[];
    defaultWhatsappAccountId?: number | null;
    variables: string[];
    method?: 'post' | 'put';
};

export default function MarketingCampaignForm({
    submitUrl,
    submitLabel,
    cancelHref,
    errors,
    campaign,
    lockedChannel,
    lists,
    contacts,
    templates,
    emailAccounts = [],
    defaultEmailAccountId = null,
    whatsappAccounts = [],
    defaultWhatsappAccountId = null,
    variables,
    method = 'post',
}: MarketingCampaignFormProps) {
    const [formData, setFormData] = useState({
        name: campaign?.name ?? '',
        channel: lockedChannel,
        list_uuids: campaign?.list_uuids ?? [],
        contact_uuids: campaign?.contact_uuids ?? [],
        marketing_message_template_id: campaign?.marketing_message_template_id ?? null,
        marketing_email_account_id:
            campaign?.marketing_email_account_id ?? defaultEmailAccountId ?? null,
        whatsapp_account_id:
            campaign?.whatsapp_account_id ?? defaultWhatsappAccountId ?? null,
        subject: campaign?.subject ?? '',
        body: campaign?.body ?? '',
    });
    const [processing, setProcessing] = useState(false);
    const [audience, setAudience] = useState<AudiencePreviewPayload | null>(null);
    const [audienceLoading, setAudienceLoading] = useState(false);
    const [audienceError, setAudienceError] = useState<string | null>(null);

    const isWhatsApp = formData.channel === 'whatsapp';

    const channelTemplates = useMemo(
        () => templates.filter((template) => template.channel === formData.channel),
        [formData.channel, templates],
    );

    const listOptions = useMemo(
        () =>
            lists.map((list) => ({
                value: list.uuid,
                label: `${list.name} (${list.contacts_count} contact${list.contacts_count > 1 ? 's' : ''})`,
            })),
        [lists],
    );

    const contactOptions = useMemo(
        () =>
            contacts.map((contact) => ({
                value: contact.uuid,
                label: [
                    contact.full_name,
                    isWhatsApp
                        ? (contact.phone ?? contact.email)
                        : (contact.email ?? contact.phone),
                ]
                    .filter(Boolean)
                    .join(' — '),
            })),
        [contacts, isWhatsApp],
    );

    const selectedTemplate = useMemo(
        () =>
            channelTemplates.find(
                (template) => template.id === formData.marketing_message_template_id,
            ) ?? null,
        [formData.marketing_message_template_id, channelTemplates],
    );

    const hasAudience =
        formData.list_uuids.length > 0 || formData.contact_uuids.length > 0;

    const updateField = useCallback(
        (field: keyof typeof formData, value: string | number | null | string[]) => {
            setFormData((previous) => ({ ...previous, [field]: value }));
        },
        [],
    );

    const applyTemplate = useCallback(
        (templateId: string) => {
            const parsedId = Number(templateId);
            const template = channelTemplates.find((item) => item.id === parsedId);

            if (!template) {
                return;
            }

            setFormData((previous) => ({
                ...previous,
                marketing_message_template_id: parsedId,
                subject: isWhatsApp
                    ? previous.subject
                    : template.subject?.trim() || previous.subject,
                body: isWhatsApp ? '' : template.body?.trim() || previous.body,
            }));
        },
        [channelTemplates, isWhatsApp],
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
        if (!hasAudience) {
            setAudience(null);
            setAudienceError(null);
            setAudienceLoading(false);

            return;
        }

        const controller = new AbortController();

        setAudienceLoading(true);
        setAudienceError(null);

        const params = new URLSearchParams();
        params.set('channel', formData.channel);
        formData.list_uuids.forEach((uuid) => params.append('list_uuids[]', uuid));
        formData.contact_uuids.forEach((uuid) => params.append('contact_uuids[]', uuid));

        const url = `${audiencePreview.url()}?${params.toString()}`;

        fetch(url, {
            headers: { Accept: 'application/json' },
            signal: controller.signal,
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error('Impossible de charger l’audience.');
                }

                return response.json() as Promise<AudiencePreviewPayload>;
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
                        : 'Impossible de charger l’audience.',
                );
            })
            .finally(() => {
                setAudienceLoading(false);
            });

        return () => controller.abort();
    }, [formData.channel, formData.list_uuids, formData.contact_uuids, hasAudience]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setProcessing(true);

        router.post(
            submitUrl,
            {
                _method: method === 'put' ? 'put' : undefined,
                name: formData.name,
                channel: formData.channel,
                list_uuids: formData.list_uuids,
                contact_uuids: formData.contact_uuids,
                marketing_message_template_id: formData.marketing_message_template_id,
                marketing_email_account_id: isWhatsApp
                    ? null
                    : formData.marketing_email_account_id,
                whatsapp_account_id: isWhatsApp ? formData.whatsapp_account_id : null,
                subject: isWhatsApp ? null : formData.subject,
                body: isWhatsApp ? '' : formData.body,
            },
            {
                onFinish: () => setProcessing(false),
            },
        );
    };

    const editorKey = `campaign-body-${campaign?.uuid ?? 'new'}-${formData.channel}-${formData.marketing_message_template_id ?? 'none'}`;
    const channelLabel = isWhatsApp ? 'WhatsApp' : 'e-mail';
    const canEditMessage =
        !isWhatsApp && formData.marketing_message_template_id !== null;

    return (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] xl:items-start">
            <form onSubmit={handleSubmit} className="app-panel space-y-6 p-4 xl:max-w-none">
                <div className="bg-muted/40 rounded-lg border px-3 py-2 text-sm">
                    Canal verrouillé : <span className="font-medium">{channelLabel}</span>
                </div>

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
                ) : (
                    <div className="space-y-2">
                        <Label htmlFor="marketing_email_account_id">Compte e-mail</Label>
                        <Select
                            value={formData.marketing_email_account_id?.toString() ?? ''}
                            onValueChange={(value) =>
                                updateField('marketing_email_account_id', Number(value))
                            }
                            required
                        >
                            <SelectTrigger id="marketing_email_account_id">
                                <SelectValue placeholder="Choisir un compte" />
                            </SelectTrigger>
                            <SelectContent>
                                {emailAccounts.map((account) => (
                                    <SelectItem key={account.id} value={account.id.toString()}>
                                        {account.name} ({account.from_address}
                                        {account.daily_send_limit !== null
                                            ? ` — ${account.remaining_today ?? 0}/${account.daily_send_limit} restants`
                                            : ''}
                                        )
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.marketing_email_account_id} />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="list_uuids">Groupes</Label>
                    <SearchableMultiSelect
                        id="list_uuids"
                        options={listOptions}
                        value={formData.list_uuids}
                        onChange={(values) => updateField('list_uuids', values)}
                        placeholder="Ajouter des groupes…"
                        searchPlaceholder="Rechercher un groupe…"
                        emptyMessage="Aucun groupe trouvé"
                    />
                    <InputError message={errors.list_uuids} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="contact_uuids">Contacts individuels</Label>
                    <SearchableMultiSelect
                        id="contact_uuids"
                        options={contactOptions}
                        value={formData.contact_uuids}
                        onChange={(values) => updateField('contact_uuids', values)}
                        placeholder="Ajouter des contacts…"
                        searchPlaceholder="Rechercher un contact…"
                        emptyMessage="Aucun contact trouvé"
                    />
                    <p className="text-muted-foreground text-xs">
                        Combinez groupes et contacts : l’audience fusionne sans doublon.
                    </p>
                    <InputError message={errors.contact_uuids} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="marketing_message_template_id">
                        {isWhatsApp ? 'Template WhatsApp' : 'Template e-mail'}
                    </Label>
                    {channelTemplates.length > 0 ? (
                        <Select
                            value={formData.marketing_message_template_id?.toString() ?? ''}
                            onValueChange={applyTemplate}
                            required
                        >
                            <SelectTrigger id="marketing_message_template_id">
                                <SelectValue placeholder="Choisir un template" />
                            </SelectTrigger>
                            <SelectContent>
                                {channelTemplates.map((template) => (
                                    <SelectItem key={template.id} value={template.id.toString()}>
                                        {template.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <div className="rounded-lg border border-dashed border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                            <p className="font-medium">Aucun template disponible pour ce canal.</p>
                            <p className="text-muted-foreground mt-1 text-xs">
                                Vous devez créer un template {isWhatsApp ? 'WhatsApp' : 'e-mail'} avant de pouvoir configurer une campagne.
                            </p>
                        </div>
                    )}
                    {!isWhatsApp && channelTemplates.length > 0 ? (
                        <p className="text-muted-foreground text-xs">
                            Sélectionnez un template disponible : l’objet et le message seront chargés et modifiables avant validation.
                        </p>
                    ) : null}
                    <InputError message={errors.marketing_message_template_id} />
                </div>

                {!isWhatsApp ? (
                    canEditMessage ? (
                        <>
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
                                    key={editorKey}
                                    initialContent={formData.body?.trim() ? formData.body : ''}
                                    fallbackPlainContent={
                                        formData.body?.trim() ? '' : formData.body
                                    }
                                    onChange={(content) => updateField('body', content)}
                                    variables={variables}
                                    imageUploadUrl={storeMarketingEditorImage.url()}
                                />
                                <InputError message={errors.body} />
                            </div>
                        </>
                    ) : (
                        <div className="bg-muted/40 text-muted-foreground rounded-lg border p-3 text-sm">
                            Choisissez un template pour charger l’objet et le message
                            (modifiables ensuite).
                        </div>
                    )
                ) : (
                    <div className="bg-muted/40 space-y-2 rounded-lg border p-3 text-sm">
                        <p className="font-medium">Envoi via modèle Meta uniquement</p>
                        <p className="text-muted-foreground text-xs">
                            WhatsApp n&apos;accepte pas de message libre hors fenêtre de
                            conversation. Sélectionnez un template dont le nom Meta correspond
                            à un modèle approuvé. Les variables Meta {'{{1}}'}, {'{{2}}'},{' '}
                            {'{{3}}'} sont remplies avec le nom et l&apos;entreprise du contact.
                        </p>
                        {selectedTemplate ? (
                            <dl className="grid gap-1 text-xs sm:grid-cols-2">
                                <div>
                                    <dt className="text-muted-foreground">Modèle Meta</dt>
                                    <dd className="font-mono">
                                        {selectedTemplate.meta_template_name ?? '—'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Langue</dt>
                                    <dd className="font-mono">
                                        {selectedTemplate.meta_template_language ?? '—'}
                                    </dd>
                                </div>
                            </dl>
                        ) : null}
                    </div>
                )}

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
                {hasAudience ? (
                    <CampaignAudiencePanel
                        audience={audience}
                        loading={audienceLoading}
                        error={audienceError}
                        channel={formData.channel}
                    />
                ) : null}

                {selectedTemplate !== null ? (
                    <CampaignTemplatePreviewPanel template={selectedTemplate} />
                ) : null}

                {!hasAudience && selectedTemplate === null ? (
                    <section className="app-panel p-4">
                        <p className="text-muted-foreground text-sm">
                            Sélectionnez des groupes et/ou des contacts pour voir l&apos;audience,
                            et un template pour prévisualiser le message.
                        </p>
                    </section>
                ) : null}
            </aside>
        </div>
    );
}
