import { superSecuriteImages } from '@/data/super-securite-images';
import { superSecuriteMetaKeywords } from '@/data/super-securite-search-terms';
import { superSecuriteHoursLong } from '@/data/super-securite-hours';
import { superSecuriteZoneLabel } from '@/data/super-securite-zone';

export type SeoPageKey = 'home' | 'about' | 'contact';

export type SeoSchemaPageType = 'WebPage' | 'AboutPage' | 'ContactPage';

export type SeoBreadcrumb = {
    name: string;
    path: string;
};

export type SeoPageMeta = {
    focusKeyword: string;
    title: string;
    description: string;
    path: string;
    image?: string;
    type?: 'website' | 'article';
    keywords?: string;
    schemaType: SeoSchemaPageType;
    breadcrumbs: SeoBreadcrumb[];
};

export const superSecuriteSeoPages: Record<SeoPageKey, SeoPageMeta> = {
    home: {
        focusKeyword: 'sécurité privée Conakry',
        title: `Super Sécurité | Sécurité privée à ${superSecuriteZoneLabel}`,
        description:
            `Super Sécurité : sécurité entreprise, résidence, chantiers et zones minières. Intervention ${superSecuriteHoursLong} à ${superSecuriteZoneLabel}.`,
        path: '/',
        image: superSecuriteImages.ogDefault,
        keywords: superSecuriteMetaKeywords.home,
        schemaType: 'WebPage',
        breadcrumbs: [{ name: 'Accueil', path: '/' }],
    },
    about: {
        focusKeyword: 'entreprise sécurité privée Guinée',
        title: `Pourquoi Super Sécurité | Sécurité privée à ${superSecuriteZoneLabel}`,
        description:
            `Expérience, réactivité, disponibilité ${superSecuriteHoursLong} et équipe certifiée : découvrez pourquoi choisir Super Sécurité pour protéger vos sites à ${superSecuriteZoneLabel}.`,
        path: '/a-propos',
        image: superSecuriteImages.ogDefault,
        keywords: superSecuriteMetaKeywords.about,
        schemaType: 'AboutPage',
        breadcrumbs: [
            { name: 'Accueil', path: '/' },
            { name: 'Pourquoi nous', path: '/a-propos' },
        ],
    },
    contact: {
        focusKeyword: 'contact sécurité privée Conakry',
        title: 'Contact & plan d\'accès | Super Sécurité — Lambanyi, Conakry',
        description:
            'Contactez Super Sécurité à Lambanyi (face Cis Media), Conakry : +224 612 13 13 14, contact@supersecurite.com. Formulaire et plan d\'accès.',
        path: '/contact',
        image: superSecuriteImages.ogDefault,
        keywords: superSecuriteMetaKeywords.contact,
        schemaType: 'ContactPage',
        breadcrumbs: [
            { name: 'Accueil', path: '/' },
            { name: 'Contact', path: '/contact' },
        ],
    },
};
