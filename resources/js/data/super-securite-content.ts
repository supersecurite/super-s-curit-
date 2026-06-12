import { superSecuriteHoursLong, superSecuriteHoursTitle } from '@/data/super-securite-hours';
import {
    Award,
    Building2,
    Clock,
    HardHat,
    Home,
    Mountain,
    Users,
    Zap,
    type LucideIcon,
} from 'lucide-react';

export type SuperSecuriteService = {
    id: string;
    icon: LucideIcon;
    title: string;
    description: string;
    path: string;
};

export const superSecuriteServicesSection = {
    sectionLabel: 'Nos services',
    intro:
        'Super Sécurité accompagne particuliers et professionnels avec des solutions de sécurité, de surveillance et de gardiennage conçues pour protéger les personnes, les biens et les activités.',
} as const;

export const superSecuriteServices: readonly SuperSecuriteService[] = [
    {
        id: 'entreprise',
        icon: Building2,
        title: 'Sécurité entreprise',
        description:
            `Protection de vos locaux professionnels : bureaux, commerces et entrepôts avec des agents qualifiés, disponibles ${superSecuriteHoursLong}.`,
        path: '/entreprise',
    },
    {
        id: 'residence',
        icon: Home,
        title: 'Sécurité résidence',
        description:
            'Tranquillité d’esprit pour villas, immeubles et résidences grâce à une surveillance rigoureuse et une présence dissuasive.',
        path: '/residence',
    },
    {
        id: 'chantiers',
        icon: HardHat,
        title: 'Sécurité chantiers',
        description:
            'Sécurisation de vos chantiers BTP : protection du matériel, contrôle des accès et rondes régulières sur site.',
        path: '/chantiers',
    },
    {
        id: 'zones-minieres',
        icon: Mountain,
        title: 'Zones minières',
        description:
            'Surveillance rigoureuse des sites miniers avec des équipes formées aux protocoles de sécurité les plus stricts.',
        path: '/zones-minieres',
    },
] as const;

export type SuperSecuriteAdvantage = {
    icon: LucideIcon;
    title: string;
    description: string;
};

export const superSecuriteAdvantages: readonly SuperSecuriteAdvantage[] = [
    {
        icon: Award,
        title: 'Expérience et professionnalisme',
        description:
            'Une équipe d’experts en sécurité privée, formée aux standards les plus exigeants du secteur.',
    },
    {
        icon: Zap,
        title: "Rapidité d'intervention",
        description:
            'Réactivité et déploiement rapide pour sécuriser vos sites, chantiers et installations.',
    },
    {
        icon: Clock,
        title: superSecuriteHoursTitle,
        description:
            `Intervention ${superSecuriteHoursLong} pour garantir votre protection et celle de vos biens.`,
    },
    {
        icon: Users,
        title: 'Équipe certifiée et formée',
        description:
            'Agents certifiés, habitués aux environnements professionnels, résidentiels, chantiers et miniers.',
    },
] as const;

export const superSecuriteWhyUsModern = {
    sectionLabel: 'Pourquoi nous choisir',
    title: 'Une sécurité moderne, transparente et efficace',
    intro:
        "Nous combinons l'expertise humaine et la technologie pour offrir à nos clients un service de sécurité performant et réactif.",
    reasons: [
        'Une société de sécurité agréée et conforme à la réglementation guinéenne',
        'Des agents rigoureusement sélectionnés et formés',
        'Une supervision permanente pour garantir la qualité du service',
        'Une application dédiée pour un suivi transparent et en temps réel',
        'Une présence locale et une grande réactivité partout en Guinée',
        'Une expertise reconnue dans la sécurité des mines, entreprises, résidences et chantiers',
    ],
    appSectionTitle: 'Notre application mobile',
    appLead: 'Notre application dédiée permet notamment à nos clients de :',
    appFeatures: [
        'Signaler rapidement un incident ou un manquement',
        'Suivre le traitement des demandes en temps réel',
        'Communiquer directement avec nos équipes',
        'Accéder aux informations et rapports liés à leur site',
        "Bénéficier d'un meilleur suivi de la qualité de service",
    ],
    conclusion:
        'Cette approche garantit davantage de transparence, de réactivité et de contrôle.',
} as const;

export type SuperSecuriteTestimonial = {
    quote: string;
    author: string;
};

export const superSecuriteTestimonials: readonly SuperSecuriteTestimonial[] = [
    {
        quote:
            'Avec Super Sécurité, nous avons trouvé un partenaire fiable et professionnel. Leur présence constante a été déterminante pour sécuriser nos installations.',
        author: 'Entreprise — Global Archer',
    },
    {
        quote:
            `Le professionnalisme des agents de Super Sécurité est exemplaire. Ils sont disponibles ${superSecuriteHoursLong} et leur réactivité est irréprochable.`,
        author: 'Client résidentiel',
    },
    {
        quote:
            "Super Sécurité a assuré la surveillance de notre site industriel avec un professionnalisme remarquable. Leur présence a considérablement réduit les risques de vols et d'incidents.",
        author: 'Entreprise — DGI',
    },
] as const;

export const superSecuriteFooterServices = [
    'Sécurité entreprise — bureaux et commerces',
    'Sécurité résidence — villas et immeubles',
    'Sécurité chantiers — sites BTP',
    'Zones minières — sites sensibles',
    'Vidéos et télé surveillance',
] as const;

export const superSecuriteWelcome = {
    title: 'Votre partenaire de confiance en sécurité privée en Guinée',
    paragraphs: [
        'La sécurité est un enjeu majeur pour les entreprises, les résidences, les chantiers et les sites industriels. Chez Super Sécurité, nous mettons à votre disposition des solutions de sécurité fiables, professionnelles et adaptées aux réalités du terrain en Guinée.',
        "Entreprise légalement établie et titulaire de l'ensemble des agréments et autorisations requis pour l'exercice des activités de sécurité privée en République de Guinée, Super Sécurité accompagne ses clients avec le plus haut niveau de professionnalisme et de conformité réglementaire.",
        "Grâce à nos agents qualifiés, à notre encadrement opérationnel rigoureux et à nos outils technologiques modernes, nous assurons la protection des personnes, des biens et des infrastructures stratégiques sur l'ensemble du territoire national.",
    ],
} as const;
