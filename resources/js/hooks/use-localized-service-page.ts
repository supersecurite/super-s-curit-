import {
    superSecuriteServicePages,
    type ServicePageContent,
} from '@/data/super-securite-service-pages';
import type { SuperSecuriteServiceId } from '@/data/super-securite-services';
import { useTrans } from '@/hooks/use-trans';

type ServiceCopy = {
    hero_title_lead?: string;
    hero_title_highlight?: string;
    hero_description?: string;
    hero_image_alt?: string;
    hero_stats?: Array<{ label?: string; value?: string }>;
    intro?: string[];
    intro_indicators?: string[];
    sections_title?: string;
    sections?: Array<{ title?: string; description?: string }>;
    gallery_title?: string;
    gallery_description?: string;
    highlights_title?: string;
    highlights?: string[];
};

/**
 * Contenu de page service localisé (héros, intro, sections, galerie).
 */
export function useLocalizedServicePage(
    serviceId: SuperSecuriteServiceId,
): ServicePageContent {
    const { tNode } = useTrans();
    const base = superSecuriteServicePages[serviceId];
    const copy = tNode<ServiceCopy>(`services.${serviceId}`, {});

    return {
        ...base,
        hero: {
            ...base.hero,
            titleLead: copy.hero_title_lead ?? base.hero.titleLead,
            titleHighlight:
                copy.hero_title_highlight ?? base.hero.titleHighlight,
            description: copy.hero_description ?? base.hero.description,
            imageAlt: copy.hero_image_alt ?? base.hero.imageAlt,
            stats: base.hero.stats.map((stat, index) => ({
                label: copy.hero_stats?.[index]?.label ?? stat.label,
                value: copy.hero_stats?.[index]?.value ?? stat.value,
            })),
        },
        intro: copy.intro ?? base.intro,
        introIndicators: copy.intro_indicators ?? base.introIndicators,
        sectionsTitle: copy.sections_title ?? base.sectionsTitle,
        sections: base.sections.map((section, index) => ({
            title: copy.sections?.[index]?.title ?? section.title,
            description:
                copy.sections?.[index]?.description ?? section.description,
        })),
        galleryTitle: copy.gallery_title ?? base.galleryTitle,
        galleryDescription:
            copy.gallery_description ?? base.galleryDescription,
        highlightsTitle: copy.highlights_title ?? base.highlightsTitle,
        highlights: copy.highlights ?? base.highlights,
    };
}
