import { Link, router } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useCallback, useState } from 'react';
import Editor from '@/components/lexical-editor/editor';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useTrans } from '@/hooks/use-trans';

export type StatusOption = {
    value: string;
    label: string;
};

export type ArticleFormData = {
    id?: number;
    slug: string;
    title: string;
    title_en?: string | null;
    excerpt: string;
    excerpt_en?: string | null;
    content: string;
    content_en?: string | null;
    category: string;
    tags: string[];
    featured: boolean;
    published_at: string;
    status: string;
    image_url?: string | null;
};

type ArticleFormProps = {
    article?: ArticleFormData;
    statusOptions?: StatusOption[];
    canApprove?: boolean;
    canFeature?: boolean;
    submitUrl: string;
    method?: 'post' | 'put';
    submitLabel: string;
    cancelHref: string;
    errors?: Record<string, string>;
};

export default function ArticleForm({
    article,
    statusOptions = [],
    canApprove = false,
    canFeature = false,
    submitUrl,
    method = 'post',
    submitLabel,
    cancelHref,
    errors = {},
}: ArticleFormProps) {
    const { t } = useTrans();
    const isEditing = method === 'put';
    const showStatusField = isEditing && statusOptions.length > 0;
    const [formData, setFormData] = useState({
        title: article?.title ?? '',
        title_en: article?.title_en ?? '',
        excerpt: article?.excerpt ?? '',
        excerpt_en: article?.excerpt_en ?? '',
        content: article?.content ?? '',
        content_en: article?.content_en ?? '',
        category: article?.category ?? '',
        tags: (article?.tags ?? []).join(', '),
        featured: article?.featured ?? false,
        status: article?.status ?? 'pending_approval',
        published_at: article?.published_at
            ? article.published_at.split('T')[0]
            : '',
        image: null as File | null,
    });
    const [localeTab, setLocaleTab] = useState<'fr' | 'en'>('fr');
    const [imagePreview, setImagePreview] = useState<string | null>(
        article?.image_url ?? null,
    );
    const [processing, setProcessing] = useState(false);

    const updateField = useCallback(
        (field: keyof typeof formData, value: string | boolean | File | null) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
        },
        [],
    );

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        updateField('image', file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setProcessing(true);

        const payload = new FormData();
        if (method === 'put') {
            payload.append('_method', 'put');
        }

        payload.append('title', formData.title);
        payload.append('title_en', formData.title_en);
        if (showStatusField) {
            payload.append('status', formData.status);
        }
        payload.append('excerpt', formData.excerpt);
        payload.append('excerpt_en', formData.excerpt_en);
        payload.append('content', formData.content);
        payload.append('content_en', formData.content_en);
        payload.append('category', formData.category);
        if (canFeature) {
            payload.append('featured', formData.featured ? '1' : '0');
        }
        if (canApprove) {
            payload.append('published_at', formData.published_at);
        }

        formData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
            .forEach((tag) => payload.append('tags[]', tag));

        if (formData.image) {
            payload.append('image', formData.image);
        }

        router.post(submitUrl, payload, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div className="app-panel space-y-4 p-6">
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
                                {t('articles.locale_fr', 'Français')}
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
                                {t('articles.locale_en', 'English')}
                            </button>
                        </div>

                        {localeTab === 'fr' ? (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="title">{t('articles.form_title', 'Titre')}</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) =>
                                            updateField('title', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="excerpt">{t('articles.form_excerpt_label', 'Résumé')}</Label>
                                    <textarea
                                        id="excerpt"
                                        rows={3}
                                        value={formData.excerpt}
                                        onChange={(e) =>
                                            updateField('excerpt', e.target.value)
                                        }
                                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                    />
                                    <InputError message={errors.excerpt} />
                                </div>

                                <div className="grid gap-2">
                                    <Label>{t('articles.form_content', 'Contenu')}</Label>
                                    <Editor
                                        key={`${article?.id ?? 'new'}-fr`}
                                        initialContent={article?.content ?? ''}
                                        onChange={(content) =>
                                            updateField('content', content)
                                        }
                                    />
                                    <InputError message={errors.content} />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="title_en">{t('articles.form_title_en', 'Title (English)')}</Label>
                                    <Input
                                        id="title_en"
                                        value={formData.title_en}
                                        onChange={(e) =>
                                            updateField('title_en', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.title_en} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="excerpt_en">{t('articles.form_excerpt_en', 'Excerpt (English)')}</Label>
                                    <textarea
                                        id="excerpt_en"
                                        rows={3}
                                        value={formData.excerpt_en}
                                        onChange={(e) =>
                                            updateField(
                                                'excerpt_en',
                                                e.target.value,
                                            )
                                        }
                                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                    />
                                    <InputError message={errors.excerpt_en} />
                                </div>

                                <div className="grid gap-2">
                                    <Label>{t('articles.form_content_en', 'Content (English)')}</Label>
                                    <Editor
                                        key={`${article?.id ?? 'new'}-en`}
                                        initialContent={article?.content_en ?? ''}
                                        onChange={(content) =>
                                            updateField('content_en', content)
                                        }
                                    />
                                    <InputError message={errors.content_en} />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {showStatusField ? (
                        <div className="app-panel space-y-4 p-6">
                            <div className="grid gap-2">
                                <Label htmlFor="status">{t('articles.form_status', 'Statut')}</Label>
                                <SearchableSelect
                                    id="status"
                                    options={statusOptions}
                                    value={formData.status}
                                    onChange={(status) =>
                                        updateField('status', status)
                                    }
                                    placeholder={t('articles.form_status_placeholder', 'Sélectionner un statut')}
                                    searchPlaceholder={t('common.search_ellipsis', 'Rechercher…')}
                                    disabled={
                                        !canApprove &&
                                        formData.status === 'published'
                                    }
                                />
                                <p className="text-muted-foreground text-xs">
                                    {canApprove
                                        ? t('articles.status_hint_approver', "Modifiez le statut pour valider, refuser ou republier l'article.")
                                        : formData.status === 'published'
                                          ? t('articles.status_hint_published', "Article publié : seul un administrateur peut modifier le statut.")
                                          : formData.status === 'rejected'
                                            ? t('articles.status_hint_rejected', 'Repassez en brouillon ou soumettez à nouveau pour validation.')
                                            : t('articles.status_hint_default', 'Enregistrez en brouillon ou soumettez pour validation.')}
                                </p>
                                <InputError message={errors.status} />
                            </div>
                        </div>
                    ) : (
                        <div className="app-panel space-y-2 p-6">
                            <p className="text-sm font-medium">
                                {t('articles.auto_submit_title', 'Soumission automatique')}
                            </p>
                            <p className="text-muted-foreground text-xs">
                                {t(
                                    'articles.auto_submit_hint',
                                    "L'article sera enregistré en attente de validation par un administrateur.",
                                )}
                            </p>
                        </div>
                    )}

                    <div className="app-panel space-y-4 p-6">
                        <Label htmlFor="image">{t('articles.form_image_main', 'Image principale')}</Label>
                        {imagePreview ? (
                            <div className="relative overflow-hidden rounded-lg">
                                <img
                                    src={imagePreview}
                                    alt={t('articles.form_preview_alt', 'Aperçu')}
                                    className="h-48 w-full object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={() => {
                                        setImagePreview(null);
                                        updateField('image', null);
                                    }}
                                >
                                    {t('common.remove', 'Retirer')}
                                </Button>
                            </div>
                        ) : (
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        )}
                        <InputError message={errors.image} />
                    </div>

                    <div className="app-panel space-y-4 p-6">
                        <div className="grid gap-2">
                            <Label htmlFor="category">{t('articles.form_category', 'Catégorie')}</Label>
                            <Input
                                id="category"
                                value={formData.category}
                                onChange={(e) =>
                                    updateField('category', e.target.value)
                                }
                            />
                            <InputError message={errors.category} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tags">{t('articles.form_tags', 'Tags')}</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) =>
                                    updateField('tags', e.target.value)
                                }
                                placeholder={t('articles.form_tags_placeholder', 'Séparez les tags par des virgules')}
                            />
                            <InputError message={errors.tags} />
                        </div>
                    </div>

                    {canFeature ? (
                        <div className="app-panel space-y-4 p-6">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="featured"
                                    checked={formData.featured}
                                    onCheckedChange={(checked) =>
                                        updateField(
                                            'featured',
                                            checked === true,
                                        )
                                    }
                                    disabled={
                                        !isEditing ||
                                        formData.status !== 'published'
                                    }
                                />
                                <Label htmlFor="featured">{t('articles.form_featured_label', 'Mettre à la une')}</Label>
                            </div>
                            <InputError message={errors.featured} />
                        </div>
                    ) : null}

                    {canApprove ? (
                        <div className="app-panel space-y-4 p-6">
                            <div className="grid gap-2">
                                <Label htmlFor="published_at">
                                    {t('articles.form_published_at', 'Date de publication')}
                                </Label>
                                <Input
                                    id="published_at"
                                    type="date"
                                    value={formData.published_at}
                                    onChange={(e) =>
                                        updateField(
                                            'published_at',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError message={errors.published_at} />
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" asChild>
                    <Link href={cancelHref}>{t('common.cancel', 'Annuler')}</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                    <Save className="size-4" aria-hidden />
                    {processing ? t('articles.saving', 'Enregistrement…') : submitLabel}
                </Button>
            </div>
        </form>
    );
}
