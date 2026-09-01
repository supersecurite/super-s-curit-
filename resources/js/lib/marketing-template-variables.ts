export const MARKETING_TEMPLATE_VARIABLE_LABELS: Record<string, string> = {
    prenom: 'Prénom',
    nom: 'Nom',
    email: 'E-mail',
    telephone: 'Téléphone',
    entreprise: 'Entreprise',
    role_entreprise: 'Rôle entreprise',
    adresse: 'Adresse',
};

export const DEFAULT_MARKETING_TEMPLATE_SUBJECT =
    'Bonjour {{prenom}} {{nom}}';

export const DEFAULT_MARKETING_TEMPLATE_BODY = `Bonjour {{prenom}} {{nom}},

Merci pour votre intérêt pour Super Sécurité.

Nous restons à votre disposition pour toute question.

Cordialement,
L'équipe Super Sécurité`;

export function formatMarketingTemplateVariable(variable: string): string {
    return `{{${variable}}}`;
}

export function variableTokenClassName(): string {
    return 'rounded bg-primary/15 px-1.5 py-0.5 font-mono text-sm font-semibold text-primary';
}
