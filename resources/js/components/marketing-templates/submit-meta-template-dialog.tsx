import { router } from '@inertiajs/react';
import {
    AlertCircle,
    Info,
    Loader2,
    MessageSquarePlus,
    Send,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { metaSubmit } from '@/routes/marketing-templates';

type WhatsAppAccountOption = {
    id: number;
    uuid: string;
    name: string;
    is_default: boolean;
};

type SubmitMetaTemplateDialogProps = {
    accounts: WhatsAppAccountOption[];
    triggerVariant?: 'default' | 'outline' | 'secondary';
    triggerSize?: 'default' | 'sm' | 'lg';
};

function formatTechnicalName(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/_+/g, '_');
}

export default function SubmitMetaTemplateDialog({
    accounts,
    triggerVariant = 'default',
    triggerSize = 'default',
}: SubmitMetaTemplateDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedAccountUuid, setSelectedAccountUuid] = useState<string>(
        accounts.find((a) => a.is_default)?.uuid ?? accounts[0]?.uuid ?? '',
    );
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<'MARKETING' | 'UTILITY' | 'AUTHENTICATION'>('MARKETING');
    const [language, setLanguage] = useState('fr');
    const [headerText, setHeaderText] = useState('');
    const [bodyText, setBodyText] = useState(
        'Bonjour {{1}}, nous vous confirmons votre demande pour {{2}}. Notre équipe reste disponible au {{3}}.',
    );
    const [footerText, setFooterText] = useState('Super Sécurité SARL');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleNameChange = (value: string) => {
        const formatted = formatTechnicalName(value);
        setName(formatted);
        if (!title || title === formatTechnicalName(name)) {
            setTitle(
                formatted
                    .replace(/[_-]/g, ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase()),
            );
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post(
            metaSubmit.url(),
            {
                account_uuid: selectedAccountUuid || undefined,
                name,
                title: title || undefined,
                category,
                language,
                header_text: headerText.trim() || undefined,
                body_text: bodyText.trim(),
                footer_text: footerText.trim() || undefined,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpen(false);
                    setName('');
                    setTitle('');
                },
                onError: (errs) => {
                    setErrors(errs);
                },
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={triggerVariant} size={triggerSize}>
                    <MessageSquarePlus className="size-4" aria-hidden />
                    Soumettre à Meta
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="size-5 text-emerald-500" />
                        Créer & soumettre un modèle à Meta WhatsApp
                    </DialogTitle>
                    <DialogDescription>
                        Ce formulaire enregistre et transmet directement votre modèle de message à Meta Cloud API pour approbation.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2 flex-1 overflow-y-auto pr-1">
                    {/* Account selection */}
                    {accounts.length > 1 ? (
                        <div className="space-y-1.5 rounded-lg border bg-muted/20 p-3">
                            <Label htmlFor="submit-account-select" className="text-xs">
                                Compte WhatsApp Business émetteur
                            </Label>
                            <Select value={selectedAccountUuid} onValueChange={setSelectedAccountUuid}>
                                <SelectTrigger id="submit-account-select">
                                    <SelectValue placeholder="Sélectionnez un compte" />
                                </SelectTrigger>
                                <SelectContent>
                                    {accounts.map((acc) => (
                                        <SelectItem key={acc.uuid} value={acc.uuid}>
                                            {acc.name} {acc.is_default ? '(Par défaut)' : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.account_uuid} />
                        </div>
                    ) : null}

                    {/* Name & Title */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="meta-name" className="text-xs">
                                Nom technique Meta <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="meta-name"
                                value={name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="promo_gardiennage_2026"
                                required
                            />
                            <p className="text-[11px] text-muted-foreground">
                                Minuscules, chiffres et tirets du bas uniquement.
                            </p>
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="meta-title" className="text-xs">
                                Titre interne dans Super Sécurité
                            </Label>
                            <Input
                                id="meta-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Promotion Gardiennage 2026"
                            />
                            <InputError message={errors.title} />
                        </div>
                    </div>

                    {/* Category & Language */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="meta-category" className="text-xs">
                                Catégorie Meta <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={category}
                                onValueChange={(val) =>
                                    setCategory(val as 'MARKETING' | 'UTILITY' | 'AUTHENTICATION')
                                }
                            >
                                <SelectTrigger id="meta-category">
                                    <SelectValue placeholder="Catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MARKETING">Marketing (Offres, alertes commerciales)</SelectItem>
                                    <SelectItem value="UTILITY">Utilitaire (Confirmations, factures, comptes)</SelectItem>
                                    <SelectItem value="AUTHENTICATION">Authentification (Codes OTP)</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="meta-language" className="text-xs">
                                Code langue <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="meta-language"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                placeholder="fr"
                                required
                            />
                            <p className="text-[11px] text-muted-foreground">
                                Ex : <code>fr</code> (Français), <code>en_US</code> (Anglais).
                            </p>
                            <InputError message={errors.language} />
                        </div>
                    </div>

                    {/* Header (optional) */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="meta-header" className="text-xs">
                                En-tête texte (optionnel)
                            </Label>
                            <span className="text-[11px] text-muted-foreground">
                                {headerText.length}/60
                            </span>
                        </div>
                        <Input
                            id="meta-header"
                            maxLength={60}
                            value={headerText}
                            onChange={(e) => setHeaderText(e.target.value)}
                            placeholder="Super Sécurité — Information"
                        />
                        <InputError message={errors.header_text} />
                    </div>

                    {/* Body text (required) */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="meta-body" className="text-xs">
                                Corps du message <span className="text-destructive">*</span>
                            </Label>
                            <span className="text-[11px] text-muted-foreground">
                                {bodyText.length}/1024
                            </span>
                        </div>
                        <textarea
                            id="meta-body"
                            rows={4}
                            maxLength={1024}
                            value={bodyText}
                            onChange={(e) => setBodyText(e.target.value)}
                            placeholder="Bonjour {{1}}, nous vous confirmons..."
                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs font-mono shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        />
                        <p className="text-[11px] text-muted-foreground">
                            Utilisez les variables positionnelles <code className="text-primary font-bold">{'{{1}}'}</code>, <code className="text-primary font-bold">{'{{2}}'}</code>, <code className="text-primary font-bold">{'{{3}}'}</code> qui seront injectées avec les données des contacts lors de l'envoi.
                        </p>
                        <InputError message={errors.body_text} />
                    </div>

                    {/* Footer (optional) */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="meta-footer" className="text-xs">
                                Pied de page (optionnel)
                            </Label>
                            <span className="text-[11px] text-muted-foreground">
                                {footerText.length}/60
                            </span>
                        </div>
                        <Input
                            id="meta-footer"
                            maxLength={60}
                            value={footerText}
                            onChange={(e) => setFooterText(e.target.value)}
                            placeholder="Super Sécurité SARL"
                        />
                        <InputError message={errors.footer_text} />
                    </div>

                    {/* Preview Bubble */}
                    <div className="space-y-1.5 pt-2 border-t">
                        <Label className="text-xs text-muted-foreground">Aperçu en direct (WhatsApp)</Label>
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 space-y-1.5 text-xs text-foreground shadow-xs max-w-md">
                            {headerText ? (
                                <p className="font-semibold text-foreground border-b border-emerald-500/10 pb-1">
                                    {headerText}
                                </p>
                            ) : null}
                            <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                                {bodyText
                                    .replace(/\{\{1\}\}/g, 'Mamadou Camara')
                                    .replace(/\{\{2\}\}/g, 'votre site industriel')
                                    .replace(/\{\{3\}\}/g, '+224 620 00 00 00') || 'Texte du message'}
                            </p>
                            {footerText ? (
                                <p className="text-[10px] text-muted-foreground/70 pt-1">
                                    {footerText}
                                </p>
                            ) : null}
                            <p className="text-[10px] text-muted-foreground/50 text-right pt-0.5">
                                12:00 ✓✓
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 border-t pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={processing}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={processing || !name || !bodyText}>
                            {processing ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Soumission en cours…
                                </>
                            ) : (
                                <>
                                    <Send className="size-4" />
                                    Soumettre à Meta
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
