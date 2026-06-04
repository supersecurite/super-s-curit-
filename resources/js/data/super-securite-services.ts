import { superSecuriteServices } from '@/data/super-securite-content';
import { superSecuriteImages } from '@/data/super-securite-images';

export type SuperSecuriteServiceId = 'gardiennage' | 'industriel' | 'evenementiel';

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
    >
> = {
    gardiennage: {
        focusKeyword: 'gardiennage Conakry',
        metaTitle: 'Gardiennage et surveillance Conakry | Super Sécurité',
        metaDescription:
            'Gardiennage et surveillance à Conakry : agents professionnels pour bureaux, résidences, chantiers et zones sensibles, 24h/24.',
        pageHighlight: 'et surveillance',
        pageDescription:
            'Des agents de sécurité qualifiés pour protéger vos locaux, bureaux et résidences, de jour comme de nuit.',
        imageAlt: 'Gardiennage et surveillance par Super Sécurité à Conakry',
        benefits: [
            'Gardiennage 24h/24',
            'Surveillance résidence et bureau',
            'Agents qualifiés',
        ],
        sections: [
            {
                title: 'Présence continue',
                description:
                    'Des équipes mobilisables en permanence pour sécuriser vos accès et vos espaces sensibles.',
            },
            {
                title: 'Protocoles adaptés',
                description:
                    'Consignes claires, rondes régulières et reporting selon vos exigences opérationnelles.',
            },
        ],
    },
    industriel: {
        focusKeyword: 'sécurité industrielle Guinée',
        metaTitle: 'Sécurité industrielle et minière | Super Sécurité Guinée',
        metaDescription:
            'Sécurité des sites industriels et miniers en Guinée : équipes formées aux protocoles les plus stricts.',
        pageHighlight: 'industriels et miniers',
        pageDescription:
            'Surveillance rigoureuse de vos installations sensibles avec des protocoles de sécurité exigeants.',
        imageAlt: 'Sécurité industrielle et minière — Super Sécurité',
        benefits: [
            'Sites industriels',
            'Zones minières',
            'Protocoles stricts',
        ],
        sections: [
            {
                title: 'Installations sensibles',
                description:
                    'Protection adaptée aux environnements industriels, logistiques et miniers.',
            },
            {
                title: 'Réduction des risques',
                description:
                    'Présence dissuasive et réactive pour limiter vols, intrusions et incidents.',
            },
        ],
    },
    evenementiel: {
        focusKeyword: 'sécurité événementielle Conakry',
        metaTitle: 'Sécurité événementielle Conakry | Super Sécurité',
        metaDescription:
            'Sécurité événementielle à Conakry : gestion complète pour événements sportifs, culturels et privés.',
        pageHighlight: 'événementielle',
        pageDescription:
            'Gestion complète de la sécurité pour événements publics et privés, même en contexte de forte affluence.',
        imageAlt: 'Sécurité événementielle — Super Sécurité Conakry',
        benefits: [
            'Événements sportifs',
            'Événements culturels',
            'Haute exigence',
        ],
        sections: [
            {
                title: 'Plan de sécurité',
                description:
                    'Évaluation des flux, accès et points sensibles avant chaque événement.',
            },
            {
                title: 'Équipes expérimentées',
                description:
                    'Agents habitués aux situations de forte affluence et aux protocoles événementiels.',
            },
        ],
    },
};

export const superSecuriteServiceDefinitions: readonly SuperSecuriteServiceDefinition[] =
    superSecuriteServices.map((service) => {
        const meta = serviceMeta[service.id as SuperSecuriteServiceId];

        return {
            id: service.id as SuperSecuriteServiceId,
            path: `/#${service.id}`,
            icon: '',
            cover: superSecuriteImages.ogDefault,
            title: service.title,
            navLabel: service.title.split(' ').slice(0, 3).join(' '),
            navTagline: 'Sécurité privée à Conakry',
            cardDescription: service.description,
            pageLabel: service.title,
            pageTitle: service.title,
            ...meta,
        };
    });

export const superSecuriteServiceById: Record<
    SuperSecuriteServiceId,
    SuperSecuriteServiceDefinition
> = Object.fromEntries(
    superSecuriteServiceDefinitions.map((service) => [service.id, service]),
) as Record<SuperSecuriteServiceId, SuperSecuriteServiceDefinition>;
