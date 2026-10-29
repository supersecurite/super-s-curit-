import type { SuperSecuriteServiceId } from '@/data/super-securite-services';

/** Visuels V2 : hero illustré, scène métier et contexte opérationnel. */
export const serviceV2Images: Record<
    SuperSecuriteServiceId,
    { hero: string; intro: string; band: string }
> = {
    entreprise: {
        hero: '/images/super-securite/enterprise-v2-hero.jpg',
        intro: '/images/super-securite/enterprise-v2-entrance.jpg',
        band: '/images/super-securite/about-v2-supervision.jpg',
    },
    residence: {
        hero: '/images/super-securite/residence-v2-hero.jpg',
        intro: '/images/super-securite/residence-v2-detail.jpg',
        band: '/images/super-securite/residence-v2-evening.jpg',
    },
    chantiers: {
        hero: '/images/super-securite/chantiers-v2-hero.jpg',
        intro: '/images/super-securite/chantiers-v2-detail.jpg',
        band: '/images/super-securite/chantier-structure-beton-echafaudage-equipe.jpeg',
    },
    'zones-minieres': {
        hero: '/images/super-securite/zones-minieres-v2-hero.jpg',
        intro: '/images/super-securite/zones-minieres-v2-detail.jpg',
        band: '/images/super-securite/installation-industrielle-convoyeurs-miniers.jpeg',
    },
};
