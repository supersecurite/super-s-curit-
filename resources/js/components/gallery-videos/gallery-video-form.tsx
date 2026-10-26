import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Textarea } from '@/components/ui/textarea';
import type { GalleryServiceOption } from '@/types/gallery';

type GalleryVideoFormData = {
    service_id: string | null;
    youtube_url: string;
    title: string;
    description: string | null;
    sort_order: number;
    is_published: boolean;
    thumbnail_url?: string | null;
};

type GalleryVideoFormProps = {
    submitUrl: string;
    submitLabel: string;
    cancelHref: string;
    services: GalleryServiceOption[];
    errors: Record<string, string>;
    galleryVideo?: GalleryVideoFormData;
    method?: 'post' | 'put';
};

export default function GalleryVideoForm({
    submitUrl,
    submitLabel,
    cancelHref,
    services,
    errors,
    galleryVideo,
    method = 'post',
}: GalleryVideoFormProps) {
    const { t: uiText } = useUiTranslations();

    return (
        <Form
            action={submitUrl}
            method={method === 'put' ? 'post' : 'post'}
            className="space-y-6 rounded-xl border bg-card p-6"
        >
            {method === 'put' ? (
                <input type="hidden" name="_method" value="put" />
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="service_id">
                        {uiText(
                            'ui.components.text_c750202ef014',
                            'Rattachement',
                        )}
                    </Label>
                    <SearchableSelect
                        id="service_id"
                        name="service_id"
                        options={[
                            {
                                value: 'general',
                                label: uiText(
                                    'ui.components.text_c40aa566244e',
                                    'Galerie générale uniquement',
                                ),
                            },
                            ...services.map((service) => ({
                                value: service.value,
                                label: service.label,
                            })),
                        ]}
                        defaultValue={galleryVideo?.service_id ?? 'general'}
                        placeholder={uiText(
                            'ui.components.text_d099472f84f2',
                            'Sélectionner un rattachement',
                        )}
                        searchPlaceholder={uiText(
                            'ui.components.text_a6ba97261b7b',
                            'Rechercher un service...',
                        )}
                    />
                    <p className="text-xs text-muted-foreground">
                        {uiText(
                            'ui.components.text_f53e69c02864',
                            'Laissez « Galerie générale » pour une vidéo visible uniquement sur la page /galerie.',
                        )}
                    </p>
                    {errors.service_id ? (
                        <p className="text-sm text-destructive">
                            {errors.service_id}
                        </p>
                    ) : null}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sort_order">
                        {uiText(
                            'ui.components.text_2c6271453fa1',
                            'Ordre d’affichage',
                        )}
                    </Label>
                    <Input
                        id="sort_order"
                        name="sort_order"
                        type="number"
                        min={0}
                        defaultValue={galleryVideo?.sort_order ?? 0}
                    />
                    {errors.sort_order ? (
                        <p className="text-sm text-destructive">
                            {errors.sort_order}
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="youtube_url">
                    {uiText('ui.components.text_6471d0a63ada', 'Lien YouTube')}
                </Label>
                {galleryVideo?.thumbnail_url ? (
                    <img
                        src={galleryVideo.thumbnail_url}
                        alt={galleryVideo.title}
                        className="mb-3 aspect-video w-full max-w-md rounded-lg border object-cover"
                    />
                ) : null}
                <Input
                    id="youtube_url"
                    name="youtube_url"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    defaultValue={galleryVideo?.youtube_url ?? ''}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    {uiText(
                        'ui.components.text_51894e727b31',
                        'Formats acceptés : youtube.com/watch, youtu.be, embed ou shorts.',
                    )}
                </p>
                {errors.youtube_url ? (
                    <p className="text-sm text-destructive">
                        {errors.youtube_url}
                    </p>
                ) : null}
            </div>

            <div className="space-y-2">
                <Label htmlFor="title">
                    {uiText('ui.components.text_78e7920010aa', 'Titre')}
                </Label>
                <Input
                    id="title"
                    name="title"
                    defaultValue={galleryVideo?.title ?? ''}
                    required
                />
                {errors.title ? (
                    <p className="text-sm text-destructive">{errors.title}</p>
                ) : null}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">
                    {uiText('ui.components.text_526e0087cc3f', 'Description')}
                </Label>
                <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    defaultValue={galleryVideo?.description ?? ''}
                />
                {errors.description ? (
                    <p className="text-sm text-destructive">
                        {errors.description}
                    </p>
                ) : null}
            </div>

            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    name="is_published"
                    value="1"
                    defaultChecked={galleryVideo?.is_published ?? true}
                    className="size-4 rounded border-input"
                />
                {uiText(
                    'ui.components.text_ee8012606f4d',
                    'Publier sur le site',
                )}
            </label>

            <div className="flex flex-wrap gap-3">
                <Button type="submit">{submitLabel}</Button>
                <Button type="button" variant="outline" asChild>
                    <a href={cancelHref}>
                        {uiText('ui.components.text_46ad3916f6a0', 'Annuler')}
                    </a>
                </Button>
            </div>
        </Form>
    );
}
