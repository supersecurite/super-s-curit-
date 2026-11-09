import { Link, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import InputError from '@/components/input-error';
import Editor from '@/components/lexical-editor/editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTrans } from '@/hooks/use-trans';

type JobOfferFormData = {
    id?: number;
    title: string;
    title_en?: string | null;
    location: string;
    location_en?: string | null;
    contract_type: string;
    contract_type_en?: string | null;
    description?: string | null;
    description_en?: string | null;
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
    const [processing, setProcessing] = useState(false);
    const [localeTab, setLocaleTab] = useState<'fr' | 'en'>('fr');
    const [formData, setFormData] = useState({
        title: offer?.title ?? '',
        title_en: offer?.title_en ?? '',
        location: offer?.location ?? '',
        location_en: offer?.location_en ?? '',
        contract_type: offer?.contract_type ?? 'Temps plein',
        contract_type_en: offer?.contract_type_en ?? '',
        description: offer?.description ?? '',
        description_en: offer?.description_en ?? '',
        is_active: offer?.is_active ?? true,
    });

    const updateField = useCallback(
        (field: keyof typeof formData, value: string | boolean) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
        },
        [],
    );

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setProcessing(true);

        router.post(
            submitUrl,
            {
                ...(method === 'put' ? { _method: 'put' } : {}),
                title: formData.title,
                title_en: formData.title_en,
                location: formData.location,
                location_en: formData.location_en,
                contract_type: formData.contract_type,
                contract_type_en: formData.contract_type_en,
                description: formData.description,
                description_en: formData.description_en,
                is_active: formData.is_active ? '1' : '0',
            },
            {
                forceFormData: true,
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border bg-card p-6"
        >
            <div className="inline-flex gap-1 rounded-lg bg-muted p-1">
                <button
                    type="button"
                    onClick={() => setLocaleTab('fr')}
                    className={
                        localeTab === 'fr'
                            ? 'rounded-md bg-background px-3 py-1.5 text-sm font-medium shadow-sm'
                            : 'rounded-md px-3 py-1.5 text-sm text-muted-foreground'
                    }
                >
                    {t('job_offers.locale_fr', 'Français')}
                </button>
                <button
                    type="button"
                    onClick={() => setLocaleTab('en')}
                    className={
                        localeTab === 'en'
                            ? 'rounded-md bg-background px-3 py-1.5 text-sm font-medium shadow-sm'
                            : 'rounded-md px-3 py-1.5 text-sm text-muted-foreground'
                    }
                >
                    {t('job_offers.locale_en', 'English')}
                </button>
            </div>

            {localeTab === 'fr' ? (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            {t('job_offers.field_title', 'Intitulé')}
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(event) =>
                                updateField('title', event.target.value)
                            }
                            required
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="location">
                                {t('job_offers.field_location', 'Lieu')}
                            </Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(event) =>
                                    updateField('location', event.target.value)
                                }
                                required
                                placeholder="Conakry"
                            />
                            <InputError message={errors.location} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contract_type">
                                {t(
                                    'job_offers.field_contract',
                                    'Type de contrat',
                                )}
                            </Label>
                            <Input
                                id="contract_type"
                                value={formData.contract_type}
                                onChange={(event) =>
                                    updateField(
                                        'contract_type',
                                        event.target.value,
                                    )
                                }
                                required
                            />
                            <InputError message={errors.contract_type} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>
                            {t('job_offers.field_description', 'Description')}
                        </Label>
                        <Editor
                            key={`${offer?.id ?? 'new-offer'}-fr`}
                            initialContent={offer?.description ?? ''}
                            onChange={(content) =>
                                updateField('description', content)
                            }
                        />
                        <InputError message={errors.description} />
                    </div>
                </>
            ) : (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="title_en">
                            {t(
                                'job_offers.field_title_en',
                                'Title (English)',
                            )}
                        </Label>
                        <Input
                            id="title_en"
                            value={formData.title_en}
                            onChange={(event) =>
                                updateField('title_en', event.target.value)
                            }
                        />
                        <InputError message={errors.title_en} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="location_en">
                                {t(
                                    'job_offers.field_location_en',
                                    'Location (English)',
                                )}
                            </Label>
                            <Input
                                id="location_en"
                                value={formData.location_en}
                                onChange={(event) =>
                                    updateField(
                                        'location_en',
                                        event.target.value,
                                    )
                                }
                                placeholder="Conakry"
                            />
                            <InputError message={errors.location_en} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contract_type_en">
                                {t(
                                    'job_offers.field_contract_en',
                                    'Contract type (English)',
                                )}
                            </Label>
                            <Input
                                id="contract_type_en"
                                value={formData.contract_type_en}
                                onChange={(event) =>
                                    updateField(
                                        'contract_type_en',
                                        event.target.value,
                                    )
                                }
                            />
                            <InputError message={errors.contract_type_en} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>
                            {t(
                                'job_offers.field_description_en',
                                'Description (English)',
                            )}
                        </Label>
                        <Editor
                            key={`${offer?.id ?? 'new-offer'}-en`}
                            initialContent={offer?.description_en ?? ''}
                            onChange={(content) =>
                                updateField('description_en', content)
                            }
                        />
                        <InputError message={errors.description_en} />
                    </div>
                </>
            )}

            <div className="flex items-center gap-2">
                <input
                    id="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(event) =>
                        updateField('is_active', event.target.checked)
                    }
                    className="size-4 rounded border"
                />
                <Label htmlFor="is_active">
                    {t(
                        'job_offers.field_active',
                        'Offre active (visible sur le site)',
                    )}
                </Label>
            </div>

            <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={processing}>
                    {submitLabel}
                </Button>
                <Button variant="outline" asChild>
                    <Link href={cancelHref}>
                        {t('common.cancel', 'Annuler')}
                    </Link>
                </Button>
            </div>
        </form>
    );
}
