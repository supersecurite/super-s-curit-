/**
 * Termes de recherche cibles — SEO, AEO et contenu marketing Super Sécurité.
 */
export const superSecuriteSearchTerms = {
    brand: [
        'Super Sécurité',
        'SuperSécurité',
        'Super Sécurité Guinée',
        'supersecurite.com',
        'sécurité privée Super Sécurité',
    ],

    location: [
        'Guinée',
        'Conakry',
        "Afrique de l'Ouest",
        'Lambanyi Conakry',
    ],

    security: [
        'sécurité privée',
        'sécurité privée Conakry',
        'sécurité privée Guinée',
        'entreprise de sécurité',
        'agents de sécurité',
        'agents de sécurité Conakry',
        'gardiennage',
        'gardiennage Guinée',
        'gardiennage Conakry',
        'surveillance',
        'surveillance 24/7',
        'gardiennage 24h/24',
        'sécurité entreprise',
        'sécurité entreprise Conakry',
        'sécurité résidence',
        'sécurité résidence Conakry',
        'sécurité chantier',
        'sécurité chantier Guinée',
        'zones minières',
        'sécurité minière',
        'sécurité minière Guinée',
        'vidéosurveillance',
        'télésurveillance',
        'protection des biens',
        'sécurité bureau',
    ],

    intent: [
        'devis sécurité privée',
        'devis gardiennage',
        'contact sécurité Conakry',
        'entreprise sécurité Lambanyi',
        'intervention urgence sécurité',
    ],
} as const;

export function buildMetaKeywords(
    ...groups: readonly (readonly string[])[]
): string {
    return [...new Set(groups.flat())].join(', ');
}

export const superSecuriteMetaKeywords = {
    home: buildMetaKeywords(
        superSecuriteSearchTerms.brand,
        superSecuriteSearchTerms.location,
        superSecuriteSearchTerms.security,
        superSecuriteSearchTerms.intent,
    ),
    about: buildMetaKeywords(
        superSecuriteSearchTerms.brand,
        superSecuriteSearchTerms.location,
        superSecuriteSearchTerms.security,
        [
            'pourquoi choisir Super Sécurité',
            'équipe certifiée sécurité',
            'disponibilité 24/7',
        ],
    ),
    contact: buildMetaKeywords(
        superSecuriteSearchTerms.brand,
        superSecuriteSearchTerms.location,
        superSecuriteSearchTerms.security,
        superSecuriteSearchTerms.intent,
        [
            'plan accès Lambanyi',
            'contact Super Sécurité',
            'téléphone sécurité Conakry',
        ],
    ),
} as const;
