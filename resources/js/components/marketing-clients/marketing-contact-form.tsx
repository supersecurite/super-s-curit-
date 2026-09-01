import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type MarketingContactFormData = {
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    phone?: string | null;
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

export default function MarketingContactForm({
    submitUrl,
    submitLabel,
    cancelHref,
    errors,
    contact,
    method = 'post',
}: MarketingContactFormProps) {
    const tagsValue = contact?.tags?.join(', ') ?? '';

    return (
        <Form
            action={submitUrl}
            method="post"
            className="space-y-6 rounded-xl border bg-card p-6"
        >
            {method === 'put' ? (
                <input type="hidden" name="_method" value="put" />
            ) : null}

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
                    <Label htmlFor="phone">Téléphone (E.164)</Label>
                    <Input
                        id="phone"
                        name="phone"
                        placeholder="+224612345678"
                        defaultValue={contact?.phone ?? ''}
                    />
                    {errors.phone ? (
                        <p className="text-sm text-destructive">{errors.phone}</p>
                    ) : null}
                </div>
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
