import { Form } from '@inertiajs/react';
import { useState } from 'react';
import CompanyChannelsEditor from '@/components/marketing-clients/company-channels-editor';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import InternationalPhoneInput from '@/components/ui/international-phone-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { MarketingCompanyChannel } from '@/types/marketing-company-contact';

type MarketingContactFormData = {
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    phone?: string | null;
    is_company?: boolean;
    company_name?: string | null;
    company_role?: string | null;
    company_contacts?: MarketingCompanyChannel[] | null;
    address?: string | null;
    tags?: string[];
    marketing_consent?: boolean;
    notes?: string | null;
};

type MarketingContactFormProps = {
    submitUrl: string;
    submitLabel: string;
    cancelHref: string;
    errors: Record<string, string>;
    contact?: MarketingContactFormData;
    method?: 'post' | 'put';
};

function resolveIsCompany(contact?: MarketingContactFormData): boolean {
    if (contact?.is_company !== undefined) {
        return contact.is_company;
    }

    return !!(
        contact?.company_name ||
        contact?.company_role ||
        (contact?.company_contacts?.length ?? 0) > 0
    );
}

export default function MarketingContactForm({
    submitUrl,
    submitLabel,
    cancelHref,
    errors,
    contact,
    method = 'post',
}: MarketingContactFormProps) {
    const tagsValue = contact?.tags?.join(', ') ?? '';
    const [isCompany, setIsCompany] = useState(() => resolveIsCompany(contact));

    return (
        <Form
            action={submitUrl}
            method="post"
            className="space-y-6 rounded-xl border bg-card p-6"
        >
            {method === 'put' ? (
                <input type="hidden" name="_method" value="put" />
            ) : null}

            <input type="hidden" name="is_company" value={isCompany ? '1' : '0'} />

            <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-4">
                <Checkbox
                    id="is_company"
                    checked={isCompany}
                    onCheckedChange={(checked) => setIsCompany(checked === true)}
                />
                <div className="space-y-0.5">
                    <Label htmlFor="is_company" className="cursor-pointer font-medium">
                        Contact entreprise
                    </Label>
                    <p className="text-muted-foreground text-xs">
                        Cochez pour renseigner les informations de l&apos;entreprise et le rôle
                        de l&apos;interlocuteur.
                    </p>
                </div>
            </label>

            <div className="space-y-4">
                <h2 className="text-sm font-semibold">
                    {isCompany ? 'Interlocuteur' : 'Contact'}
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="first_name">Prénom</Label>
                        <Input
                            id="first_name"
                            name="first_name"
                            defaultValue={contact?.first_name ?? ''}
                        />
                        {errors.first_name ? (
                            <p className="text-sm text-destructive">{errors.first_name}</p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="last_name">Nom</Label>
                        <Input
                            id="last_name"
                            name="last_name"
                            defaultValue={contact?.last_name ?? ''}
                        />
                        {errors.last_name ? (
                            <p className="text-sm text-destructive">{errors.last_name}</p>
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={contact?.email ?? ''}
                        />
                        {errors.email ? (
                            <p className="text-sm text-destructive">{errors.email}</p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <InternationalPhoneInput
                            id="phone"
                            name="phone"
                            defaultValue={contact?.phone ?? ''}
                            aria-invalid={Boolean(errors.phone)}
                        />
                        <p className="text-muted-foreground text-xs">
                            Choisissez l&apos;indicatif pays, puis saisissez le numéro.
                        </p>
                        {errors.phone ? (
                            <p className="text-sm text-destructive">{errors.phone}</p>
                        ) : null}
                    </div>
                </div>
            </div>

            {isCompany ? (
                <div className="space-y-4 rounded-lg border border-border/60 bg-muted/20 p-4">
                    <h2 className="text-sm font-semibold">Entreprise</h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="company_name">Nom de l&apos;entreprise</Label>
                            <Input
                                id="company_name"
                                name="company_name"
                                defaultValue={contact?.company_name ?? ''}
                            />
                            {errors.company_name ? (
                                <p className="text-sm text-destructive">{errors.company_name}</p>
                            ) : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="company_role">Rôle de l&apos;interlocuteur</Label>
                            <Input
                                id="company_role"
                                name="company_role"
                                placeholder="Directeur commercial, Comptabilité…"
                                defaultValue={contact?.company_role ?? ''}
                            />
                            {errors.company_role ? (
                                <p className="text-sm text-destructive">{errors.company_role}</p>
                            ) : null}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Canaux entreprise</Label>
                        <CompanyChannelsEditor
                            initialValue={contact?.company_contacts}
                            errors={errors}
                        />
                    </div>
                </div>
            ) : null}

            <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                    id="address"
                    name="address"
                    rows={3}
                    defaultValue={contact?.address ?? ''}
                />
                {errors.address ? (
                    <p className="text-sm text-destructive">{errors.address}</p>
                ) : null}
            </div>

            <div className="space-y-2">
                <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                <Input
                    id="tags"
                    name="tags"
                    defaultValue={tagsValue}
                    placeholder="prospect, client, vip"
                />
                {errors.tags ? (
                    <p className="text-sm text-destructive">{errors.tags}</p>
                ) : null}
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    defaultValue={contact?.notes ?? ''}
                />
                {errors.notes ? (
                    <p className="text-sm text-destructive">{errors.notes}</p>
                ) : null}
            </div>

            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    name="marketing_consent"
                    value="1"
                    defaultChecked={contact?.marketing_consent ?? false}
                    className="size-4 rounded border-input"
                />
                Consentement marketing accordé
            </label>

            <div className="flex flex-wrap gap-3">
                <Button type="submit">{submitLabel}</Button>
                <Button type="button" variant="outline" asChild>
                    <a href={cancelHref}>Annuler</a>
                </Button>
            </div>
        </Form>
    );
}
