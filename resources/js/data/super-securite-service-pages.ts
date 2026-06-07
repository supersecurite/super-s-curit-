import {
    superSecuriteServiceById,
    type SuperSecuriteServiceId,
} from '@/data/super-securite-services';

export type ServicePageContent = {
    label: string;
    title: string;
    highlightedTitle: string;
    description: string;
    image: string;
    imageAlt: string;
    benefits: string[];
    sections: {
        title: string;
        description: string;
    }[];
};

function toServicePageContent(id: SuperSecuriteServiceId): ServicePageContent {
    const service = superSecuriteServiceById[id];

    return {
        label: service.pageLabel,
        title: service.pageTitle,
        highlightedTitle: service.pageHighlight,
        description: service.pageDescription,
        image: service.cover,
        imageAlt: service.imageAlt,
        benefits: [...service.benefits],
        sections: service.sections.map((section) => ({ ...section })),
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
