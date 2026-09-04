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

function resolveInitialBody(template?: MarketingMessageTemplateFormData, channel?: string): string {
    if (template?.body?.trim()) {
        return template.body;
    }

    if (channel === 'whatsapp') {
        return 'Bonjour {{1}}, nous vous confirmons votre demande pour {{2}}. Notre équipe reste disponible au {{3}}.';
    }

    return DEFAULT_MARKETING_TEMPLATE_BODY;
}

function resolveInitialSubject(template?: MarketingMessageTemplateFormData): string {
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
    const isEditing = method === 'put';
    const initialChannel = template?.channel ?? lockedChannel ?? 'email';
    const [formData, setFormData] = useState({
        account_uuid: whatsappAccounts.find((a) => a.is_default)?.uuid ?? whatsappAccounts[0]?.uuid ?? '',
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
        if (isWhatsApp && (!formData.meta_template_name || formData.meta_template_name === formatTechnicalName(formData.name))) {
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
                account_uuid: isWhatsApp ? formData.account_uuid || undefined : undefined,
                name: formData.name,
                channel: formData.channel,
                category: isWhatsApp ? formData.category : undefined,
                subject: isWhatsApp ? (formData.subject?.trim() || null) : formData.subject,
                body: formData.body,
                footer_text: isWhatsApp ? (formData.footer_text?.trim() || null) : undefined,
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
                    onChange={(event) => handleNameChange(event.target.value)}
                    placeholder={isWhatsApp ? 'Alerte Gardiennage 2026' : 'Relance prospect Q1'}
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="channel">Canal</Label>
                {channelLocked ? (
                    <div className="bg-muted/40 rounded-lg border px-3 py-2 text-sm">
                        Canal :{' '}
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
                            Meta Cloud API
                        </Badge>
                    </div>

                    {whatsappAccounts.length > 1 && !isEditing ? (
                        <div className="space-y-2">
                            <Label htmlFor="account_uuid">Compte WhatsApp Business</Label>
                            <Select
                                value={formData.account_uuid}
                                onValueChange={(value) => updateField('account_uuid', value)}
                            >
                                <SelectTrigger id="account_uuid">
                                    <SelectValue placeholder="Sélectionnez un compte" />
                                </SelectTrigger>
                                <SelectContent>
                                    {whatsappAccounts.map((acc) => (
                                        <SelectItem key={acc.uuid} value={acc.uuid}>
                                            {acc.name} {acc.is_default ? '(Par défaut)' : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.account_uuid} />
                        </div>
                    ) : null}

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="meta_template_name">Nom technique Meta</Label>
                            <Input
                                id="meta_template_name"
                                value={formData.meta_template_name}
                                onChange={(event) =>
                                    updateField('meta_template_name', formatTechnicalName(event.target.value))
                                }
                                placeholder="notification_securite"
                                required
                            />
                            <p className="text-muted-foreground text-xs">
                                Minuscules, chiffres et tirets du bas uniquement.
                            </p>
                            <InputError message={errors.meta_template_name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="meta_category">Catégorie Meta</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val) => updateField('category', val)}
                            >
                                <SelectTrigger id="meta_category">
                                    <SelectValue placeholder="Catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MARKETING">Marketing (Promotions, offres)</SelectItem>
                                    <SelectItem value="UTILITY">Utilitaire (Confirmations, alertes)</SelectItem>
                                    <SelectItem value="AUTHENTICATION">Authentification (OTP)</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category} />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
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

                        <div className="space-y-2">
                            <Label htmlFor="subject">En-tête du message (optionnel, max 60 car.)</Label>
                            <Input
                                id="subject"
                                maxLength={60}
                                value={formData.subject ?? ''}
                                onChange={(event) => updateField('subject', event.target.value)}
                                placeholder="Super Sécurité — Information"
                            />
                            <InputError message={errors.subject} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="body">Texte du modèle & Variables positionnelles (max 1024 car.)</Label>
                            <span className="text-[11px] text-muted-foreground">
                                {formData.body.length}/1024
                            </span>
                        </div>
                        <textarea
                            id="body"
                            rows={4}
                            maxLength={1024}
                            value={formData.body}
                            onChange={(event) => updateField('body', event.target.value)}
                            placeholder="Bonjour {{1}}, nous vous confirmons votre devis pour l'entreprise {{2}}..."
                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono text-xs"
                            required
                        />
                        <p className="text-muted-foreground text-xs">
                            Indiquez le texte du modèle Meta avec les variables positionnelles <code className="text-primary font-bold">{'{{1}}'}</code>, <code className="text-primary font-bold">{'{{2}}'}</code>, <code className="text-primary font-bold">{'{{3}}'}</code> pour injecter automatiquement le nom du client, l'entreprise, le téléphone, etc.
                        </p>
                        <InputError message={errors.body} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="footer_text">Pied de page (optionnel, max 60 car.)</Label>
                        <Input
                            id="footer_text"
                            maxLength={60}
                            value={formData.footer_text}
                            onChange={(event) => updateField('footer_text', event.target.value)}
                            placeholder="Super Sécurité SARL"
                        />
                        <InputError message={errors.footer_text} />
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
                                        .replace(/\{\{2\}\}/g, 'votre site industriel')
                                        .replace(/\{\{3\}\}/g, '+224 620 00 00 00')}
                                </p>
                                {formData.footer_text ? (
                                    <p className="text-[10px] text-muted-foreground/70 pt-1">
                                        {formData.footer_text}
                                    </p>
                                ) : null}
                                <div className="text-[10px] text-muted-foreground/60 flex items-center justify-end gap-1 pt-1">
                                    <span>12:00</span>
                                    <CheckCheck className="size-3 text-emerald-500" aria-hidden />
                                </div>
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
                    {isWhatsApp && !isEditing ? (
                        <>
                            <Send className="size-4" aria-hidden />
                            Créer et soumettre à Meta
                        </>
                    ) : (
                        submitLabel
                    )}
                </Button>
                <Button type="button" variant="outline" asChild>
                    <a href={cancelHref}>Annuler</a>
                </Button>
            </div>
        </form>
    );
}
