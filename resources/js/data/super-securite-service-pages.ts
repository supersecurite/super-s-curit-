import {
    superSecuriteServiceById,
    type SuperSecuriteServiceGalleryImage,
    type SuperSecuriteServiceHero,
    type SuperSecuriteServiceId,
    type SuperSecuriteServiceSection,
} from '@/data/super-securite-services';

export type ServicePageContent = {
    hero: SuperSecuriteServiceHero;
    intro: readonly string[];
    introLabel?: string;
    introTitle?: string;
    benefits: readonly string[];
    sectionsLabel?: string;
    sectionsTitle?: string;
    sections: readonly SuperSecuriteServiceSection[];
    includes: readonly string[];
    includesTitle?: string;
    includesDescription?: string;
    highlightsTitle?: string;
    highlights?: readonly string[];
    gallery: readonly SuperSecuriteServiceGalleryImage[];
    galleryTitle: string;
    galleryDescription: string;
};

function toServicePageContent(id: SuperSecuriteServiceId): ServicePageContent {
    const service = superSecuriteServiceById[id];

    return {
        hero: service.hero,
        intro: service.intro,
        introLabel: service.introLabel,
        introTitle: service.introTitle,
        benefits: service.benefits,
        sectionsLabel: service.sectionsLabel,
        sectionsTitle: service.sectionsTitle,
        sections: service.sections,
        includes: service.includes,
        includesTitle: service.includesTitle,
        includesDescription: service.includesDescription,
        highlightsTitle: service.highlightsTitle,
        highlights: service.highlights,
        gallery: service.gallery,
        galleryTitle: service.galleryTitle,
        galleryDescription: service.galleryDescription,
    };
}

export const superSecuriteServicePages: Record<
    SuperSecuriteServiceId,
    ServicePageContent
> = {
    entreprise: toServicePageContent('entreprise'),
    residence: toServicePageContent('residence'),
    chantiers: toServicePageContent('chantiers'),
    'zones-minieres': toServicePageContent('zones-minieres'),
};
