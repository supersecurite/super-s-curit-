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

const placeholder = '/images/super-securite/placeholder.svg';

export const superSecuriteStock = {
    hero: {
        workspace: unsplash('1517694712202-14dd9538aa97', 1400),
        codeScreen: unsplash('1555066931-4365d14bab8c', 1400),
        teamCollab: unsplash('1522071820081-009f0129c71c', 1400),
        /** Image de fond hero — à remplacer */
        background: unsplash('1565514026859-015a002b7670', 1920),
    },

    /** Images page d'accueil — à remplacer par vos visuels */
    home: {
        welcome: '/images/super-securite/IMG_9007-scaled.jpg',
        welcome2: '/images/super-securite/IMG_9008-scaled.jpg',
        whyUsBanner: '/images/super-securite/llustration vectorielle une personne assise devant un ordinateur.jpg',
        whyUsBanner2: '/images/super-securite/choose-us-3.jpeg',
        whyUsBannerTransparent: '/images/super-securite/choose-us-3-transparent.png',
        services: {
            gardiennage: 'images/super-securite/services/IMG_9598.jpg',
            industriel: 'images/super-securite/services/Side-view-of-young-black-man-in-workwear-and-safety.jpg',
            evenementiel: 'images/super-securite/services/Foreman-engineer-male-supervisor.jpg',
        },
        testimonialAvatar: placeholder,
    },

    services: {
        applications: '/images/super-securite/services/conakry-women-app.png',
        websites: '/images/super-securite/services/Sites-Internet.jpg',
        ecommerce: '/images/super-securite/services/E-commerce.jpg',
        api: '/images/super-securite/services/API.jpg',
        seo: '/images/super-securite/services/seo.jpg',
    },

    about: {
        heroSide: '/images/super-securite/about/hero.jpg',
        story: '/images/super-securite/about/approche.jpg',
        // story: unsplash('1559028012-481c04fa702d', 1200),
        valuesBanner: '/images/super-securite/about/Happy-young-woman-pointing-fingers.png',
        processBanner: unsplash('1552664730-d307ca884978', 1800),
    },

    contact: {
        heroSide: '/images/super-securite/hero/collaboration.jpg',
        sidePanel: '/images/super-securite/contact.jpg',
        // sidePanel: unsplash('1521737711867-e3b97375f902', 900),
    },
} as const;
