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
            {isEditing ? <input type="hidden" name="_method" value="put" /> : null}
            <input type="hidden" name="driver" value={driver} />
            <input type="hidden" name="smtp_encryption" value={isSmtp ? (encryption === 'none' ? '' : encryption) : ''} />
            <input type="hidden" name="is_active" value={isActive ? '1' : '0'} />
            <input type="hidden" name="is_default" value={isDefault ? '1' : '0'} />

            <div className="bg-muted/40 space-y-2 rounded-lg border p-3 text-sm">
                <p className="font-medium">Pourquoi plusieurs comptes e-mail ?</p>
                <p className="text-muted-foreground text-xs">
                    Certains fournisseurs limitent le volume d&apos;envois quotidiens. Configurez
                    plusieurs boîtes SMTP et choisissez le compte adapté à chaque campagne.
                </p>
            </div>

            {isEditing && account?.daily_send_limit ? (
                <div className="bg-muted/40 space-y-1 rounded-lg border p-3 text-sm">
                    <p className="font-medium">Quota du jour</p>
                    <p className="text-muted-foreground text-xs">
                        {account.sent_today ?? 0} / {account.daily_send_limit} envoyés —{' '}
                        {account.remaining_today ?? 0} restant(s).
                    </p>
                </div>
            ) : null}

            <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={account?.name ?? ''}
                    placeholder="Boîte marketing — principal"
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="from_address">Adresse d&apos;expédition</Label>
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
                    <Label htmlFor="from_name">Nom d&apos;expéditeur</Label>
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
                <Label htmlFor="driver">Driver</Label>
                <Select value={driver} onValueChange={setDriver}>
                    <SelectTrigger id="driver">
                        <SelectValue placeholder="Driver" />
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
                        <Label htmlFor="smtp_host">Serveur SMTP</Label>
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
                        <Label htmlFor="smtp_port">Port</Label>
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
                        <Label htmlFor="smtp_encryption">Chiffrement</Label>
                        <Select value={encryption} onValueChange={setEncryption}>
                            <SelectTrigger id="smtp_encryption">
                                <SelectValue placeholder="Chiffrement" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tls">TLS</SelectItem>
                                <SelectItem value="ssl">SSL</SelectItem>
                                <SelectItem value="none">Aucun</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.smtp_encryption} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="smtp_username">Identifiant SMTP</Label>
                        <Input
                            id="smtp_username"
                            name="smtp_username"
                            defaultValue={account?.smtp_username ?? ''}
                            autoComplete="off"
                        />
                        <InputError message={errors.smtp_username} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="smtp_password">Mot de passe SMTP</Label>
                        <Input
                            id="smtp_password"
                            name="smtp_password"
                            type="password"
                            placeholder={
                                account?.has_smtp_password
                                    ? 'Laisser vide pour conserver'
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
                <Label htmlFor="daily_send_limit">Limite d&apos;envois / jour</Label>
                <Input
                    id="daily_send_limit"
                    name="daily_send_limit"
                    type="number"
                    min={1}
                    defaultValue={account?.daily_send_limit ?? ''}
                    placeholder="Illimité si vide"
                />
                <p className="text-muted-foreground text-xs">
                    Ex. 300 pour un hébergeur qui coupe après ce volume. Laissez vide pour
                    illimité.
                </p>
                <InputError message={errors.daily_send_limit} />
            </div>

            <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                        checked={isActive}
                        onCheckedChange={(checked) => setIsActive(checked === true)}
                    />
                    Compte actif
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                        checked={isDefault}
                        onCheckedChange={(checked) => setIsDefault(checked === true)}
                    />
                    Compte par défaut
                </label>
            </div>

            <div className="flex flex-wrap gap-2">
                <Button type="submit">{submitLabel}</Button>
                <Button type="button" variant="outline" asChild>
                    <a href={cancelHref}>Annuler</a>
                </Button>
            </div>
        </Form>
    );
}
