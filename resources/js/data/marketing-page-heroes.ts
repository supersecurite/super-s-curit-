import { superSecuriteStock } from '@/data/super-securite-stock';

export type MarketingPageHeroStat = {
    label: string;
    value: string;
};

export type MarketingPageHeroPattern =
    | 'actualites'
    | 'conseils'
    | 'devenir-agent'
    | 'contact'
    | 'about';

export type MarketingPageHeroLayout = 'default' | 'reverse';

export type MarketingPageHeroUnderline =
    | 'draw'
    | 'slide'
    | 'grow'
    | 'double'
    | 'scan';

export type MarketingPageHeroConfig = {
    id: string;
    pattern: MarketingPageHeroPattern;
    layout: MarketingPageHeroLayout;
    underline: MarketingPageHeroUnderline;
    label: string;
    titleLead: string;
    titleHighlight: string;
    titleTrail?: string;
    description: string;
    image: string;
    imageAlt: string;
    stats?: readonly MarketingPageHeroStat[];
};

export const marketingPageHeroes = {
    actualites: {
        id: 'actualites',
        pattern: 'actualites',
        layout: 'reverse',
        underline: 'draw',
        label: 'Veille & terrain',
        titleLead: 'Restez informés de',
        titleHighlight: "l'actualité",
        titleTrail: 'sécurité en Guinée',
        description:
            'Missions sur le terrain, retours d\'expérience, conseils pratiques et nouveautés Super Sécurité — l\'essentiel pour anticiper et réagir.',
        image: superSecuriteStock.pages.actualites,
        imageAlt: 'Actualités Super Sécurité — sécurité privée',
        stats: [
            { label: 'Contenus', value: 'Articles & dossiers' },
            { label: 'Zone', value: 'Conakry & Guinée' },
            { label: 'Expertise', value: 'Sécurité privée' },
        ],
    },
    conseils: {
        id: 'conseils',
        pattern: 'conseils',
        layout: 'default',
        underline: 'slide',
        label: 'Prévention & bonnes pratiques',
        titleLead: 'Anticipez les risques avec nos',
        titleHighlight: 'conseils',
        titleTrail: 'sécurité',
        description:
            'Guides clairs et recommandations concrètes pour protéger entreprises, résidences, chantiers et zones sensibles — rédigés par nos équipes.',
        image: superSecuriteStock.pages.conseils,
        imageAlt: 'Conseils de sécurité Super Sécurité',
        stats: [
            { label: 'Thèmes', value: 'Prévention & surveillance' },
            { label: 'Lecture', value: 'Guides pratiques' },
            { label: 'Public', value: 'Pro & particuliers' },
        ],
    },
    devenirAgent: {
        id: 'devenir-agent',
        pattern: 'devenir-agent',
        layout: 'default',
        underline: 'grow',
        label: 'Carrières',
        titleLead: 'Rejoignez une équipe de',
        titleHighlight: 'professionnels',
        titleTrail: 'de la sécurité',
        description:
            'Agents qualifiés, missions variées et évolution possible au sein du réseau Super Sécurité en Guinée. Inscrivez-vous dès maintenant.',
        image: superSecuriteStock.pages.devenirAgent,
        imageAlt: 'Recrutement agents Super Sécurité — Guinée',
        stats: [
            { label: 'Missions', value: 'Entreprise & terrain' },
            { label: 'Disponibilité', value: 'Jour · nuit · 24h' },
            { label: 'Zone', value: 'Conakry & Guinée' },
        ],
    },
    contact: {
        id: 'contact',
        pattern: 'contact',
        layout: 'reverse',
        underline: 'double',
        label: 'Devis & urgence',
        titleLead: 'Sécurisons votre',
        titleHighlight: 'projet',
        titleTrail: 'ensemble',
        description:
            'Entreprise, résidence, chantier ou zone minière — décrivez votre besoin et obtenez une réponse rapide de nos experts à Lambanyi, Conakry.',
        image: superSecuriteStock.pages.contact2,
        imageAlt: 'Contact Super Sécurité — Lambanyi, Conakry',
        stats: [
            { label: 'Réponse', value: 'Sous 24h ouvrées' },
            { label: 'Bureau', value: 'Lambanyi, Conakry' },
            { label: 'Services', value: '4 expertises' },
        ],
    },
    about: {
        id: 'about',
        pattern: 'about',
        layout: 'default',
        underline: 'scan',
        label: 'Notre entreprise',
        titleLead: 'Choisir Super',
        titleHighlight: 'SÉCURITÉ',
        titleTrail: '',
        description:
            'Expérience terrain, réactivité et disponibilité 24h/24 — Super Sécurité protège entreprises et particuliers avec une équipe certifiée, engagée et proche de vos enjeux en Guinée.',
        image: superSecuriteStock.pages.about,
        imageAlt: 'Super Sécurité — sécurité privée',
        stats: [
            { label: 'Disponibilité', value: '24h/24 · 7j/7' },
            { label: 'Zone', value: 'Conakry & Guinée' },
            { label: 'Engagement', value: 'Équipe certifiée' },
        ],
    },
} satisfies Record<string, MarketingPageHeroConfig>;

export type MarketingPageHeroKey = keyof typeof marketingPageHeroes;
