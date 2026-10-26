import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { router } from '@inertiajs/react';
import {
    AlertCircle,
    Check,
    CheckCheck,
    CloudDownload,
    Loader2,
    MessageSquare,
    RefreshCw,
    Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { metaFetch, metaImport } from '@/routes/marketing-templates';

type WhatsAppAccountOption = {
    id: number;
    uuid: string;
    name: string;
    is_default: boolean;
};

type MetaTemplateItem = {
    id: string;
    name: string;
    language: string;
    status: string;
    category: string;
    body_text: string;
    header_text: string | null;
    footer_text: string | null;
};

type ImportMetaTemplatesDialogProps = {
    accounts: WhatsAppAccountOption[];
    triggerVariant?: 'default' | 'outline' | 'secondary';
    triggerSize?: 'default' | 'sm' | 'lg';
};

function humanizeTemplateName(name: string): string {
    return name
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusBadgeVariant(
    status: string,
): 'default' | 'secondary' | 'outline' | 'destructive' {
    switch (status.toUpperCase()) {
        case 'APPROVED':
            return 'default';
        case 'REJECTED':
            return 'destructive';
        case 'PENDING':
        case 'PAUSED':
            return 'secondary';
        default:
            return 'outline';
    }
}

export default function ImportMetaTemplatesDialog({
    accounts,
    triggerVariant = 'outline',
    triggerSize = 'default',
}: ImportMetaTemplatesDialogProps) {
    const { t: uiText } = useUiTranslations();

    const [open, setOpen] = useState(false);
    const [selectedAccountUuid, setSelectedAccountUuid] = useState<string>(
        accounts.find((a) => a.is_default)?.uuid ?? accounts[0]?.uuid ?? '',
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [metaTemplates, setMetaTemplates] = useState<MetaTemplateItem[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [customTitles, setCustomTitles] = useState<Record<string, string>>(
        {},
    );
    const [submitting, setSubmitting] = useState(false);

    const loadMetaTemplates = async (accountUuid: string) => {
        if (!accountUuid) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const url = `${metaFetch.url()}?account_uuid=${encodeURIComponent(accountUuid)}`;
            const response = await fetch(url, {
                headers: { Accept: 'application/json' },
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || 'Impossible de récupérer les modèles Meta.',
                );
            }

            const templates: MetaTemplateItem[] = data.templates ?? [];
            setMetaTemplates(templates);

            // Auto-select approved templates
            const approved = new Set<string>();
            const titles: Record<string, string> = {};

            templates.forEach((tpl) => {
                const key = `${tpl.name}:${tpl.language}`;
                titles[key] = humanizeTemplateName(tpl.name);
                if (tpl.status.toUpperCase() === 'APPROVED') {
                    approved.add(key);
                }
            });

            setSelectedKeys(approved);
            setCustomTitles(titles);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Erreur lors de la récupération.',
            );
            setMetaTemplates([]);
            setSelectedKeys(new Set());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && selectedAccountUuid && metaTemplates.length === 0) {
            loadMetaTemplates(selectedAccountUuid);
        }
    }, [open, selectedAccountUuid]);

    const handleAccountChange = (uuid: string) => {
        setSelectedAccountUuid(uuid);
        loadMetaTemplates(uuid);
    };

    const toggleSelect = (key: string) => {
        setSelectedKeys((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedKeys.size === metaTemplates.length) {
            setSelectedKeys(new Set());
        } else {
            const allKeys = new Set(
                metaTemplates.map((t) => `${t.name}:${t.language}`),
            );
            setSelectedKeys(allKeys);
        }
    };

    const handleImport = () => {
        if (selectedKeys.size === 0) {
            return;
        }

        const templatesToImport = metaTemplates
            .filter((t) => selectedKeys.has(`${t.name}:${t.language}`))
            .map((t) => {
                const key = `${t.name}:${t.language}`;
                return {
                    name: t.name,
                    language: t.language,
                    title: customTitles[key] || humanizeTemplateName(t.name),
                    body_text: t.body_text,
                    header_text: t.header_text,
                };
            });

        setSubmitting(true);

        router.post(
            metaImport.url(),
            { templates: templatesToImport },
            {
                preserveScroll: true,
                onFinish: () => {
                    setSubmitting(false);
                    setOpen(false);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={triggerVariant} size={triggerSize}>
                    <CloudDownload className="size-4" aria-hidden />
                    {uiText(
                        'ui.components.text_2f740b5cd80b',
                        'Importer depuis Meta',
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="size-5 text-emerald-500" />
                        {uiText(
                            'ui.components.text_d90cf3846ae1',
                            'Importer les modèles WhatsApp du compte Meta',
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {uiText(
                            'ui.components.text_a8734e6311f9',
                            'Récupérez et synchronisez les modèles approuvés directement depuis votre compte WhatsApp Business Cloud API.',
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 space-y-4 overflow-y-auto py-2">
                    {/* Account selector & refresh */}
                    <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-muted/20 p-3">
                        <div className="min-w-[200px] flex-1 space-y-1.5">
                            <Label
                                htmlFor="whatsapp-account-select"
                                className="text-xs"
                            >
                                {uiText(
                                    'ui.components.text_166413ecc51b',
                                    'Compte WhatsApp Business',
                                )}
                            </Label>
                            {accounts.length > 1 ? (
                                <Select
                                    value={selectedAccountUuid}
                                    onValueChange={handleAccountChange}
                                >
                                    <SelectTrigger id="whatsapp-account-select">
                                        <SelectValue
                                            placeholder={uiText(
                                                'ui.components.text_b5eb217f2610',
                                                'Choisir un compte',
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accounts.map((acc) => (
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
                            ) : (
                                <p className="text-sm font-medium">
                                    {accounts[0]?.name ?? 'Compte par défaut'}
                                </p>
                            )}
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                loadMetaTemplates(selectedAccountUuid)
                            }
                            disabled={loading}
                        >
                            <RefreshCw
                                className={`size-3.5 ${loading ? 'animate-spin' : ''}`}
                            />
                            {uiText(
                                'ui.components.text_d7d646faaecb',
                                'Actualiser',
                            )}
                        </Button>
                    </div>

                    {/* Error message */}
                    {error ? (
                        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                            <AlertCircle className="mt-0.5 size-4 shrink-0" />
                            <div>
                                <p className="font-medium">
                                    {uiText(
                                        'ui.components.text_14164a4d4d85',
                                        'Erreur lors de la récupération Meta',
                                    )}
                                </p>
                                <p className="mt-0.5 text-xs">{error}</p>
                            </div>
                        </div>
                    ) : null}

                    {/* Loading state */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <Loader2 className="mb-3 size-8 animate-spin text-primary" />
                            <p className="text-sm font-medium">
                                {uiText(
                                    'ui.components.text_a458a71599de',
                                    'Interrogation de l’API Meta Cloud…',
                                )}
                            </p>
                            <p className="text-xs">
                                {uiText(
                                    'ui.components.text_5e12ee2e1cf0',
                                    'Récupération des modèles de messages enregistrés',
                                )}
                            </p>
                        </div>
                    ) : null}

                    {/* Templates list */}
                    {!loading && !error && metaTemplates.length > 0 ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1 text-xs">
                                <span className="font-medium text-muted-foreground">
                                    {metaTemplates.length}{' '}
                                    {uiText(
                                        'ui.components.text_dc514cef391a',
                                        'modèle(s) trouvé(s) sur Meta',
                                    )}
                                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleSelectAll}
                                    className="h-6 text-xs"
                                >
                                    {selectedKeys.size === metaTemplates.length
                                        ? uiText(
                                              'ui.components.text_dfbf8a80272c',
                                              'Tout désélectionner',
                                          )
                                        : uiText(
                                              'ui.components.text_5b6fef95fb92',
                                              'Tout sélectionner',
                                          )}
                                </Button>
                            </div>

                            <div className="max-h-[380px] space-y-3 overflow-y-auto pr-1">
                                {metaTemplates.map((tpl) => {
                                    const key = `${tpl.name}:${tpl.language}`;
                                    const isSelected = selectedKeys.has(key);

                                    return (
                                        <div
                                            key={key}
                                            className={`rounded-xl border p-4 transition-all ${
                                                isSelected
                                                    ? 'border-primary/50 bg-primary/5 shadow-xs'
                                                    : 'border-border/60 bg-card hover:bg-muted/30'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <Checkbox
                                                    id={`check-${key}`}
                                                    checked={isSelected}
                                                    onCheckedChange={() =>
                                                        toggleSelect(key)
                                                    }
                                                    className="mt-1"
                                                />
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <label
                                                            htmlFor={`check-${key}`}
                                                            className="flex cursor-pointer items-center gap-2 text-sm font-semibold transition-colors hover:text-primary"
                                                        >
                                                            <span>
                                                                {tpl.name}
                                                            </span>
                                                        </label>
                                                        <div className="flex items-center gap-1.5">
                                                            <Badge
                                                                variant={statusBadgeVariant(
                                                                    tpl.status,
                                                                )}
                                                                className="text-[10px] uppercase"
                                                            >
                                                                {tpl.status}
                                                            </Badge>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-[10px]"
                                                            >
                                                                {tpl.language.toUpperCase()}
                                                            </Badge>
                                                            {tpl.category ? (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-[10px]"
                                                                >
                                                                    {
                                                                        tpl.category
                                                                    }
                                                                </Badge>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    {/* Custom title input if selected */}
                                                    {isSelected ? (
                                                        <div className="space-y-1">
                                                            <Label
                                                                htmlFor={`title-${key}`}
                                                                className="text-[11px] text-muted-foreground"
                                                            >
                                                                {uiText(
                                                                    'ui.components.text_e9e754fc7651',
                                                                    'Titre interne dans Super Sécurité',
                                                                )}
                                                            </Label>
                                                            <Input
                                                                id={`title-${key}`}
                                                                value={
                                                                    customTitles[
                                                                        key
                                                                    ] ??
                                                                    humanizeTemplateName(
                                                                        tpl.name,
                                                                    )
                                                                }
                                                                onChange={(e) =>
                                                                    setCustomTitles(
                                                                        (
                                                                            prev,
                                                                        ) => ({
                                                                            ...prev,
                                                                            [key]: e
                                                                                .target
                                                                                .value,
                                                                        }),
                                                                    )
                                                                }
                                                                placeholder={uiText(
                                                                    'ui.components.text_890b6603fa70',
                                                                    'Titre pour vos campagnes',
                                                                )}
                                                                className="h-8 bg-background text-xs"
                                                            />
                                                        </div>
                                                    ) : null}

                                                    {/* WhatsApp Message Preview Bubble */}
                                                    <div className="space-y-1 rounded-lg border border-emerald-500/20 bg-emerald-50/50 p-3 text-xs text-foreground dark:bg-emerald-950/20">
                                                        {tpl.header_text ? (
                                                            <p className="border-b border-emerald-500/10 pb-1 font-semibold text-foreground/90">
                                                                {
                                                                    tpl.header_text
                                                                }
                                                            </p>
                                                        ) : null}
                                                        <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
                                                            {tpl.body_text ||
                                                                'Aucun texte de corps.'}
                                                        </p>
                                                        {tpl.footer_text ? (
                                                            <p className="pt-1 text-[10px] text-muted-foreground/70">
                                                                {
                                                                    tpl.footer_text
                                                                }
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : null}

                    {!loading && !error && metaTemplates.length === 0 ? (
                        <div className="py-10 text-center text-muted-foreground">
                            <MessageSquare className="mx-auto mb-2 size-8 opacity-40" />
                            <p className="text-sm font-medium">
                                {uiText(
                                    'ui.components.text_55198ef7fcc2',
                                    'Aucun modèle de message trouvé sur ce compte Meta.',
                                )}
                            </p>
                            <p className="mt-1 text-xs">
                                {uiText(
                                    'ui.components.text_ba72063a4a92',
                                    'Créez et faites approuver vos modèles dans Meta Business Manager avant de les importer.',
                                )}
                            </p>
                        </div>
                    ) : null}
                </div>

                <DialogFooter className="gap-2 border-t pt-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={submitting}
                    >
                        {uiText('ui.components.text_711e5f2e198d', 'Fermer')}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleImport}
                        disabled={submitting || selectedKeys.size === 0}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                {uiText(
                                    'ui.components.text_8721536fbf9d',
                                    'Importation en cours…',
                                )}
                            </>
                        ) : (
                            <>
                                <Check className="size-4" />
                                {uiText(
                                    'ui.components.text_ed2c9cb3830e',
                                    'Importer',
                                )}{' '}
                                {selectedKeys.size > 0
                                    ? `(${selectedKeys.size})`
                                    : ''}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
