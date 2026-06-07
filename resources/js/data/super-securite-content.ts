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

export const superSecuriteServices: readonly SuperSecuriteService[] = [
    {
        id: 'entreprise',
        icon: Building2,
        title: 'Sécurité entreprise',
        description:
            'Protection de vos locaux professionnels : bureaux, commerces et entrepôts avec des agents qualifiés, disponibles 24h/24.',
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
        title: 'Disponibilité 24/7',
        description:
            'Intervention 24h/24 et 7j/7 pour garantir votre protection et celle de vos biens.',
    },
    {
        icon: Users,
        title: 'Équipe certifiée et formée',
        description:
            'Agents certifiés, habitués aux environnements professionnels, résidentiels, chantiers et miniers.',
    },
] as const;

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
            'Le professionnalisme des agents de Super Sécurité est exemplaire. Ils sont disponibles en tout temps (24H/7) et leur réactivité est irréprochable.',
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
    title: 'Bienvenue chez Super SÉCURITÉ',
    paragraphs: [
        'La sécurité est un besoin fondamental, et chez Super Sécurité, nous nous engageons à protéger ce qui compte le plus pour vous. Que vous soyez une entreprise, un particulier ou un site sensible, nous avons les solutions adaptées à vos besoins.',
        'Super Sécurité, c’est une équipe d’experts en sécurité privée, prêts à intervenir 24h/24 et 7j/7 pour garantir votre protection et celle de vos biens.',
    ],
} as const;
