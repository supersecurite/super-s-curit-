import { superSecuriteImages } from '@/data/super-securite-images';
import { superSecuriteStock } from '@/data/super-securite-stock';
import { superSecuriteServices } from '@/data/super-securite-content';
import {
    superSecuriteHoursLong,
    superSecuriteHoursShort,
} from '@/data/super-securite-hours';
import { superSecuriteZoneLabel } from '@/data/super-securite-zone';
import { contact } from '@/routes';

export type HeroSlideLayout = 'split-right' | 'split-left';

export type HeroSlideTypography = 'underline' | 'gradient' | 'accent-block' | 'split-lines';

export type MarketingHeroVariant = {
    id: string;
    layout: HeroSlideLayout;
    typography: HeroSlideTypography;
    label: string;
    title: string;
    highlight: string;
    description: string;
    primaryCta: {
        label: string;
        href: string;
    };
    secondaryCta: {
        label: string;
        href: string;
    };
    image: string;
    imageAlt: string;
    backgroundImage: string;
    stats: readonly {
        label: string;
        value: string;
    }[];
};

const serviceImages = superSecuriteStock.home.services;

const serviceSlideConfigs: Record<
    string,
    Pick<
        MarketingHeroVariant,
        'layout' | 'typography' | 'title' | 'highlight' | 'stats'
    >
> = {
    entreprise: {
        layout: 'split-left',
        typography: 'gradient',
        title: 'Protégez vos locaux',
        highlight: 'professionnels',
        stats: [
            { label: 'Surveillance', value: 'Continue' },
            { label: 'Zone', value: superSecuriteZoneLabel },
            { label: 'Équipes', value: 'Formées & certifiées' },
        ],
    },
    chantiers: {
        layout: 'split-left',
        typography: 'accent-block',
        title: 'Vos chantiers',
        highlight: 'sous contrôle',
        stats: [
            { label: 'Secteurs', value: 'BTP & travaux' },
            { label: 'Patrouilles', value: 'Régulières' },
            { label: 'Réactivité', value: superSecuriteHoursShort },
        ],
    },
    'zones-minieres': {
        layout: 'split-right',
        typography: 'underline',
        title: 'Sites miniers',
        highlight: 'sécurisés',
        stats: [
            { label: 'Secteurs', value: 'Mines & sites sensibles' },
            { label: 'Protocoles', value: 'Sur mesure' },
            { label: 'Expertise', value: 'Terrain' },
        ],
    },
    residence: {
        layout: 'split-right',
        typography: 'accent-block',
        title: 'Sécurisez votre',
        highlight: 'résidence',
        stats: [
            { label: 'Protection', value: 'Villas & immeubles' },
            { label: 'Présence', value: 'Dissuasive' },
            { label: 'Disponibilité', value: superSecuriteHoursShort },
        ],
    },
};

const serviceSlides: MarketingHeroVariant[] = superSecuriteServices.map(
    (service) => {
        const config = serviceSlideConfigs[service.id];
        const imagePath =
            serviceImages[service.id as keyof typeof serviceImages];

        return {
            id: service.id,
            layout: config.layout,
            typography: config.typography,
            label: service.title,
            title: config.title,
            highlight: config.highlight,
            description: service.description,
            primaryCta: {
                label: 'Nous contacter',
                href: contact.url(),
            },
            secondaryCta: {
                label: 'En savoir plus',
                href: service.path,
            },
            image: `/${imagePath}`,
            imageAlt: `${service.title} — Super Sécurité`,
            backgroundImage: imagePath,
            stats: config.stats,
        };
    },
);

export const marketingHeroSlides: readonly MarketingHeroVariant[] = [
    {
        id: 'excellence',
        layout: 'split-right',
        typography: 'underline',
        label: 'Super SÉCURITÉ',
        title: 'Confiez votre sécurité',
        highlight: "à l'excellence",
        description:
            `Sécurité privée à ${superSecuriteZoneLabel} : entreprise, résidence, chantiers et zones minières. Intervention ${superSecuriteHoursLong}.`,
        primaryCta: {
            label: 'Nous contacter',
            href: contact.url(),
        },
        secondaryCta: {
            label: 'Nos offres',
            href: '#services',
        },
        image: superSecuriteStock.home.welcome,
        imageAlt: `Super Sécurité — agents de sécurité à ${superSecuriteZoneLabel}`,
        backgroundImage: superSecuriteStock.hero.background,
        stats: [
            { label: 'Disponibilité', value: superSecuriteHoursShort },
            { label: 'Zone', value: superSecuriteZoneLabel },
            { label: 'Expertise', value: 'Sécurité privée' },
        ],
    },
    ...serviceSlides,
] as const;

export const marketingHeroSlideLabels = marketingHeroSlides.map((slide) => {
    if (slide.id === 'excellence') {
        return 'Excellence';
    }

    const service = superSecuriteServices.find((item) => item.id === slide.id);

    return service?.title.replace('Sécurité ', '') ?? slide.label;
}) as readonly string[];
