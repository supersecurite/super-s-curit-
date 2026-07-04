import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
                    <Label htmlFor="service_id">Rattachement</Label>
                    <select
                        id="service_id"
                        name="service_id"
                        defaultValue={galleryVideo?.service_id ?? 'general'}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="general">Galerie générale uniquement</option>
                        {services.map((service) => (
                            <option key={service.value} value={service.value}>
                                {service.label}
                            </option>
                        ))}
                    </select>
                    <p className="text-muted-foreground text-xs">
                        Laissez « Galerie générale » pour une vidéo visible
                        uniquement sur la page /galerie.
                    </p>
                    {errors.service_id ? (
                        <p className="text-sm text-destructive">
                            {errors.service_id}
                        </p>
                    ) : null}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sort_order">Ordre d’affichage</Label>
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
                <Label htmlFor="youtube_url">Lien YouTube</Label>
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
                <p className="text-muted-foreground text-xs">
                    Formats acceptés : youtube.com/watch, youtu.be, embed ou
                    shorts.
                </p>
                {errors.youtube_url ? (
                    <p className="text-sm text-destructive">
                        {errors.youtube_url}
                    </p>
                ) : null}
            </div>

            <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
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
                <Label htmlFor="description">Description</Label>
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
                Publier sur le site
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
