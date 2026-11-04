import { Form, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTrans } from '@/hooks/use-trans';

type JobOfferFormData = {
    title: string;
    location: string;
    contract_type: string;
    description?: string | null;
    is_active: boolean;
};

type JobOfferFormProps = {
    submitUrl: string;
    submitLabel: string;
    cancelHref: string;
    errors: Record<string, string>;
    offer?: JobOfferFormData;
    method?: 'post' | 'put';
};

export default function JobOfferForm({
    submitUrl,
    submitLabel,
    cancelHref,
    errors,
    offer,
    method = 'post',
}: JobOfferFormProps) {
    const { t } = useTrans();

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
                <Label htmlFor="title">{t('job_offers.field_title', 'Intitulé')}</Label>
                <Input
                    id="title"
                    name="title"
                    defaultValue={offer?.title ?? ''}
                    required
                />
                {errors.title ? (
                    <p className="text-sm text-destructive">{errors.title}</p>
                ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="location">
                        {t('job_offers.field_location', 'Lieu')}
                    </Label>
                    <Input
                        id="location"
                        name="location"
                        defaultValue={offer?.location ?? ''}
                        required
                        placeholder="Conakry"
                    />
                    {errors.location ? (
                        <p className="text-sm text-destructive">{errors.location}</p>
                    ) : null}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contract_type">
                        {t('job_offers.field_contract', 'Type de contrat')}
                    </Label>
                    <Input
                        id="contract_type"
                        name="contract_type"
                        defaultValue={offer?.contract_type ?? 'Temps plein'}
                        required
                    />
                    {errors.contract_type ? (
                        <p className="text-sm text-destructive">
                            {errors.contract_type}
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">
                    {t('job_offers.field_description', 'Description')}
                </Label>
                <Textarea
                    id="description"
                    name="description"
                    rows={5}
                    defaultValue={offer?.description ?? ''}
                />
                {errors.description ? (
                    <p className="text-sm text-destructive">{errors.description}</p>
                ) : null}
            </div>

            <div className="flex items-center gap-2">
                <input type="hidden" name="is_active" value="0" />
                <input
                    id="is_active"
                    name="is_active"
                    type="checkbox"
                    value="1"
                    defaultChecked={offer?.is_active ?? true}
                    className="size-4 rounded border"
                />
                <Label htmlFor="is_active">
                    {t('job_offers.field_active', 'Offre active (visible sur le site)')}
                </Label>
            </div>

            <div className="flex flex-wrap gap-3">
                <Button type="submit">{submitLabel}</Button>
                <Button variant="outline" asChild>
                    <Link href={cancelHref}>{t('common.cancel', 'Annuler')}</Link>
                </Button>
            </div>
        </Form>
    );
}
