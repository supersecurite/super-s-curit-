import { superSecuriteHoursLong } from '@/data/super-securite-hours';
import { superSecuriteZoneLabel } from '@/data/super-securite-zone';

export const superSecuriteProjectTypes = [
    'Sécurité entreprise',
    'Sécurité résidence',
    'Sécurité chantiers',
    'Zones minières',
    'Vidéo / télésurveillance',
    'Autre',
] as const;

export type SuperSecuriteFaq = {
    question: string;
    answer: string;
};

export const superSecuriteFaqs: readonly SuperSecuriteFaq[] = [
    {
        question: 'Intervenez-vous en urgence ?',
        answer:
            `Oui, Super Sécurité assure une disponibilité ${superSecuriteHoursLong}. Précisez l’urgence dans votre message pour une prise en charge prioritaire.`,
    },
    {
        question: 'Quels types de sites sécurisez-vous ?',
        answer:
            `Résidences, bureaux, chantiers, zones minières et sites sensibles à ${superSecuriteZoneLabel}.`,
    },
    {
        question: 'Comment obtenir un devis ?',
        answer:
            'Contactez-nous par formulaire, par téléphone au +224 612 13 13 14 ou par e-mail à contact@supersecurite.com. Nous évaluons votre besoin et vous proposons une offre adaptée.',
    },
    {
        question: 'Vos agents sont-ils formés et certifiés ?',
        answer:
            'Oui. Nos équipes suivent des protocoles stricts et sont habituées aux environnements professionnels, résidentiels, chantiers et miniers.',
    },
    {
        question: `Intervenez-vous à ${superSecuriteZoneLabel} ?`,
        answer:
            `Oui. Notre base est à Lambanyi, Conakry, et nous intervenons sur ${superSecuriteZoneLabel} selon vos besoins.`,
    },
] as const;
