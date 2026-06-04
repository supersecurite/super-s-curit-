export type SuperSecuriteSocialLinks = {
    facebook: string | null;
    twitter: string | null;
    youtube: string | null;
    instagram: string | null;
    linkedin: string | null;
    github: string | null;
};

export type SuperSecuriteMapConfig = {
    latitude: string;
    longitude: string;
    zoom: number;
    embedUrl: string;
    directionsUrl: string;
};

export type SuperSecuriteConfig = {
    email: string;
    phone: string;
    phone_secondary: string | null;
    phone_href: string;
    address: string;
    rccm: string | null;
    social: SuperSecuriteSocialLinks;
    map: SuperSecuriteMapConfig;
};
