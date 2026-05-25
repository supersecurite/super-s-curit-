import { aristechStock } from '@/data/aristech-stock';

export const aristechServices = [
    {
        icon: '/images/aristech/services/responsive_icon.svg',
        cover: aristechStock.services.applications,
        title: 'Applications',
        description:
            'Nous développons des applications web et mobiles robustes, basées sur les dernières technologies, optimisées pour des performances élevées, des interfaces utilisateur conviviales et des fonctionnalités innovantes.',
    },
    {
        icon: '/images/aristech/stack/wordpress.svg',
        cover: aristechStock.services.ecommerce,
        title: 'E-commerce',
        description:
            'Boutiques en ligne avant tout sur WordPress (WooCommerce) : catalogue, paiement, stocks et tunnel d\u2019achat. Nous intervenons aussi ponctuellement sur Shopify pour des besoins plus simples.',
    },
    {
        icon: '/images/aristech/stack/wordpress.svg',
        cover: aristechStock.services.websites,
        title: 'Sites Internet',
        description:
            'Sites vitrines et institutionnels sur WordPress : thèmes sur mesure, SEO, performances et administration simple pour gérer votre contenu en autonomie.',
    },
    {
        icon: '/images/aristech/services/seo_icon.svg',
        cover: aristechStock.services.api,
        title: "Intégration d'API",
        description:
            'Nous intégrons des API tierces pour connecter votre application à d\'autres systèmes ou services (paiements, CRM, plugins ou autres). Améliorez les fonctionnalités de votre application en connectant des services externes.',
    },
] as const;

export const aristechMissionBlocks = [
    {
        title: 'Qui sommes-nous ?',
        content:
            'Aristide Gnimassou, fondateur et développeur principal, dirige Aristech. Bien que je travaille principalement en solo, je collabore régulièrement avec des experts pour répondre à des besoins spécifiques ou de plus grande envergure. Cette flexibilité me permet d\'offrir des solutions personnalisées tout en maintenant une qualité optimale.',
    },
    {
        title: 'Notre Mission',
        content:
            'Notre mission est de simplifier le monde numérique pour vous. Que ce soit à travers des applications web et mobiles performantes, la création de sites web modernes, ou encore la gestion efficace de votre présence en ligne, nous nous efforçons de vous offrir des solutions adaptées à vos besoins spécifiques.',
    },
] as const;

export type TechStackCategory = 'frontend' | 'backend' | 'cms' | 'database' | 'mobile';

export type TechStackItem = {
    path: string;
    label: string;
};

export const aristechTechStack: Record<TechStackCategory, TechStackItem[]> = {
    frontend: [
        { path: '/images/aristech/stack/html5.svg', label: 'HTML' },
        { path: '/images/aristech/tech/react.svg', label: 'React' },
        { path: '/images/aristech/stack/nextjs.svg', label: 'Next Js' },
        { path: '/images/aristech/tech/vue.svg', label: 'VueJs' },
        { path: '/images/aristech/stack/nuxt.svg', label: 'NuxtJs' },
        { path: '/images/aristech/stack/css3.svg', label: 'CSS' },
        { path: '/images/aristech/tech/tailwind.svg', label: 'Tailwind' },
        { path: '/images/aristech/stack/bootstrap.svg', label: 'Bootstrap' },
    ],
    backend: [
        { path: '/images/aristech/tech/php.svg', label: 'PHP' },
        { path: '/images/aristech/tech/laravel.svg', label: 'Laravel' },
        { path: '/images/aristech/stack/python.svg', label: 'Python' },
        { path: '/images/aristech/stack/django.svg', label: 'Django' },
        { path: '/images/aristech/tech/flask.svg', label: 'Flask' },
        // { path: '/images/aristech/stack/Symfony.svg', label: 'Symfony' },
    ],
    cms: [
        { path: '/images/aristech/stack/wordpress.svg', label: 'WordPress' },
        { path: '/images/aristech/stack/wix.svg', label: 'Wix' },
        { path: '/images/aristech/stack/shopify.svg', label: 'Shopify' },
    ],
    database: [
        { path: '/images/aristech/stack/MySql.svg', label: 'MySql' },
        { path: '/images/aristech/stack/firebase.svg', label: 'Firebase' },
        { path: '/images/aristech/stack/MongoDB.svg', label: 'MongoDB' },
        { path: '/images/aristech/stack/PostgreSQL.svg', label: 'PostgreSQL' },
        { path: '/images/aristech/stack/MariaDB.svg', label: 'MariaDB' },
    ],
    mobile: [
        { path: '/images/aristech/tech/react-native.svg', label: 'React Native' },
        { path: '/images/aristech/tech/flutter.svg', label: 'Flutter' },
    ],
};

export const techStackTabs: { id: TechStackCategory; label: string }[] = [
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'cms', label: 'CMS' },
    { id: 'database', label: 'Base de données' },
    { id: 'mobile', label: 'Mobile' },
];

export type AristechProject = {
    title: string;
    description: string;
    image: string;
    category: string;
    href: string;
    featured?: boolean;
};

export const aristechProjects: AristechProject[] = [
    {
        title: 'Sily Link',
        description:
            'Plateforme de paiement sécurisée avec intégration multi-devises et vérification avancée.',
        image: '/images/aristech/projets/silylink.png',
        category: 'FinTech',
        href: 'https://silylink.com/',
        featured: true,
    },
    {
        title: '7 Makity',
        description:
            'E-commerce complet avec paiement sécurisé et gestion d\'inventaire en temps réel.',
        image: '/images/aristech/projets/7makiti.png',
        category: 'E-commerce',
        href: 'https://7makiti.com',
    },
    {
        title: 'Short Link',
        description:
            'Raccourcissement d\'URL, analytics, QR codes et campagnes marketing.',
        image: '/images/aristech/projets/shortlink.png',
        category: 'Utilitaires',
        href: 'https://str.aristech-dev.com/',
    },
    {
        title: 'Drive Me',
        description:
            'Covoiturage avec géolocalisation, notation et paiement intégré.',
        image: '/images/aristech/projets/driveme.png',
        category: 'Web & mobile',
        href: '#projets',
    },
    {
        title: 'Eva',
        description:
            'Suivi de grossesse, conseils personnalisés et rappels médicaux.',
        image: '/images/aristech/projets/eva.png',
        category: 'Santé & éducation',
        href: 'https://eva.aristech-dev.com/',
    },
];
