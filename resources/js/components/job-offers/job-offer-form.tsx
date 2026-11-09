import { Link, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import InputError from '@/components/input-error';
import Editor from '@/components/lexical-editor/editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTrans } from '@/hooks/use-trans';

type ContentLocale = 'fr' | 'en' | 'zh';

type JobOfferFormData = {
    id?: number;
    title: string;
    title_en?: string | null;
    title_zh?: string | null;
    location: string;
    location_en?: string | null;
    location_zh?: string | null;
    contract_type: string;
    contract_type_en?: string | null;
    contract_type_zh?: string | null;
    description?: string | null;
    description_en?: string | null;
    description_zh?: string | null;
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

const localeTabs: Array<{
    id: ContentLocale;
    labelKey: string;
    fallback: string;
}> = [
    { id: 'fr', labelKey: 'job_offers.locale_fr', fallback: 'Français' },
    { id: 'en', labelKey: 'job_offers.locale_en', fallback: 'English' },
    { id: 'zh', labelKey: 'job_offers.locale_zh', fallback: '中文' },
];

function fieldKey(
    base: 'title' | 'location' | 'contract_type' | 'description',
    locale: ContentLocale,
): keyof JobOfferFormData {
    return locale === 'fr' ? base : (`${base}_${locale}` as keyof JobOfferFormData);
}

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
    const [localeTab, setLocaleTab] = useState<ContentLocale>('fr');
    const [formData, setFormData] = useState({
        title: offer?.title ?? '',
        title_en: offer?.title_en ?? '',
        title_zh: offer?.title_zh ?? '',
        location: offer?.location ?? '',
        location_en: offer?.location_en ?? '',
        location_zh: offer?.location_zh ?? '',
        contract_type: offer?.contract_type ?? 'Temps plein',
        contract_type_en: offer?.contract_type_en ?? '',
        contract_type_zh: offer?.contract_type_zh ?? '',
        description: offer?.description ?? '',
        description_en: offer?.description_en ?? '',
        description_zh: offer?.description_zh ?? '',
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
                title_zh: formData.title_zh,
                location: formData.location,
                location_en: formData.location_en,
                location_zh: formData.location_zh,
                contract_type: formData.contract_type,
                contract_type_en: formData.contract_type_en,
                contract_type_zh: formData.contract_type_zh,
                description: formData.description,
                description_en: formData.description_en,
                description_zh: formData.description_zh,
                is_active: formData.is_active ? '1' : '0',
            },
            {
                forceFormData: true,
                onFinish: () => setProcessing(false),
            },
        );
    };

    const titleField = fieldKey('title', localeTab);
    const locationField = fieldKey('location', localeTab);
    const contractField = fieldKey('contract_type', localeTab);
    const descriptionField = fieldKey('description', localeTab);
    const isFrench = localeTab === 'fr';

    const titleLabel =
        localeTab === 'fr'
            ? t('job_offers.field_title', 'Intitulé')
            : localeTab === 'en'
              ? t('job_offers.field_title_en', 'Title (English)')
              : t('job_offers.field_title_zh', '标题（中文）');
    const locationLabel =
        localeTab === 'fr'
            ? t('job_offers.field_location', 'Lieu')
            : localeTab === 'en'
              ? t('job_offers.field_location_en', 'Location (English)')
              : t('job_offers.field_location_zh', '地点（中文）');
    const contractLabel =
        localeTab === 'fr'
            ? t('job_offers.field_contract', 'Type de contrat')
            : localeTab === 'en'
              ? t('job_offers.field_contract_en', 'Contract type (English)')
              : t('job_offers.field_contract_zh', '合同类型（中文）');
    const descriptionLabel =
        localeTab === 'fr'
            ? t('job_offers.field_description', 'Description')
            : localeTab === 'en'
              ? t('job_offers.field_description_en', 'Description (English)')
              : t('job_offers.field_description_zh', '描述（中文）');

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border bg-card p-6"
        >
            <div className="inline-flex gap-1 rounded-lg bg-muted p-1">
                {localeTabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setLocaleTab(tab.id)}
                        className={
                            localeTab === tab.id
                                ? 'rounded-md bg-background px-3 py-1.5 text-sm font-medium shadow-sm'
                                : 'rounded-md px-3 py-1.5 text-sm text-muted-foreground'
                        }
                    >
                        {t(tab.labelKey, tab.fallback)}
                    </button>
                ))}
            </div>

            <div className="space-y-2">
                <Label htmlFor={String(titleField)}>{titleLabel}</Label>
                <Input
                    id={String(titleField)}
                    value={String(formData[titleField] ?? '')}
                    onChange={(event) =>
                        updateField(titleField, event.target.value)
                    }
                    required={isFrench}
                />
                <InputError message={errors[String(titleField)]} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor={String(locationField)}>
                        {locationLabel}
                    </Label>
                    <Input
                        id={String(locationField)}
                        value={String(formData[locationField] ?? '')}
                        onChange={(event) =>
                            updateField(locationField, event.target.value)
                        }
                        required={isFrench}
                        placeholder="Conakry"
                    />
                    <InputError message={errors[String(locationField)]} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={String(contractField)}>
                        {contractLabel}
                    </Label>
                    <Input
                        id={String(contractField)}
                        value={String(formData[contractField] ?? '')}
                        onChange={(event) =>
                            updateField(contractField, event.target.value)
                        }
                        required={isFrench}
                    />
                    <InputError message={errors[String(contractField)]} />
                </div>
            </div>

            <div className="space-y-2">
                <Label>{descriptionLabel}</Label>
                <Editor
                    key={`${offer?.id ?? 'new-offer'}-${localeTab}`}
                    initialContent={
                        String(
                            (offer?.[descriptionField] as string | null) ?? '',
                        )
                    }
                    onChange={(content) =>
                        updateField(descriptionField, content)
                    }
                />
                <InputError message={errors[String(descriptionField)]} />
            </div>

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
