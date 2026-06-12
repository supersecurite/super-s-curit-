/**
 * Logos partenaires — remplacer `logo` par vos fichiers dans
 * `public/images/super-securite/partners/`.
 */
export type SuperSecuritePartner = {
    name: string;
    logo: string;
};

const partnerLogo = (filename: string) =>
    `/images/super-securite/partners/${filename}`;

export const superSecuritePartners: readonly SuperSecuritePartner[] = [
    {
        name: 'AKIBA FINANCE',
        logo: partnerLogo('akiba.jpeg'),
    },
    {
        name: 'DJOLOF CHICKEN',
        logo: partnerLogo('Djolof.jpeg'),
    },
    {
        name: 'Heroes Coffee',
        logo: partnerLogo('Heroescoffee.jpeg'),
    },
    {
        name: 'Ashapura',
        logo: partnerLogo('Ashapura.jpeg'),
    },
    {
        name: 'TGCC',
        logo: partnerLogo('TGCC.jpeg'),
    },
    {
        name: 'BANKI TRUCK',
        logo: partnerLogo('banki.jpeg'),
    },
] as const;
