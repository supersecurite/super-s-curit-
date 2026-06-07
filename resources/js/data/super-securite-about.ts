import {
    Award,
    Clock,
    ShieldCheck,
    Users,
    Zap,
    type LucideIcon,
} from 'lucide-react';

export type SuperSecuriteValue = {
    icon: LucideIcon;
    title: string;
    description: string;
};

export const superSecuriteValues: readonly SuperSecuriteValue[] = [
    {
        icon: Award,
        title: 'Expérience et professionnalisme',
        description:
            'Des agents et superviseurs formés aux standards de la sécurité privée en environnement sensible.',
    },
    {
        icon: Zap,
        title: "Rapidité d'intervention",
        description:
            'Déploiement rapide sur vos sites, chantiers et événements selon vos contraintes opérationnelles.',
    },
    {
        icon: Clock,
        title: 'Disponibilité 24/7',
        description:
            'Une présence continue pour protéger vos biens, vos équipes et vos visiteurs.',
    },
    {
        icon: Users,
        title: 'Équipe certifiée et formée',
        description:
            'Personnel qualifié, habitué aux environnements professionnels, résidentiels, chantiers et miniers.',
    },
] as const;

export const superSecuriteMissionBlocks = [
    {
        title: 'Qui sommes-nous ?',
        content:
            'Super Sécurité est une entreprise de sécurité privée basée à Conakry, Guinée. Nous protégeons entreprises, résidences, chantiers et zones minières avec des solutions de gardiennage et surveillance.',
    },
    {
        title: 'Notre engagement',
        content:
            'Protéger ce qui compte le plus pour vous : vos installations, vos collaborateurs et votre tranquillité d’esprit. Intervention 24h/24 et 7j/7 avec des équipes professionnelles et réactives.',
    },
] as const;
