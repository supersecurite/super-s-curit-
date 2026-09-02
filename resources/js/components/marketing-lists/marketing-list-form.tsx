import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type MarketingListFormData = {
    name: string;
    description?: string | null;
};

type MarketingListFormProps = {
    submitUrl: string;
    submitLabel: string;
    cancelHref: string;
    errors: Record<string, string>;
    list?: MarketingListFormData;
    method?: 'post' | 'put';
};

export default function MarketingListForm({
    submitUrl,
    submitLabel,
    cancelHref,
    errors,
    list,
    method = 'post',
}: MarketingListFormProps) {
    return (
        <Form
            action={submitUrl}
            method="post"
            className="space-y-6 rounded-xl border bg-card p-6"
        >
            {method === 'put' ? (
                <input type="hidden" name="_method" value="put" />
            ) : null}

            <div className="space-y-2">
                <Label htmlFor="name">Nom du groupe</Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={list?.name ?? ''}
                    required
                />
                {errors.name ? (
                    <p className="text-sm text-destructive">{errors.name}</p>
                ) : null}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    defaultValue={list?.description ?? ''}
                />
                {errors.description ? (
                    <p className="text-sm text-destructive">{errors.description}</p>
                ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
                <Button type="submit">{submitLabel}</Button>
                <Button type="button" variant="outline" asChild>
                    <a href={cancelHref}>Annuler</a>
                </Button>
            </div>
        </Form>
    );
}
