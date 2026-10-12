import {
    marketingPageHeroes,
    type MarketingPageHeroConfig,
    type MarketingPageHeroKey,
    type MarketingPageHeroStat,
} from '@/data/marketing-page-heroes';
import { useTrans } from '@/hooks/use-trans';

const heroKeyMap: Record<MarketingPageHeroKey, string> = {
    actualites: 'actualites',
    conseils: 'conseils',
    devenirAgent: 'devenir_agent',
    contact: 'contact',
    about: 'about',
    galerie: 'galerie',
};

type HeroCopy = {
    label?: string;
    title_lead?: string;
    title_highlight?: string;
    title_trail?: string;
    description?: string;
    image_alt?: string;
    stats?: Array<{ label?: string; value?: string }>;
};

/**
 * Héros de page marketing localisé (structure TS + copy JSON).
 */
export function useMarketingPageHero(
    key: MarketingPageHeroKey,
): MarketingPageHeroConfig {
    const { tNode } = useTrans();
    const base = marketingPageHeroes[key];
    const copy = tNode<HeroCopy>(`heroes.${heroKeyMap[key]}`, {});

    const stats: MarketingPageHeroStat[] | undefined = base.stats
        ? base.stats.map((stat, index) => ({
              label: copy.stats?.[index]?.label ?? stat.label,
              value: copy.stats?.[index]?.value ?? stat.value,
          }))
        : undefined;

    return {
        ...base,
        label: copy.label ?? base.label,
        titleLead: copy.title_lead ?? base.titleLead,
        titleHighlight: copy.title_highlight ?? base.titleHighlight,
        titleTrail: copy.title_trail ?? base.titleTrail,
        description: copy.description ?? base.description,
        imageAlt: copy.image_alt ?? base.imageAlt,
        stats,
    };
}
