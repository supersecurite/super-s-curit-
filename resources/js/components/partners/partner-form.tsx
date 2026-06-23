import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type PartnerFormData = {
    name: string;
    logo?: string | null;
    sort_order: number;
    is_published: boolean;
};

type PartnerFormProps = {
    submitUrl: string;
    submitLabel: string;
    cancelHref: string;
    errors: Record<string, string>;
    partner?: PartnerFormData;
    method?: 'post' | 'put';
};

export default function PartnerForm({
    submitUrl,
    submitLabel,
    cancelHref,
    errors,
    partner,
    method = 'post',
}: PartnerFormProps) {
    return (
        <Form
            action={submitUrl}
            method={method === 'put' ? 'post' : 'post'}
            encType="multipart/form-data"
            className="space-y-6 rounded-xl border bg-card p-6"
        >
            {method === 'put' ? (
                <input type="hidden" name="_method" value="put" />
            ) : null}

            <div className="space-y-2">
                <Label htmlFor="name">Nom du partenaire</Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={partner?.name ?? ''}
                    required
                />
                {errors.name ? (
                    <p className="text-sm text-destructive">{errors.name}</p>
                ) : null}
            </div>

            <div className="space-y-2">
                <Label htmlFor="logo">
                    Logo {method === 'put' ? '(laisser vide pour conserver)' : ''}
                </Label>
                {partner?.logo ? (
                    <img
                        src={partner.logo}
                        alt={partner.name}
                        className="mb-3 h-20 w-auto max-w-full rounded-lg border object-contain bg-slate-50 p-2"
                    />
                ) : null}
                <Input id="logo" name="logo" type="file" accept="image/*" />
                {errors.logo ? (
                    <p className="text-sm text-destructive">{errors.logo}</p>
                ) : null}
            </div>

            <div className="space-y-2">
                <Label htmlFor="sort_order">Ordre d’affichage</Label>
                <Input
                    id="sort_order"
                    name="sort_order"
                    type="number"
                    min={0}
                    defaultValue={partner?.sort_order ?? 0}
                />
                {errors.sort_order ? (
                    <p className="text-sm text-destructive">{errors.sort_order}</p>
                ) : null}
            </div>

            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    name="is_published"
                    value="1"
                    defaultChecked={partner?.is_published ?? true}
                    className="size-4 rounded border-input"
                />
                Activer sur le site
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
