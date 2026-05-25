/**
 * Images d'illustration provisoires depuis Unsplash.
 *
 * À REMPLACER plus tard par des images locales (clients, équipe, projets).
 * Centralisées ici pour faciliter la substitution.
 *
 * Format des URLs : `https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w={width}&q={quality}`
 */

const unsplash = (id: string, width = 1600, quality = 80) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=${quality}`;

export const aristechStock = {
    hero: {
        workspace: unsplash('1517694712202-14dd9538aa97', 1400),
        codeScreen: unsplash('1555066931-4365d14bab8c', 1400),
        teamCollab: unsplash('1522071820081-009f0129c71c', 1400),
    },

    services: {
        applications: '/images/aristech/services/conakry-women-app.png',
        websites: '/images/aristech/services/Sites-Internet.jpg',
        ecommerce: '/images/aristech/services/E-commerce.jpg',
        api: '/images/aristech/services/API.jpg',
    },

    about: {
        heroSide: '/images/aristech/about/hero.jpg',
        story: unsplash('1559028012-481c04fa702d', 1200),
        valuesBanner: '/images/aristech/about/Happy-young-woman-pointing-fingers.png',
        processBanner: unsplash('1552664730-d307ca884978', 1800),
    },

    contact: {
        heroSide: '/images/aristech/hero/Vision-thinking-and-black-woman-with-schedule-planning-and-agenda.jpg',
        sidePanel: unsplash('1521737711867-e3b97375f902', 900),
    },
} as const;
