import Reveal from '@/components/marketing/reveal';
import type { SuperSecuriteServiceGalleryImage } from '@/data/super-securite-services';
import { cn } from '@/lib/utils';

export type ServiceGalleryVariant = 'grid' | 'featured' | 'bento' | 'filmstrip';

type ServiceGalleryProps = {
    title: string;
    description?: string;
    images: readonly SuperSecuriteServiceGalleryImage[];
    variant?: ServiceGalleryVariant;
    className?: string;
};

function GalleryFigure({
    image,
    className,
    imageClassName,
    captionClassName,
}: {
    image: SuperSecuriteServiceGalleryImage;
    className?: string;
    imageClassName?: string;
    captionClassName?: string;
}) {
    return (
        <figure
            className={cn(
                'group overflow-hidden rounded-2xl bg-white',
                className,
            )}
        >
            <div className={cn('relative overflow-hidden', imageClassName)}>
                <img
                    src={image.src}
                    alt={image.alt}
                    width={640}
                    height={480}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
            {image.caption ? (
                <figcaption
                    className={cn(
                        'px-3 py-2.5 text-xs leading-snug text-super-securite-muted sm:text-sm',
                        captionClassName,
                    )}
                >
                    {image.caption}
                </figcaption>
            ) : null}
        </figure>
    );
}

export default function ServiceGallery({
    title,
    description,
    images,
    variant = 'grid',
    className,
}: ServiceGalleryProps) {
    if (images.length === 0) {
        return null;
    }

    const [featured, ...rest] = images;

    return (
        <section
            className={cn(
                'border-t border-super-securite-border bg-super-securite-surface py-14 md:py-16',
                className,
            )}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
                    <p className="marketing-label mb-2">Galerie</p>
                    <h2 className="font-heading text-2xl font-bold tracking-tight text-super-securite-heading sm:text-3xl">
                        {title}
                    </h2>
                    {description ? (
                        <p className="mt-4 text-sm leading-relaxed text-super-securite-muted sm:text-base">
                            {description}
                        </p>
                    ) : null}
                </Reveal>

                {variant === 'featured' && featured ? (
                    <div className="grid gap-4 lg:grid-cols-12">
                        <Reveal className="lg:col-span-7">
                            <GalleryFigure
                                image={featured}
                                imageClassName="aspect-[16/10]"
                            />
                        </Reveal>
                        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
                            {rest.map((image, index) => (
                                <Reveal key={image.src} delay={index * 60}>
                                    <GalleryFigure
                                        image={image}
                                        imageClassName="aspect-[16/10] lg:aspect-[16/9]"
                                    />
                                </Reveal>
                            ))}
                        </div>
                    </div>
                ) : null}

                {variant === 'bento' ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:grid-rows-2">
                        {featured ? (
                            <Reveal className="col-span-2 row-span-2">
                                <GalleryFigure
                                    image={featured}
                                    className="h-full"
                                    imageClassName="aspect-square h-full min-h-[240px] md:min-h-full md:aspect-auto"
                                />
                            </Reveal>
                        ) : null}
                        {rest.map((image, index) => (
                            <Reveal key={image.src} delay={index * 60}>
                                <GalleryFigure
                                    image={image}
                                    imageClassName="aspect-[4/3]"
                                />
                            </Reveal>
                        ))}
                    </div>
                ) : null}

                {variant === 'filmstrip' ? (
                    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
                        {images.map((image, index) => (
                            <Reveal
                                key={image.src}
                                delay={index * 50}
                                className="w-[min(85vw,22rem)] shrink-0 snap-center sm:w-80"
                            >
                                <GalleryFigure
                                    image={image}
                                    imageClassName="aspect-[3/4]"
                                />
                            </Reveal>
                        ))}
                    </div>
                ) : null}

                {variant === 'grid' ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {images.map((image, index) => (
                            <Reveal key={image.src} delay={index * 60}>
                                <GalleryFigure
                                    image={image}
                                    imageClassName="aspect-[4/3]"
                                />
                            </Reveal>
                        ))}
                    </div>
                ) : null}
            </div>
        </section>
    );
}
