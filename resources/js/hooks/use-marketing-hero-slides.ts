import {
    marketingHeroSlides,
    type MarketingHeroVariant,
} from '@/data/marketing-hero-variants';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';

type SlideCopy = {
    label?: string;
    title?: string;
    highlight?: string;
    description?: string;
    primary_cta?: string;
    secondary_cta?: string;
    image_alt?: string;
    nav_label?: string;
    stats?: Array<{ label?: string; value?: string }>;
};

/**
 * Slides du carrousel d'accueil localisés.
 */
export function useMarketingHeroSlides(): {
    slides: MarketingHeroVariant[];
    labels: string[];
    carouselAria: string;
} {
    const { t, tNode } = useTrans();
    const localized = useLocalizedUrl();

    const slides = marketingHeroSlides.map((slide) => {
        const copy = tNode<SlideCopy>(`home_hero.${slide.id}`, {});

        return {
            ...slide,
            label: copy.label ?? slide.label,
            title: copy.title ?? slide.title,
            highlight: copy.highlight ?? slide.highlight,
            description: copy.description ?? slide.description,
            imageAlt: copy.image_alt ?? slide.imageAlt,
            primaryCta: {
                ...slide.primaryCta,
                label: copy.primary_cta ?? slide.primaryCta.label,
                href: slide.primaryCta.href.startsWith('#')
                    ? slide.primaryCta.href
                    : localized(slide.primaryCta.href),
            },
            secondaryCta: slide.secondaryCta
                ? {
                      ...slide.secondaryCta,
                      label:
                          copy.secondary_cta ?? slide.secondaryCta.label,
                      href: slide.secondaryCta.href.startsWith('#')
                          ? slide.secondaryCta.href
                          : localized(slide.secondaryCta.href),
                  }
                : undefined,
            stats: slide.stats.map((stat, index) => ({
                label: copy.stats?.[index]?.label ?? stat.label,
                value: copy.stats?.[index]?.value ?? stat.value,
            })),
        };
    });

    const labels = slides.map((slide) => {
        const copy = tNode<SlideCopy>(`home_hero.${slide.id}`, {});

        return (
            copy.nav_label ??
            (slide.id === 'excellence'
                ? t('home_hero.excellence.nav_label', 'Confiance')
                : slide.label)
        );
    });

    return {
        slides,
        labels,
        carouselAria: t(
            'home_hero.carousel_aria',
            "Messages d'accueil Super Sécurité",
        ),
    };
}
