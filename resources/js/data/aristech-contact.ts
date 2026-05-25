export const aristechProjectTypes = [
    'Site WordPress (vitrine)',
    'E-commerce WordPress (WooCommerce)',
    'Boutique Shopify',
    'Application web sur mesure',
    'Application mobile',
    'Intégration d\u2019API',
    'Refonte / Migration',
    'Autre',
] as const;

export const aristechBudgets = [
    'Moins de 2 000 €',
    '2 000 – 5 000 €',
    '5 000 – 15 000 €',
    '15 000 – 40 000 €',
    'Plus de 40 000 €',
    'À discuter',
] as const;

export type AristechFaq = {
    question: string;
    answer: string;
};

export const aristechFaqs: readonly AristechFaq[] = [
    {
        question: 'Sous combien de temps répondez-vous ?',
        answer:
            'Nous répondons à toutes les demandes sous 24 heures ouvrées. Pour les projets urgents, mentionnez-le dans votre message et nous priorisons votre dossier.',
    },
    {
        question: 'Travaillez-vous avec des clients hors Guinée ?',
        answer:
            "Oui. Nous accompagnons régulièrement des clients en Afrique de l'Ouest, en Europe et en Amérique du Nord. Tout se passe à distance avec des points hebdomadaires.",
    },
    {
        question: 'Quelle est la durée moyenne d\u2019un projet ?',
        answer:
            'Un site vitrine se livre en 2 à 4 semaines. Une application web sur mesure prend généralement 6 à 12 semaines selon la complexité. Nous communiquons un planning précis dès le cadrage.',
    },
    {
        question: 'Comment se passe la facturation ?',
        answer:
            'Nous facturons au forfait pour les projets bien cadrés, ou en régie (TJM) pour les missions évolutives. Un acompte de 30 % est demandé au lancement.',
    },
    {
        question: 'Proposez-vous de la maintenance après livraison ?',
        answer:
            'Oui. Nous offrons des contrats de support et de maintenance (correctifs, mises à jour, monitoring) avec différents niveaux de service selon vos besoins.',
    },
] as const;
