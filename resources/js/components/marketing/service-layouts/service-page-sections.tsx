import { Check } from 'lucide-react';
import ServiceFaq from '@/components/marketing/service-faq';
import ServiceGallery from '@/components/marketing/service-gallery';
import CtaBand from '@/components/marketing/cta-band';
import Reveal from '@/components/marketing/reveal';
import type { ServicePageLayoutProps } from '@/components/marketing/service-layouts/types';
import { cn } from '@/lib/utils';

import type { SuperSecuriteServiceGalleryImage } from '@/data/super-securite-services';
import type { GalleryImagePublic } from '@/types/gallery';
import VideoGallery from '@/components/marketing/video-gallery';
import { superSecuriteVideos } from '@/data/super-securite-videos';

function toGalleryFigures(
    images: readonly GalleryImagePublic[],
): SuperSecuriteServiceGalleryImage[] {
    return images.map((image) => ({
        src: image.src,
        alt: image.alt,
        caption: image.caption ?? undefined,
    }));
}

export default function ServicePageSections({
    content,
    faqs,
    serviceGalleryImages = [],
}: ServicePageLayoutProps) {
    const figures =
        serviceGalleryImages.length > 0
            ? toGalleryFigures(serviceGalleryImages)
            : [...content.gallery];

    // Ensure the first image (spotlight) is different from the hero image
    const heroImageSrc = content.hero.image;
    const nonHeroIndex = figures.findIndex((fig) => fig.src !== heroImageSrc);
    if (nonHeroIndex > 0 && nonHeroIndex < figures.length) {
        const temp = figures[0];
        figures[0] = figures[nonHeroIndex];
        figures[nonHeroIndex] = temp;
    }

    const spotlight = figures[0];
    const galleryImages =
        figures.length > 1 ? figures.slice(1) : figures;

    const serviceVideos = [
        ...superSecuriteVideos.filter((video) => video.serviceId === content.hero.id),
        ...superSecuriteVideos.filter((video) => video.serviceId === 'general'),
    ].slice(0, 3);

    return (
        <>
            <section className="bg-white py-14 md:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div
                        className={cn(
                            'grid items-start gap-10 lg:gap-16',
                            spotlight
                                ? 'lg:grid-cols-12'
                                : 'mx-auto max-w-3xl',
                        )}
                    >
                        {spotlight ? (
                            <Reveal
                                variant="fade"
                                className="lg:col-span-5 lg:sticky lg:top-28"
                            >
                                <div className="overflow-hidden rounded-2xl">
                                    <img
                                        src={spotlight.src}
                                        alt={spotlight.alt}
                                        width={800}
                                        height={600}
                                        loading="lazy"
                                        decoding="async"
                                        className="aspect-[4/3] w-full object-cover"
                                    />
                                </div>
                            </Reveal>
                        ) : null}

                        <div
                            className={cn(
                                spotlight ? 'lg:col-span-7' : undefined,
                            )}
                        >
                            <div className="space-y-5">
                                {content.intro.map((paragraph, index) => (
                                    <Reveal
                                        key={paragraph.slice(0, 48)}
                                        delay={index * 80}
                                    >
                                        <p
                                            className={cn(
                                                'leading-relaxed text-super-securite-muted',
                                                index === 0
                                                    ? 'text-base font-medium text-super-securite-heading sm:text-lg'
                                                    : 'text-sm sm:text-base',
                                            )}
                                        >
                                            {paragraph}
                                        </p>
                                    </Reveal>
                                ))}
                            </div>

                            {content.introIndicators &&
                            content.introIndicators.length > 0 ? (
                                <Reveal delay={200} className="mt-8">
                                    <ul className="grid gap-3 sm:grid-cols-2">
                                        {content.introIndicators.map(
                                            (indicator) => (
                                                <li
                                                    key={indicator}
                                                    className="flex h-full items-center gap-3 rounded-xl border border-super-securite-accent/20 bg-super-securite-accent/5 p-0 text-sm font-medium leading-snug text-super-securite-heading transition-colors duration-200 hover:border-super-securite-accent/40 hover:bg-super-securite-accent/10"
                                                >
                                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-super-securite-accent/20 bg-white text-super-securite-accent shadow-sm">
                                                        <Check
                                                            className="size-4"
                                                            strokeWidth={2.5}
                                                            aria-hidden
                                                        />
                                                    </span>
                                                    {indicator}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </Reveal>
                            ) : null}

                            {content.benefits.length > 0 ? (
                                <Reveal
                                    delay={240}
                                    className="mt-8 flex flex-wrap gap-2"
                                >
                                    {content.benefits.map((benefit) => (
                                        <span
                                            key={benefit}
                                            className="rounded-full border border-super-securite-border bg-slate-50 px-4 py-2 text-sm font-semibold text-super-securite-heading"
                                        >
                                            {benefit}
                                        </span>
                                    ))}
                                </Reveal>
                            ) : null}
                        </div>
                    </div>
                </div>
            </section>

            <section className="marketing-section-band border-y border-super-securite-border/60 py-14 md:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {content.sectionsTitle ? (
                        <Reveal className="mb-10 max-w-2xl md:mb-14">
                            <h2 className="font-heading text-2xl font-bold tracking-tight text-super-securite-heading sm:text-3xl">
                                {content.sectionsTitle}
                            </h2>
                        </Reveal>
                    ) : null}

                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {content.sections.map((section, index) => (
                            <Reveal key={section.title} delay={index * 70}>
                                <article className="group relative h-full overflow-hidden rounded-2xl border border-super-securite-border bg-white p-6 shadow-sm shadow-slate-900/5 transition-shadow duration-300 hover:shadow-md md:p-7">
                                    {/* <div
                                        className="absolute inset-x-0 top-0 h-1 bg-super-securite-accent"
                                        aria-hidden
                                    /> */}
                                    <span className="inline-flex size-9 items-center justify-center rounded-full bg-super-securite-accent/10 font-heading text-sm font-bold text-super-securite-accent">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <h3 className="font-heading mt-4 text-lg font-semibold text-super-securite-heading">
                                        {section.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-super-securite-muted">
                                        {section.description}
                                    </p>
                                </article>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {content.includes.length > 0 ? (
                <section className="bg-white py-14 md:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <Reveal className="mx-auto max-w-3xl text-center">
                            <h2 className="font-heading text-2xl font-bold text-super-securite-heading sm:text-3xl">
                                {content.includesTitle}
                            </h2>
                            {content.includesDescription ? (
                                <p className="mt-4 text-sm leading-relaxed text-super-securite-muted sm:text-base">
                                    {content.includesDescription}
                                </p>
                            ) : null}
                        </Reveal>

                        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {content.includes.map((item, index) => (
                                <Reveal key={item} delay={index * 50}>
                                    <li className="flex h-full items-center gap-3 rounded-xl border border-super-securite-border bg-slate-50/80 px-4 py-3.5 text-sm font-medium text-super-securite-heading">
                                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-super-securite-accent shadow-sm">
                                            <Check
                                                className="size-4"
                                                strokeWidth={2.5}
                                                aria-hidden
                                            />
                                        </span>
                                        {item}
                                    </li>
                                </Reveal>
                            ))}
                        </ul>
                    </div>
                </section>
            ) : null}

            {content.highlights && content.highlights.length > 0 ? (
                <section className="marketing-section-band py-14 md:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="overflow-hidden rounded-3xl border border-super-securite-border bg-white shadow-lg shadow-slate-900/5">
                            <div className="border-b border-super-securite-border bg-slate-50 px-6 py-8 md:px-10 md:py-10">
                                <Reveal>
                                    <h2 className="font-heading text-center text-2xl font-bold text-super-securite-heading sm:text-3xl">
                                        {content.highlightsTitle}
                                    </h2>
                                </Reveal>
                            </div>
                            <ul className="grid gap-px bg-super-securite-border md:grid-cols-2">
                                {content.highlights.map((item, index) => (
                                    <Reveal key={item} delay={index * 60}>
                                        <li className="flex h-full items-start gap-3 bg-white px-6 py-5 text-sm leading-relaxed text-super-securite-heading sm:text-base md:px-8">
                                            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-super-securite-accent text-white">
                                                <Check
                                                    className="size-3.5"
                                                    strokeWidth={3}
                                                    aria-hidden
                                                />
                                            </span>
                                            {item}
                                        </li>
                                    </Reveal>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            ) : null}

            {serviceVideos.length > 0 ? (
                <section className="bg-slate-50/50 border-t border-super-securite-border/60 py-14 md:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <Reveal className="mx-auto max-w-3xl text-center mb-10 md:mb-12">
                            <h2 className="font-heading text-2xl font-bold text-super-securite-heading sm:text-3xl">
                                Démonstrations & Formations
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed text-super-securite-muted sm:text-base">
                                Découvrez nos agents en action à travers nos interventions réelles et nos sessions d'entraînement.
                            </p>
                        </Reveal>

                        <Reveal delay={100}>
                            <VideoGallery videos={serviceVideos} />
                        </Reveal>
                    </div>
                </section>
            ) : null}

            <ServiceGallery
                variant="grid"
                title={content.galleryTitle}
                description={content.galleryDescription}
                images={galleryImages}
                className="bg-white"
            />

            <ServiceFaq faqs={faqs} />
            <CtaBand />
        </>
    );
}
