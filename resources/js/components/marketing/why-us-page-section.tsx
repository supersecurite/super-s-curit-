import Reveal from '@/components/marketing/reveal';
import {
    superSecuriteWhyUsDetails,
    superSecuriteWhyUsModern,
} from '@/data/super-securite-content';
import MarketingYoutubeEmbed from '@/components/marketing/marketing-youtube-embed';
import type { GalleryVideoPublic } from '@/types/gallery';
import { cn } from '@/lib/utils';

type WhyUsDetailImageProps = {
    src: string;
    alt: string;
    contain?: boolean;
};

function WhyUsDetailImage({ src, alt, contain = false }: WhyUsDetailImageProps) {
    return (
        <div className="mx-auto w-full max-w-md">
            <img
                src={src}
                alt={alt}
                width={640}
                height={contain ? 640 : 480}
                loading="lazy"
                decoding="async"
                className={cn(
                    'w-full',
                    contain
                        ? 'object-contain'
                        : 'aspect-[4/3] object-cover sm:aspect-[5/4]',
                )}
            />
        </div>
    );
}

type WhyUsPageSectionProps = {
    featuredVideo: GalleryVideoPublic | null;
};

export default function WhyUsPageSection({ featuredVideo }: WhyUsPageSectionProps) {
    return (
        <section id="pourquoi" className="border-t border-super-securite-border">
            <div className="marketing-section-white py-14 md:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="mx-auto max-w-3xl text-center">
                        <p className="marketing-label mb-3">
                            {superSecuriteWhyUsModern.sectionLabel}
                        </p>
                        <h2 className="font-heading text-3xl font-bold tracking-tight text-super-securite-heading sm:text-4xl md:text-[2.75rem]">
                            {superSecuriteWhyUsModern.title}
                        </h2>
                        <p className="mt-5 text-sm leading-relaxed text-super-securite-muted sm:text-base md:text-lg">
                            {superSecuriteWhyUsModern.intro}
                        </p>
                    </Reveal>
                </div>
            
                {featuredVideo ? (
                        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
                            <MarketingYoutubeEmbed video={featuredVideo} />
                        </div>
                ) : null}
            </div>

            <div>
                {superSecuriteWhyUsDetails.map((item, index) => {
                    const isEven = index % 2 === 0;
                    const imageOnLeft = !isEven;

                    return (
                        <article
                            key={item.id}
                            id={item.id}
                            className={cn(
                                'scroll-mt-[calc(var(--marketing-header-height,5.5rem)+1rem)] border-t border-super-securite-border',
                                isEven
                                    ? 'marketing-section-band'
                                    : 'marketing-section-white',
                            )}
                        >
                            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
                                <Reveal delay={80}>
                                    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                                        <div
                                            className={cn(
                                                'order-1',
                                                imageOnLeft
                                                    ? 'lg:order-2'
                                                    : 'lg:order-1',
                                            )}
                                        >
                                            <div className="flex items-start gap-5 md:gap-6">
                                                <span className="shrink-0 font-mono text-2xl font-bold leading-none tracking-tight text-super-securite-accent/40 md:text-3xl">
                                                    {String(index + 1).padStart(
                                                        2,
                                                        '0',
                                                    )}
                                                </span>

                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-heading text-xl font-bold leading-snug tracking-tight text-super-securite-heading sm:text-2xl md:text-[1.75rem]">
                                                        {item.title}
                                                    </h3>
                                                    <p className="mt-4 text-sm leading-relaxed text-super-securite-muted sm:text-base md:text-lg">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className={cn(
                                                'order-2 flex justify-center',
                                                imageOnLeft
                                                    ? 'lg:order-1 lg:justify-start'
                                                    : 'lg:justify-end',
                                            )}
                                        >
                                            <WhyUsDetailImage
                                                src={item.image}
                                                alt={item.imageAlt}
                                                contain={item.id === 'application'}
                                            />
                                        </div>
                                    </div>
                                </Reveal>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
