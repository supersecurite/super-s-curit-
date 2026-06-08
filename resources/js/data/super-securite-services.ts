import { superSecuriteServices } from '@/data/super-securite-content';
import { superSecuriteHoursLong, superSecuriteHoursShort } from '@/data/super-securite-hours';
import { superSecuriteZoneLabel } from '@/data/super-securite-zone';
import { superSecuriteStock } from '@/data/super-securite-stock';

export type SuperSecuriteServiceId =
    | 'entreprise'
    | 'residence'
    | 'chantiers'
    | 'zones-minieres';

export type SuperSecuriteServiceSection = {
    title: string;
    description: string;
};

export type SuperSecuriteServiceDefinition = {
    id: SuperSecuriteServiceId;
    path: string;
    icon: string;
    cover: string;
    title: string;
    navLabel: string;
    navTagline: string;
    cardDescription: string;
    pageLabel: string;
    pageTitle: string;
    pageHighlight: string;
    pageDescription: string;
    imageAlt: string;
    focusKeyword: string;
    metaTitle: string;
    metaDescription: string;
    benefits: readonly string[];
    sections: readonly SuperSecuriteServiceSection[];
};

const serviceImages = superSecuriteStock.home.services;

const serviceMeta: Record<
    SuperSecuriteServiceId,
    Pick<
        SuperSecuriteServiceDefinition,
        | 'focusKeyword'
        | 'metaTitle'
        | 'metaDescription'
        | 'benefits'
        | 'sections'
        | 'pageHighlight'
        | 'pageDescription'
        | 'imageAlt'
        | 'cover'
    >
> = {
    entreprise: {
        focusKeyword: 'sécurité entreprise Conakry',
        metaTitle: 'Sécurité entreprise Conakry | Super Sécurité',
        metaDescription:
            `Sécurité entreprise à ${superSecuriteZoneLabel} : gardiennage et surveillance pour bureaux, commerces et entrepôts, ${superSecuriteHoursLong}.`,
        pageHighlight: 'entreprise',
        pageDescription:
            `Protection de vos locaux professionnels avec des agents qualifiés, disponibles ${superSecuriteHoursLong}.`,
        imageAlt: 'Sécurité entreprise — Super Sécurité Conakry',
        cover: `/${serviceImages.entreprise}`,
        benefits: [
            'Bureaux & commerces',
            'Contrôle d’accès',
            `Disponible ${superSecuriteHoursShort}`,
        ],
        sections: [
            {
                title: 'Présence sur site',
                description:
                    'Des équipes mobilisables en permanence pour sécuriser vos accès, halls et espaces sensibles.',
            },
            {
                title: 'Protocoles adaptés',
                description:
                    'Consignes claires, rondes régulières et reporting selon vos exigences opérationnelles.',
            },
            {
                title: 'Réactivité',
                description:
                    'Intervention rapide en cas d’incident et coordination avec vos équipes internes.',
            },
        ],
    },
    residence: {
        focusKeyword: 'gardiennage résidence Conakry',
        metaTitle: 'Sécurité résidence Conakry | Super Sécurité',
        metaDescription:
            `Gardiennage et surveillance de résidences à ${superSecuriteZoneLabel} : villas, immeubles et lotissements protégés ${superSecuriteHoursLong}.`,
        pageHighlight: 'résidence',
        pageDescription:
            'Tranquillité d’esprit pour vos villas et immeubles grâce à une surveillance rigoureuse et dissuasive.',
        imageAlt: 'Sécurité résidence — Super Sécurité Conakry',
        cover: `/${serviceImages.residence}`,
        benefits: [
            'Villas & immeubles',
            'Surveillance continue',
            'Agents de confiance',
        ],
        sections: [
            {
                title: 'Protection du domicile',
                description:
                    'Présence dissuasive aux accès, parkings et espaces communs de votre résidence.',
            },
            {
                title: 'Surveillance nocturne',
                description:
                    'Rondes régulières et vigilance accrue aux heures les plus sensibles.',
            },
            {
                title: 'Accompagnement sur mesure',
                description:
                    'Des consignes adaptées à la taille de votre résidence et à vos habitudes.',
            },
        ],
    },
    chantiers: {
        focusKeyword: 'sécurité chantier Guinée',
        metaTitle: `Sécurité chantiers BTP | Super Sécurité — ${superSecuriteZoneLabel}`,
        metaDescription:
            `Sécurité de chantiers BTP à ${superSecuriteZoneLabel} : protection du matériel, contrôle des accès et patrouilles sur site.`,
        pageHighlight: 'chantiers',
        pageDescription:
            'Sécurisation de vos chantiers BTP avec contrôle des accès, patrouilles et protection du matériel.',
        imageAlt: `Sécurité chantiers — Super Sécurité ${superSecuriteZoneLabel}`,
        cover: `/${serviceImages.chantiers}`,
        benefits: [
            'Chantiers BTP',
            'Protection matériel',
            'Patrouilles régulières',
        ],
        sections: [
            {
                title: 'Sites en construction',
                description:
                    'Sécurisation adaptée aux environnements de chantier, avec gestion des flux ouvriers et livraisons.',
            },
            {
                title: 'Prévention des vols',
                description:
                    'Présence dissuasive pour limiter le vol de matériaux, équipements et intrusions nocturnes.',
            },
            {
                title: 'Contrôle des accès',
                description:
                    'Filtrage à l’entrée et traçabilité des personnes autorisées sur le site.',
            },
        ],
    },
    'zones-minieres': {
        focusKeyword: 'sécurité minière Guinée',
        metaTitle: `Sécurité zones minières | Super Sécurité — ${superSecuriteZoneLabel}`,
        metaDescription:
            `Sécurité des zones minières à ${superSecuriteZoneLabel} : équipes formées aux protocoles les plus stricts pour sites sensibles.`,
        pageHighlight: 'minières',
        pageDescription:
            'Surveillance rigoureuse des sites miniers avec des équipes formées aux protocoles de sécurité exigeants.',
        imageAlt: `Sécurité zones minières — Super Sécurité ${superSecuriteZoneLabel}`,
        cover: `/${serviceImages['zones-minieres']}`,
        benefits: [
            'Sites miniers',
            'Protocoles stricts',
            'Équipes spécialisées',
        ],
        sections: [
            {
                title: 'Environnements à risque',
                description:
                    'Protection adaptée aux sites miniers et installations sensibles en zone isolée.',
            },
            {
                title: 'Conformité opérationnelle',
                description:
                    'Respect des consignes HSE et des procédures imposées par vos responsables de site.',
            },
            {
                title: 'Réduction des incidents',
                description:
                    'Présence dissuasive et réactive pour limiter vols, intrusions et incidents de sécurité.',
            },
        ],
    },
};

export const superSecuriteServiceDefinitions: readonly SuperSecuriteServiceDefinition[] =
    superSecuriteServices.map((service) => {
        const meta = serviceMeta[service.id as SuperSecuriteServiceId];

        return {
            id: service.id as SuperSecuriteServiceId,
            path: service.path,
            icon: '',
            title: service.title,
            navLabel: service.title.replace('Sécurité ', ''),
            navTagline: `Sécurité privée à ${superSecuriteZoneLabel}`,
            cardDescription: service.description,
            pageLabel: service.title,
            pageTitle: service.title.replace('Sécurité ', 'Sécurité '),
            ...meta,
        };
    });

export const superSecuriteServiceById: Record<
    SuperSecuriteServiceId,
    SuperSecuriteServiceDefinition
> = Object.fromEntries(
    superSecuriteServiceDefinitions.map((service) => [service.id, service]),
) as Record<SuperSecuriteServiceId, SuperSecuriteServiceDefinition>;

export const superSecuriteServiceIds: readonly SuperSecuriteServiceId[] =
    superSecuriteServiceDefinitions.map((service) => service.id);
