import { Link, router } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useCallback, useState } from 'react';
import Editor from '@/components/lexical-editor/editor';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type StatusOption = {
    value: string;
    label: string;
};

export type SecurityTipFormData = {
    id?: number;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    featured: boolean;
    published_at: string;
    status: string;
    image_url?: string | null;
};

type SecurityTipFormProps = {
    securityTip?: SecurityTipFormData;
    statusOptions?: StatusOption[];
    canApprove?: boolean;
    submitUrl: string;
    method?: 'post' | 'put';
    submitLabel: string;
    cancelHref: string;
    errors?: Record<string, string>;
};

export default function SecurityTipForm({
    securityTip,
    statusOptions = [],
    canApprove = false,
    submitUrl,
    method = 'post',
    submitLabel,
    cancelHref,
    errors = {},
}: SecurityTipFormProps) {
    const isEditing = method === 'put';
    const showStatusField = isEditing && statusOptions.length > 0;
    const [formData, setFormData] = useState({
        title: securityTip?.title ?? '',
        excerpt: securityTip?.excerpt ?? '',
        content: securityTip?.content ?? '',
        category: securityTip?.category ?? '',
        tags: (securityTip?.tags ?? []).join(', '),
        featured: securityTip?.featured ?? false,
        status: securityTip?.status ?? 'pending_approval',
        published_at: securityTip?.published_at
            ? securityTip.published_at.split('T')[0]
            : '',
        image: null as File | null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(
        securityTip?.image_url ?? null,
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
        if (showStatusField) {
            payload.append('status', formData.status);
        }
        payload.append('excerpt', formData.excerpt);
        payload.append('content', formData.content);
        payload.append('category', formData.category);
        if (canApprove) {
            payload.append('featured', formData.featured ? '1' : '0');
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
                        <div className="grid gap-2">
                            <Label htmlFor="title">Titre</Label>
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
                            <Label htmlFor="excerpt">Résumé</Label>
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
                            <Label>Contenu</Label>
                            <Editor
                                key={securityTip?.id ?? 'new'}
                                initialContent={securityTip?.content ?? ''}
                                onChange={(content) =>
                                    updateField('content', content)
                                }
                            />
                            <InputError message={errors.content} />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {showStatusField ? (
                        <div className="app-panel space-y-4 p-6">
                            <div className="grid gap-2">
                                <Label htmlFor="status">Statut</Label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) =>
                                        updateField('status', e.target.value)
                                    }
                                    disabled={
                                        !canApprove &&
                                        formData.status === 'published'
                                    }
                                    className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {statusOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-muted-foreground text-xs">
                                    {canApprove
                                        ? 'Modifiez le statut pour valider, refuser ou republier le conseil.'
                                        : formData.status === 'published'
                                          ? 'Ce conseil est publié. Seul un administrateur peut modifier son statut.'
                                          : 'Soumettez à nouveau pour validation ou enregistrez en brouillon.'}
                                </p>
                                <InputError message={errors.status} />
                            </div>
                        </div>
                    ) : (
                        <div className="app-panel space-y-2 p-6">
                            <p className="text-sm font-medium">
                                Soumission automatique
                            </p>
                            <p className="text-muted-foreground text-xs">
                                Le conseil sera enregistré en attente de
                                validation par un administrateur.
                            </p>
                        </div>
                    )}

                    <div className="app-panel space-y-4 p-6">
                        <Label htmlFor="image">Image principale</Label>
                        {imagePreview ? (
                            <div className="relative overflow-hidden rounded-lg">
                                <img
                                    src={imagePreview}
                                    alt="Aperçu"
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
                                    Retirer
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
                            <Label htmlFor="category">Catégorie</Label>
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
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) =>
                                    updateField('tags', e.target.value)
                                }
                                placeholder="Séparez les tags par des virgules"
                            />
                            <InputError message={errors.tags} />
                        </div>
                    </div>

                    {canApprove ? (
                        <div className="app-panel space-y-4 p-6">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="featured"
                                    checked={formData.featured}
                                    onCheckedChange={(checked) =>
                                        updateField('featured', checked === true)
                                    }
                                    disabled={formData.status !== 'published'}
                                />
                                <Label htmlFor="featured">Mettre à la une</Label>
                            </div>
                            <InputError message={errors.featured} />
                        </div>
                    ) : null}

                    {canApprove ? (
                        <div className="app-panel space-y-4 p-6">
                            <div className="grid gap-2">
                                <Label htmlFor="published_at">
                                    Date de publication
                                </Label>
                                <Input
                                    id="published_at"
                                    type="date"
                                    value={formData.published_at}
                                    onChange={(e) =>
                                        updateField('published_at', e.target.value)
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
                    <Link href={cancelHref}>Annuler</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                    <Save className="size-4" aria-hidden />
                    {processing ? 'Enregistrement...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
