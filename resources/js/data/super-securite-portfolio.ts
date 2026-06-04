import {
    superSecuriteServiceDefinitions,
    type SuperSecuriteServiceId,
} from '@/data/super-securite-services';

export type SuperSecuriteServiceCard = {
    icon: string;
    cover: string;
    title: string;
    href: string;
    description: string;
};

export const superSecuriteLegacyServices: readonly SuperSecuriteServiceCard[] =
    superSecuriteServiceDefinitions.map((service) => ({
        icon: service.icon,
        cover: service.cover,
        title: service.title,
        href: service.path,
        description: service.cardDescription,
    }));

export type { SuperSecuriteServiceId };

export type TechStackCategory =
    | 'frontend'
    | 'backend'
    | 'cms'
    | 'database'
    | 'mobile';

export type TechStackItem = {
    path: string;
    label: string;
};

export const superSecuriteTechStack: Record<TechStackCategory, TechStackItem[]> = {
    frontend: [
        { path: '/images/super-securite/stack/html5.svg', label: 'HTML' },
        { path: '/images/super-securite/tech/react.svg', label: 'React' },
        { path: '/images/super-securite/stack/nextjs.svg', label: 'Next Js' },
        { path: '/images/super-securite/tech/vue.svg', label: 'VueJs' },
        { path: '/images/super-securite/stack/nuxt.svg', label: 'NuxtJs' },
        { path: '/images/super-securite/stack/css3.svg', label: 'CSS' },
        { path: '/images/super-securite/tech/tailwind.svg', label: 'Tailwind' },
        { path: '/images/super-securite/stack/bootstrap.svg', label: 'Bootstrap' },
    ],
    backend: [
        { path: '/images/super-securite/tech/php.svg', label: 'PHP' },
        { path: '/images/super-securite/tech/laravel.svg', label: 'Laravel' },
        { path: '/images/super-securite/stack/python.svg', label: 'Python' },
        { path: '/images/super-securite/stack/django.svg', label: 'Django' },
        { path: '/images/super-securite/tech/flask.svg', label: 'Flask' },
    ],
    cms: [
        { path: '/images/super-securite/stack/wordpress.svg', label: 'WordPress' },
        { path: '/images/super-securite/stack/wix.svg', label: 'Wix' },
        { path: '/images/super-securite/stack/shopify.svg', label: 'Shopify' },
    ],
    database: [
        { path: '/images/super-securite/stack/MySql.svg', label: 'MySql' },
        { path: '/images/super-securite/stack/firebase.svg', label: 'Firebase' },
        { path: '/images/super-securite/stack/MongoDB.svg', label: 'MongoDB' },
        { path: '/images/super-securite/stack/PostgreSQL.svg', label: 'PostgreSQL' },
        { path: '/images/super-securite/stack/MariaDB.svg', label: 'MariaDB' },
    ],
    mobile: [
        {
            path: '/images/super-securite/tech/react-native.svg',
            label: 'React Native',
        },
        { path: '/images/super-securite/tech/flutter.svg', label: 'Flutter' },
    ],
};

export const techStackTabs: { id: TechStackCategory; label: string }[] = [
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'cms', label: 'CMS' },
    { id: 'database', label: 'Base de données' },
    { id: 'mobile', label: 'Mobile' },
];

export type SuperSecuriteProject = {
    title: string;
    description: string;
    image: string;
    category: string;
    href: string;
    featured?: boolean;
};

export const superSecuriteProjects: SuperSecuriteProject[] = [
    {
        title: 'Sily Link',
        description:
            'Plateforme de paiement sécurisée avec intégration multi-devises et vérification avancée.',
        image: '/images/super-securite/projets/silylink.png',
        category: 'FinTech',
        href: '/realisations/sily-link',
        featured: true,
    },
    {
        title: 'Short Link',
        description:
            "Raccourcissement d'URL, analytics, QR codes et campagnes marketing.",
        image: '/images/super-securite/projets/shortlink.png',
        category: 'Utilitaires',
        href: 'https://shortgn.click/',
    },
    {
        title: '7 Makity',
        description:
            "E-commerce complet avec paiement sécurisé et gestion d'inventaire en temps réel.",
        image: '/images/super-securite/projets/7makiti.png',
        category: 'E-commerce',
        href: '/realisations/7-makity',
    },
    {
        title: 'Drive Me',
        description:
            'Covoiturage avec géolocalisation, notation et paiement intégré.',
        image: '/images/super-securite/projets/driveme.png',
        category: 'Web & mobile',
        href: '/realisations/drive-me',
    },
    {
        title: 'Eva',
        description:
            'Suivi de grossesse, conseils personnalisés et rappels médicaux.',
        image: '/images/super-securite/projets/eva.png',
        category: 'Santé & éducation',
        href: '#projets',
    },
];
