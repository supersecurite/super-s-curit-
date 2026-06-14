import { superSecuriteHoursLong, superSecuriteHoursTitle } from '@/data/super-securite-hours';
import { superSecuriteStock } from '@/data/super-securite-stock';
import {
    Award,
    Building2,
    ClipboardCheck,
    Clock,
    HardHat,
    Home,
    MapPin,
    Mountain,
    ShieldCheck,
    Smartphone,
    UserCheck,
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
        {
            label: 'Signaler rapidement un incident ou un manquement',
            anchor: 'application',
        },
        {
            label: 'Suivre le traitement des demandes en temps réel',
            anchor: 'application',
        },
        {
            label: 'Communiquer directement avec nos équipes',
            anchor: 'application',
        },
        {
            label: 'Accéder aux informations et rapports liés à leur site',
            anchor: 'application',
        },
        {
            label: "Bénéficier d'un meilleur suivi de la qualité de service",
            anchor: 'supervision',
        },
    ] as const,
    conclusion:
        'Cette approche garantit davantage de transparence, de réactivité et de contrôle.',
} as const;

export type SuperSecuriteWhyUsDetail = {
    id: string;
    icon: LucideIcon;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
};

export const superSecuriteWhyUsDetails: readonly SuperSecuriteWhyUsDetail[] = [
    {
        id: 'agrement',
        icon: ShieldCheck,
        title: 'Une société de sécurité agréée et conforme à la réglementation guinéenne',
        description:
            'Faire appel à Super Sécurité, c’est choisir une entreprise qui exerce légalement ses activités en République de Guinée. Nous disposons des agréments et autorisations requis pour fournir des prestations de sécurité privée aux entreprises, aux résidences, aux chantiers et aux sites industriels. Cette conformité garantit à nos clients un partenaire fiable, responsable et engagé dans le respect des normes professionnelles du secteur.',
        image: superSecuriteStock.pages.about,
        imageAlt: 'Super Sécurité — société de sécurité agréée en Guinée',
    },
    {
        id: 'agents',
        icon: UserCheck,
        title: 'Des agents rigoureusement sélectionnés et formés',
        description:
            'La qualité de nos services repose sur la compétence de nos agents. Chaque collaborateur est recruté selon des critères stricts de moralité, de discipline et de professionnalisme. Nos agents bénéficient d’une formation adaptée aux réalités du terrain, notamment en matière de contrôle d’accès, de surveillance, de prévention des incidents, de gestion des visiteurs et de relation client. Cette préparation leur permet d’assurer efficacement la sécurité des personnes et des biens qui nous sont confiés.',
        image: superSecuriteStock.home.services.entreprise,
        imageAlt: 'Agent de sécurité Super Sécurité en poste',
    },
    {
        id: 'supervision',
        icon: ClipboardCheck,
        title: 'Une supervision permanente pour garantir la qualité du service',
        description:
            'Chez Super Sécurité, nos prestations ne se limitent pas à la présence d’agents sur site. Nos superviseurs effectuent régulièrement des contrôles de terrain afin de vérifier le respect des consignes, la qualité du service rendu et la bonne tenue des postes de sécurité. Ce suivi permanent nous permet d’identifier rapidement les éventuelles anomalies et d’apporter des solutions immédiates afin de maintenir un niveau de sécurité élevé en toutes circonstances.',
        image: superSecuriteStock.home.services.chantiers,
        imageAlt: 'Superviseur Super Sécurité sur chantier',
    },
    {
        id: 'application',
        icon: Smartphone,
        title: 'Une application dédiée pour un suivi transparent et en temps réel',
        description:
            'Parce que la sécurité moderne doit s’appuyer sur des outils performants, nous mettons à la disposition de nos clients une application dédiée leur permettant de suivre les prestations en temps réel. Grâce à cette plateforme, il est possible de consulter les rapports de ronde, recevoir des notifications, signaler des incidents et communiquer facilement avec nos équipes. Cette transparence renforce la confiance de nos clients et leur offre une meilleure visibilité sur les services réalisés.',
        image: superSecuriteStock.about.mobileApp,
        imageAlt: 'Application mobile Super Sécurité — suivi en temps réel',
    },
    {
        id: 'reactivite',
        icon: MapPin,
        title: 'Une présence locale et une grande réactivité partout en Guinée',
        description:
            'Basée en Guinée, Super Sécurité connaît parfaitement les réalités du terrain et les enjeux sécuritaires auxquels sont confrontés les entreprises et les particuliers. Notre proximité nous permet d’intervenir rapidement en cas de besoin, qu’il s’agisse d’un remplacement d’agent, d’un renforcement temporaire des effectifs ou d’une situation d’urgence. Notre organisation opérationnelle garantit à nos clients une continuité de service et une assistance rapide où qu’ils se trouvent.',
        image: superSecuriteStock.contact.sidePanel,
        imageAlt: 'Équipe Super Sécurité — présence locale en Guinée',
    },
    {
        id: 'expertise',
        icon: Building2,
        title: 'Une expertise reconnue dans la sécurité des mines, entreprises, résidences et chantiers',
        description:
            'Chaque secteur présente des risques et des exigences spécifiques. Grâce à notre expérience auprès de sociétés minières, d’entreprises, de résidences privées, de commerces et de chantiers, nous sommes en mesure de proposer des solutions adaptées à chaque environnement. Nos équipes mettent en œuvre des procédures éprouvées pour prévenir les intrusions, protéger les biens, contrôler les accès et contribuer à la sérénité de nos clients. Cette expertise multisectorielle fait de Super Sécurité un partenaire de confiance pour tous vos besoins en sécurité privée en Guinée.',
        image: superSecuriteStock.home.services['zones-minieres'],
        imageAlt: 'Sécurité Super Sécurité sur site minier',
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
