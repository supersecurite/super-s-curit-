import {
    Compass,
    Eye,
    Heart,
    Lightbulb,
    Rocket,
    ShieldCheck,
    Sparkles,
    Target,
    Zap,
    type LucideIcon,
} from 'lucide-react';

export type AristechStat = {
    value: string;
    label: string;
};

export const aristechStats: readonly AristechStat[] = [
    { value: '5+', label: "Années d'expérience" },
    { value: '25+', label: 'Projets livrés' },
    { value: '15+', label: 'Clients accompagnés' },
    { value: '3', label: 'Pays couverts' },
] as const;

export type AristechValue = {
    icon: LucideIcon;
    title: string;
    description: string;
};

export const aristechValues: readonly AristechValue[] = [
    {
        icon: ShieldCheck,
        title: 'Excellence technique',
        description:
            'Du code lisible, testé et maintenable. Nos livraisons reposent sur des standards éprouvés et une attention obsessionnelle aux détails.',
    },
    {
        icon: Eye,
        title: 'Transparence radicale',
        description:
            "Vous savez exactement où va chaque heure facturée. Reporting hebdomadaire, accès direct au code et aux environnements.",
    },
    {
        icon: Zap,
        title: 'Agilité réelle',
        description:
            "Des cycles courts, des démos régulières, des décisions rapides. Pas de bureaucratie — uniquement ce qui fait avancer votre produit.",
    },
    {
        icon: Heart,
        title: 'Proximité client',
        description:
            "Vous parlez directement à ceux qui codent. Pas d'intermédiaire, pas de chef de projet qui ralentit l'information.",
    },
] as const;

export type AristechProcessStep = {
    number: string;
    icon: LucideIcon;
    title: string;
    duration: string;
    description: string;
    deliverables: readonly string[];
};

export const aristechProcess: readonly AristechProcessStep[] = [
    {
        number: '01',
        icon: Compass,
        title: 'Cadrage',
        duration: '3 à 5 jours',
        description:
            "Nous explorons votre vision, vos contraintes et vos utilisateurs pour aligner la solution sur vos objectifs métier.",
        deliverables: ['Brief produit', 'Périmètre fonctionnel', 'Devis détaillé'],
    },
    {
        number: '02',
        icon: Lightbulb,
        title: 'Design',
        duration: '1 à 3 semaines',
        description:
            "Wireframes, parcours utilisateurs puis maquettes haute-fidélité. Vous validez chaque écran avant le développement.",
        deliverables: ['Architecture UX', 'Design system', 'Maquettes interactives'],
    },
    {
        number: '03',
        icon: Sparkles,
        title: 'Build',
        duration: '2 à 8 semaines',
        description:
            "Développement itératif avec démos hebdomadaires. Vous voyez votre produit prendre forme en temps réel.",
        deliverables: ['Sprints hebdomadaires', 'Tests automatisés', 'Accès staging'],
    },
    {
        number: '04',
        icon: Rocket,
        title: 'Lancement',
        duration: '3 à 5 jours',
        description:
            "Déploiement, monitoring, documentation et formation. Votre équipe est prête à prendre le relais.",
        deliverables: ['Mise en production', 'Monitoring', 'Documentation'],
    },
    {
        number: '05',
        icon: Target,
        title: 'Évolution',
        duration: 'Continu',
        description:
            "Support, maintenance et nouvelles fonctionnalités. Nous restons à vos côtés pour faire grandir le produit.",
        deliverables: ['Support réactif', 'Évolutions', 'Optimisations'],
    },
] as const;

export type AristechStoryChapter = {
    year: string;
    title: string;
    description: string;
};

export const aristechStory: readonly AristechStoryChapter[] = [
    {
        year: '2020',
        title: 'Les premiers pas',
        description:
            "Aristide démarre en freelance, livrant ses premiers sites pour des entrepreneurs guinéens en quête d'une présence en ligne.",
    },
    {
        year: '2022',
        title: 'Lancement d\'ArisTech',
        description:
            "Création officielle de la marque ArisTech et structuration de l'offre autour du web, du mobile et de l'intégration d'API.",
    },
    {
        year: '2024',
        title: 'Projets phares',
        description:
            "Livraison de plateformes complètes (Sily Link, 7 Makity, Eva, Drive Me) pour des clients en Afrique et à l'international.",
    },
    {
        year: '2026',
        title: 'Une expertise reconnue',
        description:
            "ArisTech accompagne aujourd'hui startups et PME sur des projets sur mesure, avec un réseau d'experts pour les missions plus larges.",
    },
] as const;
