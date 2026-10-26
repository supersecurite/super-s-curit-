import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

type DriverOption = { value: string; label: string };

type AccountFormData = {
    name: string;
    phone_number_id: string;
    business_account_id?: string | null;
    verify_token: string;
    driver: string;
    is_active: boolean;
    is_default: boolean;
    has_access_token?: boolean;
    has_app_secret?: boolean;
    webhook_url?: string;
};

type WhatsAppAccountFormProps = {
    submitUrl: string;
    submitLabel: string;
    cancelHref: string;
    errors: Record<string, string>;
    drivers: DriverOption[];
    account?: AccountFormData;
    method?: 'post' | 'put';
};

export default function WhatsAppAccountForm({
    submitUrl,
    submitLabel,
    cancelHref,
    errors,
    drivers,
    account,
    method = 'post',
}: WhatsAppAccountFormProps) {
    const { t: uiText } = useUiTranslations();

    const isEditing = method === 'put';
    const [driver, setDriver] = useState(account?.driver ?? 'meta');
    const [isActive, setIsActive] = useState(account?.is_active ?? true);
    const [isDefault, setIsDefault] = useState(account?.is_default ?? false);

    return (
        <Form
            action={submitUrl}
            method="post"
            className="space-y-6 rounded-xl border bg-card p-6"
        >
            {isEditing ? (
                <input type="hidden" name="_method" value="put" />
            ) : null}
            <input type="hidden" name="driver" value={driver} />
            <input
                type="hidden"
                name="is_active"
                value={isActive ? '1' : '0'}
            />
            <input
                type="hidden"
                name="is_default"
                value={isDefault ? '1' : '0'}
            />

            <div className="space-y-2 rounded-lg border bg-muted/40 p-3 text-sm">
                <p className="font-medium">
                    {uiText(
                        'ui.components.text_61c3a58837a2',
                        'Où trouver les identifiants Meta ?',
                    )}
                </p>
                <p className="text-xs text-muted-foreground">
                    {uiText(
                        'ui.components.text_2247c3d7d88b',
                        'Console développeur :',
                    )}{' '}
                    <a
                        href="https://developers.facebook.com/apps"
                        target="_blank"
                        rel="noreferrer"
                        className="text-foreground underline underline-offset-2"
                    >
                        developers.facebook.com/apps
                    </a>{' '}
                    {uiText(
                        'ui.components.text_d9144ec85fbc',
                        '→ votre application → WhatsApp. Les chemins ci-dessous correspondent à l’interface Meta (libellés parfois en anglais).',
                    )}
                </p>
            </div>

            {account?.webhook_url ? (
                <div className="space-y-1 rounded-lg border bg-muted/40 p-3 text-sm">
                    <p className="font-medium">
                        {uiText(
                            'ui.components.text_a01e180b6acd',
                            'URL webhook Meta',
                        )}
                    </p>
                    <code className="text-xs break-all">
                        {account.webhook_url}
                    </code>
                    <p className="text-xs text-muted-foreground">
                        {uiText(
                            'ui.components.text_0b2cc56fbfa2',
                            'À coller dans Meta : WhatsApp → Configuration → Webhook → URL de rappel, avec le même verify token que ci-dessous.',
                        )}
                    </p>
                </div>
            ) : (
                <p className="text-xs text-muted-foreground">
                    {uiText(
                        'ui.components.text_c4cf74dcb730',
                        'Après création, l’URL webhook à coller dans Meta s’affichera sur cette fiche.',
                    )}
                </p>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">
                    {uiText('ui.components.text_b2c124536d21', 'Nom')}
                </Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={account?.name ?? ''}
                    placeholder="Super Sécurité — principal"
                    required
                />
                <p className="text-xs text-muted-foreground">
                    {uiText(
                        'ui.components.text_6d878657d963',
                        'Libellé interne backoffice uniquement (ex. « Super Sécurité — principal »).',
                    )}
                </p>
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="phone_number_id">
                        {uiText(
                            'ui.components.text_26838bfc20db',
                            'Phone Number ID',
                        )}
                    </Label>
                    <Input
                        id="phone_number_id"
                        name="phone_number_id"
                        defaultValue={account?.phone_number_id ?? ''}
                        required
                    />
                    <p className="text-xs text-muted-foreground">
                        {uiText(
                            'ui.components.text_0ce9e61d44f4',
                            'WhatsApp → Configuration de l’API (API Setup) → Identifiant du numéro de téléphone (Phone number ID).',
                        )}
                    </p>
                    <InputError message={errors.phone_number_id} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="business_account_id">
                        {uiText(
                            'ui.components.text_26082b8b0617',
                            'Business Account ID',
                        )}
                    </Label>
                    <Input
                        id="business_account_id"
                        name="business_account_id"
                        defaultValue={account?.business_account_id ?? ''}
                    />
                    <p className="text-xs text-muted-foreground">
                        {uiText(
                            'ui.components.text_9c30826921ac',
                            'Optionnel — même écran API Setup → WhatsApp Business Account ID (WABA), ou Meta Business Suite → Paramètres.',
                        )}
                    </p>
                    <InputError message={errors.business_account_id} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="access_token">
                    {uiText('ui.components.text_9a911b08feb9', 'Access token')}{' '}
                    {isEditing && account?.has_access_token
                        ? uiText(
                              'ui.components.text_d8724981479b',
                              ' (laisser vide pour conserver)',
                          )
                        : ''}
                </Label>
                <Input
                    id="access_token"
                    name="access_token"
                    type="password"
                    autoComplete="new-password"
                    required={!isEditing}
                    placeholder={isEditing ? '••••••••' : undefined}
                />
                <p className="text-xs text-muted-foreground">
                    {uiText(
                        'ui.components.text_fcfae76e9b1d',
                        'WhatsApp → API Setup → Jeton d’accès temporaire pour les tests, ou jeton permanent d’un utilisateur système (Business Manager → Utilisateurs système → Générer un jeton) en production.',
                    )}
                </p>
                <InputError message={errors.access_token} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="app_secret">
                    {uiText('ui.components.text_1cdbce289333', 'App secret')}{' '}
                    {isEditing && account?.has_app_secret
                        ? uiText(
                              'ui.components.text_d8724981479b',
                              ' (laisser vide pour conserver)',
                          )
                        : ''}
                </Label>
                <Input
                    id="app_secret"
                    name="app_secret"
                    type="password"
                    autoComplete="new-password"
                    required={!isEditing}
                    placeholder={isEditing ? '••••••••' : undefined}
                />
                <p className="text-xs text-muted-foreground">
                    {uiText(
                        'ui.components.text_608102bf39d8',
                        'Paramètres de l’application → Informations de base (Settings → Basic) → Clé secrète de l’application (App secret). Sert à vérifier la signature des webhooks.',
                    )}
                </p>
                <InputError message={errors.app_secret} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="verify_token">
                    {uiText(
                        'ui.components.text_57422fe975db',
                        'Verify token (webhook)',
                    )}
                </Label>
                <Input
                    id="verify_token"
                    name="verify_token"
                    defaultValue={account?.verify_token ?? ''}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    {uiText(
                        'ui.components.text_44bb3a9a2d1a',
                        'Chaîne libre que vous inventez (ex. un mot de passe aléatoire). Vous la saisissez ici et la recopiez à l’identique dans Meta lors de la configuration du webhook (Verify token).',
                    )}
                </p>
                <InputError message={errors.verify_token} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="driver">
                    {uiText('ui.components.text_9fe4c68ec20d', 'Driver')}
                </Label>
                <Select value={driver} onValueChange={setDriver}>
                    <SelectTrigger id="driver">
                        <SelectValue
                            placeholder={uiText(
                                'ui.components.text_5583c5eb7559',
                                'Choisir un driver',
                            )}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {drivers.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                    {uiText(
                        'ui.components.text_b2530ae3438c',
                        '« Meta Cloud API » envoie réellement via Graph API. « Log (démo locale) » enregistre l’envoi sans appeler Meta (tests / démo).',
                    )}
                </p>
                <InputError message={errors.driver} />
            </div>

            <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                        checked={isActive}
                        onCheckedChange={(checked) =>
                            setIsActive(checked === true)
                        }
                    />
                    {uiText('ui.components.text_3cf87c303b42', 'Compte actif')}
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                        checked={isDefault}
                        onCheckedChange={(checked) =>
                            setIsDefault(checked === true)
                        }
                    />
                    {uiText(
                        'ui.components.text_e56ff1b0c5cd',
                        'Compte par défaut',
                    )}
                </label>
            </div>

            <div className="flex flex-wrap gap-3">
                <Button type="submit">{submitLabel}</Button>
                <Button type="button" variant="outline" asChild>
                    <a href={cancelHref}>
                        {uiText('ui.components.text_46ad3916f6a0', 'Annuler')}
                    </a>
                </Button>
            </div>
        </Form>
    );
}
