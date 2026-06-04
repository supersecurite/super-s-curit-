export const superSecuriteProjectTypes = [
    'Gardiennage et surveillance',
    'Site industriel ou minier',
    'Sécurité événementielle',
    'Vidéo / télésurveillance',
    'Résidence ou bureau',
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
            'Oui, Super Sécurité assure une disponibilité 24h/24 et 7j/7. Précisez l’urgence dans votre message pour une prise en charge prioritaire.',
    },
    {
        question: 'Quels types de sites sécurisez-vous ?',
        answer:
            'Résidences, bureaux, chantiers, zones minières, sites industriels et événements publics ou privés en Guinée.',
    },
    {
        question: 'Comment obtenir un devis ?',
        answer:
            'Contactez-nous par formulaire, par téléphone au +224 612 13 13 14 ou par e-mail à contact@supersecurite.com. Nous évaluons votre besoin et vous proposons une offre adaptée.',
    },
    {
        question: 'Vos agents sont-ils formés et certifiés ?',
        answer:
            'Oui. Nos équipes suivent des protocoles stricts et sont habituées aux environnements industriels, résidentiels et événementiels.',
    },
    {
        question: 'Couvrez-vous toute la Guinée ?',
        answer:
            'Notre base est à Conakry ; nous intervenons sur Conakry et selon vos besoins sur d’autres sites en Guinée.',
    },
] as const;
