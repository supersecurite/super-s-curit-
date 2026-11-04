import { superSecuriteContactHeroCopy } from '@/data/super-securite-contact';
import { superSecuriteStock } from '@/data/super-securite-stock';
import { superSecuriteHoursLong, superSecuriteHoursShort } from '@/data/super-securite-hours';
import { superSecuriteZoneLabel } from '@/data/super-securite-zone';

export type MarketingPageHeroStat = {
    label: string;
    value: string;
};

export type MarketingPageHeroPattern =
    | 'actualites'
    | 'conseils'
    | 'devenir-agent'
    | 'carrieres'
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
        titleTrail: 'sur la sécurité',
        description:
            'Missions sur le terrain, retours d\'expérience, conseils pratiques et nouveautés.',
        image: superSecuriteStock.pages.actualites,
        imageAlt: 'Actualités Super Sécurité — sécurité privée',
        stats: [
            { label: 'Contenus', value: 'Articles & dossiers' },
            { label: 'Zone', value: superSecuriteZoneLabel },
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
            `Agents qualifiés, missions variées et évolution possible au sein du réseau Super Sécurité à ${superSecuriteZoneLabel}. Inscrivez-vous dès maintenant.`,
        image: superSecuriteStock.pages.devenirAgent,
        imageAlt: `Recrutement agents Super Sécurité — ${superSecuriteZoneLabel}`,
        stats: [
            { label: 'Missions', value: 'Entreprise & terrain' },
            { label: 'Disponibilité', value: superSecuriteHoursShort },
            { label: 'Zone', value: superSecuriteZoneLabel },
        ],
    },
    carrieres: {
        id: 'carrieres',
        pattern: 'carrieres',
        layout: 'default',
        underline: 'grow',
        label: 'Carrières',
        titleLead: 'Rejoignez une',
        titleHighlight: 'équipe engagée',
        titleTrail: '',
        description:
            `Développez votre carrière dans un environnement qui contribue à la sécurité de tous au quotidien à ${superSecuriteZoneLabel}.`,
        image: superSecuriteStock.pages.devenirAgent,
        imageAlt: `Carrières Super Sécurité — ${superSecuriteZoneLabel}`,
        stats: [
            { label: 'Missions', value: 'Entreprise & terrain' },
            { label: 'Disponibilité', value: superSecuriteHoursShort },
            { label: 'Zone', value: superSecuriteZoneLabel },
        ],
    },
    contact: {
        id: 'contact',
        pattern: 'contact',
        layout: 'reverse',
        underline: 'double',
        ...superSecuriteContactHeroCopy,
        image: superSecuriteStock.pages.contact,
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
        label: 'POURQUOI',
        titleLead: 'Choisir Super',
        titleHighlight: 'SÉCURITÉ ?',
        titleTrail: '',
        description:
            `Expérience terrain, réactivité et disponibilité ${superSecuriteHoursLong} — Super Sécurité protège entreprises et particuliers avec une équipe certifiée, engagée et proche de vos enjeux à ${superSecuriteZoneLabel}.`,
        image: superSecuriteStock.pages.about,
        imageAlt: 'Super Sécurité — sécurité privée',
        stats: [
            { label: 'Disponibilité', value: superSecuriteHoursShort },
            { label: 'Zone', value: superSecuriteZoneLabel },
            { label: 'Engagement', value: 'Équipe certifiée' },
        ],
    },
    galerie: {
        id: 'galerie',
        pattern: 'actualites',
        layout: 'reverse',
        underline: 'draw',
        label: 'Nos missions en images',
        titleLead: 'Découvrez notre',
        titleHighlight: 'galerie',
        titleTrail: 'sur le terrain',
        description:
            'Photos de nos équipes en action : entreprises, résidences, chantiers et zones minières partout en Guinée.',
        image: superSecuriteStock.pages.about,
        imageAlt: 'Galerie Super Sécurité — missions sur le terrain',
        stats: [
            { label: 'Services', value: '4 expertises' },
            { label: 'Zone', value: superSecuriteZoneLabel },
            { label: 'Terrain', value: 'Photos réelles' },
        ],
    },
} satisfies Record<string, MarketingPageHeroConfig>;

export type MarketingPageHeroKey = keyof typeof marketingPageHeroes;
