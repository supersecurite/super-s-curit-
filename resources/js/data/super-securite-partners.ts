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
        name: 'Global Archer',
        logo: partnerLogo('global-archer.svg'),
    },
    {
        name: 'DGI',
        logo: partnerLogo('dgi.svg'),
    },
    {
        name: 'Partenaire 3',
        logo: partnerLogo('partenaire-3.svg'),
    },
    {
        name: 'Partenaire 4',
        logo: partnerLogo('partenaire-4.svg'),
    },
    {
        name: 'Partenaire 5',
        logo: partnerLogo('partenaire-5.svg'),
    },
    {
        name: 'Partenaire 6',
        logo: partnerLogo('partenaire-6.svg'),
    },
] as const;
