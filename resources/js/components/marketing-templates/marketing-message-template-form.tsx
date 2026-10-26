import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { router } from '@inertiajs/react';
import { CheckCheck, Send } from 'lucide-react';
import { useCallback, useState } from 'react';
import InputError from '@/components/input-error';
import MarketingTemplateEditor from '@/components/marketing-templates/marketing-template-editor';
import TemplateSubjectInput from '@/components/marketing-templates/template-subject-input';
import { Badge } from '@/components/ui/badge';
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
import { store as storeMarketingEditorImage } from '@/routes/marketing-editor-images';

type WhatsAppAccountOption = {
    id: number;
    uuid: string;
    name: string;
    is_default: boolean;
};

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
    whatsappAccounts?: WhatsAppAccountOption[];
    method?: 'post' | 'put';
};

function resolveInitialBody(
    template?: MarketingMessageTemplateFormData,
    channel?: string,
): string {
    if (template?.body?.trim()) {
        return template.body;
    }

    if (channel === 'whatsapp') {
        return 'Bonjour {{1}}, nous vous confirmons votre demande pour {{2}}. Notre équipe reste disponible au {{3}}.';
    }

    return DEFAULT_MARKETING_TEMPLATE_BODY;
}

function resolveInitialSubject(
    template?: MarketingMessageTemplateFormData,
): string {
    if (template?.subject?.trim()) {
        return template.subject;
    }

    return DEFAULT_MARKETING_TEMPLATE_SUBJECT;
}

function formatTechnicalName(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/_+/g, '_');
}

export default function MarketingMessageTemplateForm({
    submitUrl,
    submitLabel,
    cancelHref,
    errors,
    template,
    lockedChannel,
    variables,
    whatsappAccounts = [],
    method = 'post',
}: MarketingMessageTemplateFormProps) {
    const { t: uiText } = useUiTranslations();

    const isEditing = method === 'put';
    const initialChannel = template?.channel ?? lockedChannel ?? 'email';
    const [formData, setFormData] = useState({
        account_uuid:
            whatsappAccounts.find((a) => a.is_default)?.uuid ??
            whatsappAccounts[0]?.uuid ??
            '',
        name: template?.name ?? '',
        channel: initialChannel,
        category: 'MARKETING',
        subject: resolveInitialSubject(template),
        body: resolveInitialBody(template, initialChannel),
        footer_text: 'Super Sécurité SARL',
        meta_template_name: template?.meta_template_name ?? '',
        meta_template_language: template?.meta_template_language ?? 'fr',
    });
    const [processing, setProcessing] = useState(false);

    const isWhatsApp = formData.channel === 'whatsapp';
    const channelLocked = lockedChannel !== undefined || isEditing;

    const updateField = useCallback(
        (
            field:
                | 'account_uuid'
                | 'name'
                | 'channel'
                | 'category'
                | 'subject'
                | 'body'
                | 'footer_text'
                | 'meta_template_name'
                | 'meta_template_language',
            value: string,
        ) => {
            setFormData((previous) => ({ ...previous, [field]: value }));
        },
        [],
    );

    const handleNameChange = (value: string) => {
        updateField('name', value);
        if (
            isWhatsApp &&
            (!formData.meta_template_name ||
                formData.meta_template_name ===
                    formatTechnicalName(formData.name))
        ) {
            updateField('meta_template_name', formatTechnicalName(value));
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setProcessing(true);

        router.post(
            submitUrl,
            {
                _method: method === 'put' ? 'put' : undefined,
                account_uuid: isWhatsApp
                    ? formData.account_uuid || undefined
                    : undefined,
                name: formData.name,
                channel: formData.channel,
                category: isWhatsApp ? formData.category : undefined,
                subject: isWhatsApp
                    ? formData.subject?.trim() || null
                    : formData.subject,
                body: formData.body,
                footer_text: isWhatsApp
                    ? formData.footer_text?.trim() || null
                    : undefined,
                meta_template_name: isWhatsApp
                    ? formData.meta_template_name
                    : null,
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
                <Label htmlFor="name">
                    {uiText('ui.components.text_c0139cc8242e', 'Titre interne')}
                </Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(event) => handleNameChange(event.target.value)}
                    placeholder={
                        isWhatsApp
                            ? 'Alerte Gardiennage 2026'
                            : 'Relance prospect Q1'
                    }
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="channel">
                    {uiText('ui.components.text_0119803da011', 'Canal')}
                </Label>
                {channelLocked ? (
                    <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">
                        {uiText('ui.components.text_6ee55707521b', 'Canal :')}{' '}
                        <span className="font-medium">
                            {isWhatsApp
                                ? uiText(
                                      'ui.components.text_6a40edf1fc87',
                                      'WhatsApp',
                                  )
                                : uiText(
                                      'ui.components.text_2550d962e536',
                                      'E-mail',
                                  )}
                        </span>
                    </div>
                ) : (
                    <Select
                        value={formData.channel}
                        onValueChange={(value) => updateField('channel', value)}
                    >
                        <SelectTrigger id="channel">
                            <SelectValue
                                placeholder={uiText(
                                    'ui.components.text_0119803da011',
                                    'Canal',
                                )}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="email">
                                {uiText(
                                    'ui.components.text_2550d962e536',
                                    'E-mail',
                                )}
                            </SelectItem>
                            <SelectItem value="whatsapp">
                                {uiText(
                                    'ui.components.text_6a40edf1fc87',
                                    'WhatsApp',
                                )}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                )}
                <InputError message={errors.channel} />
            </div>

            {isWhatsApp ? (
                <div className="space-y-4 rounded-xl border bg-muted/10 p-4">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h2 className="text-sm font-semibold">
                            {uiText(
                                'ui.components.text_fe69cdbc0ab0',
                                'Configuration du modèle Meta WhatsApp',
                            )}
                        </h2>
                        <Badge variant="outline" className="text-xs">
                            {uiText(
                                'ui.components.text_04e58a2eb8f8',
                                'Meta Cloud API',
                            )}
                        </Badge>
                    </div>

                    {whatsappAccounts.length > 1 && !isEditing ? (
                        <div className="space-y-2">
                            <Label htmlFor="account_uuid">
                                {uiText(
                                    'ui.components.text_166413ecc51b',
                                    'Compte WhatsApp Business',
                                )}
                            </Label>
                            <Select
                                value={formData.account_uuid}
                                onValueChange={(value) =>
                                    updateField('account_uuid', value)
                                }
                            >
                                <SelectTrigger id="account_uuid">
                                    <SelectValue
                                        placeholder={uiText(
                                            'ui.components.text_033c2728f923',
                                            'Sélectionnez un compte',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {whatsappAccounts.map((acc) => (
                                        <SelectItem
                                            key={acc.uuid}
                                            value={acc.uuid}
                                        >
                                            {acc.name}{' '}
                                            {acc.is_default
                                                ? uiText(
                                                      'ui.components.text_72aa305f5dcd',
                                                      '(Par défaut)',
                                                  )
                                                : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.account_uuid} />
                        </div>
                    ) : null}

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="meta_template_name">
                                {uiText(
                                    'ui.components.text_02d4aefa0760',
                                    'Nom technique Meta',
                                )}
                            </Label>
                            <Input
                                id="meta_template_name"
                                value={formData.meta_template_name}
                                onChange={(event) =>
                                    updateField(
                                        'meta_template_name',
                                        formatTechnicalName(event.target.value),
                                    )
                                }
                                placeholder="notification_securite"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                {uiText(
                                    'ui.components.text_e23785fe64fe',
                                    'Minuscules, chiffres et tirets du bas uniquement.',
                                )}
                            </p>
                            <InputError message={errors.meta_template_name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="meta_category">
                                {uiText(
                                    'ui.components.text_a8ff86de868d',
                                    'Catégorie Meta',
                                )}
                            </Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val) =>
                                    updateField('category', val)
                                }
                            >
                                <SelectTrigger id="meta_category">
                                    <SelectValue
                                        placeholder={uiText(
                                            'ui.components.text_68a5341fc6bd',
                                            'Catégorie',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MARKETING">
                                        {uiText(
                                            'ui.components.text_7c3adc7b5735',
                                            'Marketing (Promotions, offres)',
                                        )}
                                    </SelectItem>
                                    <SelectItem value="UTILITY">
                                        {uiText(
                                            'ui.components.text_40f5279489da',
                                            'Utilitaire (Confirmations, alertes)',
                                        )}
                                    </SelectItem>
                                    <SelectItem value="AUTHENTICATION">
                                        {uiText(
                                            'ui.components.text_095126e1ff66',
                                            'Authentification (OTP)',
                                        )}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category} />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="meta_template_language">
                                {uiText(
                                    'ui.components.text_d3e965bb5a04',
                                    'Code langue Meta',
                                )}
                            </Label>
                            <Input
                                id="meta_template_language"
                                value={formData.meta_template_language}
                                onChange={(event) =>
                                    updateField(
                                        'meta_template_language',
                                        event.target.value,
                                    )
                                }
                                placeholder="fr"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                {uiText(
                                    'ui.components.text_9c1b028e2b8e',
                                    'Code langue officiel (ex. fr, en_US, etc.).',
                                )}
                            </p>
                            <InputError
                                message={errors.meta_template_language}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">
                                {uiText(
                                    'ui.components.text_f415d0f53ee2',
                                    'En-tête du message (optionnel, max 60 car.)',
                                )}
                            </Label>
                            <Input
                                id="subject"
                                maxLength={60}
                                value={formData.subject ?? ''}
                                onChange={(event) =>
                                    updateField('subject', event.target.value)
                                }
                                placeholder="Super Sécurité — Information"
                            />
                            <InputError message={errors.subject} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="body">
                                {uiText(
                                    'ui.components.text_c659ee683f5e',
                                    'Texte du modèle & Variables positionnelles (max 1024 car.)',
                                )}
                            </Label>
                            <span className="text-[11px] text-muted-foreground">
                                {formData.body.length}/1024
                            </span>
                        </div>
                        <textarea
                            id="body"
                            rows={4}
                            maxLength={1024}
                            value={formData.body}
                            onChange={(event) =>
                                updateField('body', event.target.value)
                            }
                            placeholder="Bonjour {{1}}, nous vous confirmons votre devis pour l'entreprise {{2}}..."
                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-sm text-xs shadow-xs placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            {uiText(
                                'ui.components.text_69e52f8bfc64',
                                'Indiquez le texte du modèle Meta avec les variables positionnelles',
                            )}{' '}
                            <code className="font-bold text-primary">
                                {'{{1}}'}
                            </code>
                            ,{' '}
                            <code className="font-bold text-primary">
                                {'{{2}}'}
                            </code>
                            ,{' '}
                            <code className="font-bold text-primary">
                                {'{{3}}'}
                            </code>{' '}
                            {uiText(
                                'ui.components.text_0ca7de783f52',
                                "pour injecter automatiquement le nom du client, l'entreprise, le téléphone, etc.",
                            )}
                        </p>
                        <InputError message={errors.body} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="footer_text">
                            {uiText(
                                'ui.components.text_c58f54566719',
                                'Pied de page (optionnel, max 60 car.)',
                            )}
                        </Label>
                        <Input
                            id="footer_text"
                            maxLength={60}
                            value={formData.footer_text}
                            onChange={(event) =>
                                updateField('footer_text', event.target.value)
                            }
                            placeholder="Super Sécurité SARL"
                        />
                        <InputError message={errors.footer_text} />
                    </div>

                    {/* Live preview */}
                    {formData.body ? (
                        <div className="space-y-2 border-t pt-2">
                            <Label className="text-xs text-muted-foreground">
                                {uiText(
                                    'ui.components.text_8ba3ea4530d8',
                                    'Aperçu du rendu WhatsApp',
                                )}
                            </Label>
                            <div className="max-w-md space-y-1 rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-4 text-xs text-foreground shadow-xs dark:bg-emerald-950/20">
                                {formData.subject ? (
                                    <p className="border-b border-emerald-500/10 pb-1 font-semibold text-foreground">
                                        {formData.subject}
                                    </p>
                                ) : null}
                                <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
                                    {formData.body
                                        .replace(/\{\{1\}\}/g, 'Mamadou Camara')
                                        .replace(
                                            /\{\{2\}\}/g,
                                            'votre site industriel',
                                        )
                                        .replace(
                                            /\{\{3\}\}/g,
                                            '+224 620 00 00 00',
                                        )}
                                </p>
                                {formData.footer_text ? (
                                    <p className="pt-1 text-[10px] text-muted-foreground/70">
                                        {formData.footer_text}
                                    </p>
                                ) : null}
                                <div className="flex items-center justify-end gap-1 pt-1 text-[10px] text-muted-foreground/60">
                                    <span>12:00</span>
                                    <CheckCheck
                                        className="size-3 text-emerald-500"
                                        aria-hidden
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="subject">
                            {uiText(
                                'ui.components.text_9b5ad0bd2a29',
                                'Objet de l&apos;e-mail',
                            )}
                        </Label>
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
                        <Label>
                            {uiText(
                                'ui.components.text_506447ec127c',
                                'Contenu du message',
                            )}
                        </Label>
                        <MarketingTemplateEditor
                            key={`${template?.uuid ?? 'new-template'}-${formData.channel}`}
                            initialContent={isEditing ? formData.body : ''}
                            fallbackPlainContent={
                                isEditing ? '' : formData.body
                            }
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
                    {isWhatsApp && !isEditing ? (
                        <>
                            <Send className="size-4" aria-hidden />
                            {uiText(
                                'ui.components.text_5aebf103f092',
                                'Créer et soumettre à Meta',
                            )}
                        </>
                    ) : (
                        submitLabel
                    )}
                </Button>
                <Button type="button" variant="outline" asChild>
                    <a href={cancelHref}>
                        {uiText('ui.components.text_46ad3916f6a0', 'Annuler')}
                    </a>
                </Button>
            </div>
        </form>
    );
}
