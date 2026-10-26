import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { Form } from '@inertiajs/react';
import { useState } from 'react';
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

type DriverOption = { value: string; label: string };

type AccountFormData = {
    name: string;
    from_address: string;
    from_name?: string | null;
    driver: string;
    smtp_host?: string | null;
    smtp_port?: number | null;
    smtp_encryption?: string | null;
    smtp_username?: string | null;
    daily_send_limit?: number | null;
    is_active: boolean;
    is_default: boolean;
    has_smtp_password?: boolean;
    sent_today?: number;
    remaining_today?: number | null;
};

type MarketingEmailAccountFormProps = {
    submitUrl: string;
    submitLabel: string;
    cancelHref: string;
    errors: Record<string, string>;
    drivers: DriverOption[];
    account?: AccountFormData;
    method?: 'post' | 'put';
};

export default function MarketingEmailAccountForm({
    submitUrl,
    submitLabel,
    cancelHref,
    errors,
    drivers,
    account,
    method = 'post',
}: MarketingEmailAccountFormProps) {
    const { t: uiText } = useUiTranslations();

    const isEditing = method === 'put';
    const [driver, setDriver] = useState(account?.driver ?? 'smtp');
    const [encryption, setEncryption] = useState(
        account?.smtp_encryption && account.smtp_encryption !== ''
            ? account.smtp_encryption
            : account
              ? 'none'
              : 'tls',
    );
    const [isActive, setIsActive] = useState(account?.is_active ?? true);
    const [isDefault, setIsDefault] = useState(account?.is_default ?? false);
    const isSmtp = driver === 'smtp';

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
                name="smtp_encryption"
                value={isSmtp ? (encryption === 'none' ? '' : encryption) : ''}
            />
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
                        'ui.components.text_1b232e62ee7b',
                        'Pourquoi plusieurs comptes e-mail ?',
                    )}
                </p>
                <p className="text-xs text-muted-foreground">
                    {uiText(
                        'ui.components.text_c96b0539d9c5',
                        'Certains fournisseurs limitent le volume d&apos;envois quotidiens. Configurez plusieurs boîtes SMTP et choisissez le compte adapté à chaque campagne.',
                    )}
                </p>
            </div>

            {isEditing && account?.daily_send_limit ? (
                <div className="space-y-1 rounded-lg border bg-muted/40 p-3 text-sm">
                    <p className="font-medium">
                        {uiText(
                            'ui.components.text_e4d54d477f38',
                            'Quota du jour',
                        )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {account.sent_today ?? 0} / {account.daily_send_limit}{' '}
                        {uiText('ui.components.text_9c8f6d343a48', 'envoyés —')}{' '}
                        {account.remaining_today ?? 0}{' '}
                        {uiText(
                            'ui.components.text_a34b06b6624e',
                            'restant(s).',
                        )}
                    </p>
                </div>
            ) : null}

            <div className="space-y-2">
                <Label htmlFor="name">
                    {uiText('ui.components.text_b2c124536d21', 'Nom')}
                </Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={account?.name ?? ''}
                    placeholder={uiText(
                        'ui.components.text_e2bcc7787440',
                        'Boîte marketing — principal',
                    )}
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="from_address">
                        {uiText(
                            'ui.components.text_e9e7742d9ac7',
                            'Adresse d&apos;expédition',
                        )}
                    </Label>
                    <Input
                        id="from_address"
                        name="from_address"
                        type="email"
                        defaultValue={account?.from_address ?? ''}
                        placeholder="marketing@exemple.com"
                        required
                    />
                    <InputError message={errors.from_address} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="from_name">
                        {uiText(
                            'ui.components.text_35085a907010',
                            'Nom d&apos;expéditeur',
                        )}
                    </Label>
                    <Input
                        id="from_name"
                        name="from_name"
                        defaultValue={account?.from_name ?? ''}
                        placeholder="Super Sécurité"
                    />
                    <InputError message={errors.from_name} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="driver">
                    {uiText('ui.components.text_9fe4c68ec20d', 'Driver')}
                </Label>
                <Select value={driver} onValueChange={setDriver}>
                    <SelectTrigger id="driver">
                        <SelectValue
                            placeholder={uiText(
                                'ui.components.text_9fe4c68ec20d',
                                'Driver',
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
                <InputError message={errors.driver} />
            </div>

            {isSmtp ? (
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="smtp_host">
                            {uiText(
                                'ui.components.text_ed415f3660e3',
                                'Serveur SMTP',
                            )}
                        </Label>
                        <Input
                            id="smtp_host"
                            name="smtp_host"
                            defaultValue={account?.smtp_host ?? ''}
                            placeholder="smtp.exemple.com"
                            required
                        />
                        <InputError message={errors.smtp_host} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="smtp_port">
                            {uiText('ui.components.text_72e9a59f5a1d', 'Port')}
                        </Label>
                        <Input
                            id="smtp_port"
                            name="smtp_port"
                            type="number"
                            defaultValue={account?.smtp_port ?? 587}
                            required
                        />
                        <InputError message={errors.smtp_port} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="smtp_encryption">
                            {uiText(
                                'ui.components.text_a07eab97d8f3',
                                'Chiffrement',
                            )}
                        </Label>
                        <Select
                            value={encryption}
                            onValueChange={setEncryption}
                        >
                            <SelectTrigger id="smtp_encryption">
                                <SelectValue
                                    placeholder={uiText(
                                        'ui.components.text_a07eab97d8f3',
                                        'Chiffrement',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tls">TLS</SelectItem>
                                <SelectItem value="ssl">SSL</SelectItem>
                                <SelectItem value="none">
                                    {uiText(
                                        'ui.components.text_4679b3b12de0',
                                        'Aucun',
                                    )}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.smtp_encryption} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="smtp_username">
                            {uiText(
                                'ui.components.text_c202d9eedad8',
                                'Identifiant SMTP',
                            )}
                        </Label>
                        <Input
                            id="smtp_username"
                            name="smtp_username"
                            defaultValue={account?.smtp_username ?? ''}
                            autoComplete="off"
                        />
                        <InputError message={errors.smtp_username} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="smtp_password">
                            {uiText(
                                'ui.components.text_6692a93055ff',
                                'Mot de passe SMTP',
                            )}
                        </Label>
                        <Input
                            id="smtp_password"
                            name="smtp_password"
                            type="password"
                            placeholder={
                                account?.has_smtp_password
                                    ? uiText(
                                          'ui.components.text_ff97ad7392f5',
                                          'Laisser vide pour conserver',
                                      )
                                    : undefined
                            }
                            autoComplete="new-password"
                            required={!isEditing}
                        />
                        <InputError message={errors.smtp_password} />
                    </div>
                </div>
            ) : null}

            <div className="space-y-2">
                <Label htmlFor="daily_send_limit">
                    {uiText(
                        'ui.components.text_9db1b80f3a4f',
                        'Limite d&apos;envois / jour',
                    )}
                </Label>
                <Input
                    id="daily_send_limit"
                    name="daily_send_limit"
                    type="number"
                    min={1}
                    defaultValue={account?.daily_send_limit ?? ''}
                    placeholder={uiText(
                        'ui.components.text_b42798a0832a',
                        'Illimité si vide',
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {uiText(
                        'ui.components.text_62e44b82e229',
                        'Ex. 300 pour un hébergeur qui coupe après ce volume. Laissez vide pour illimité.',
                    )}
                </p>
                <InputError message={errors.daily_send_limit} />
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

            <div className="flex flex-wrap gap-2">
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
