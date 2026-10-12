export type SeoOrganization = {
    name: string;
    legalName: string;
    alternateName: string;
    slogan: string;
    foundingDate: string;
    founder: string;
    founderJobTitle: string;
    description: string;
    email: string;
    phone: string;
    areaServed: string;
    addressCountry: string;
    addressLocality: string;
    addressStreet: string;
    geoLatitude: string;
    geoLongitude: string;
    openingHours: string;
    rccm: string;
};

export type SeoService = {
    name: string;
    description: string;
    path: string;
};

export type SeoGeo = {
    region: string;
    placename: string;
};

export type SeoOgImage = {
    width: number;
    height: number;
    type: string;
};

export type SeoSharedProps = {
    siteName: string;
    siteUrl: string;
    locale: string;
    localeAlternates?: string[];
    language: string;
    twitterSite: string | null;
    defaultImage: string;
    ogImage: SeoOgImage;
    geo: SeoGeo;
    organization: SeoOrganization;
    sameAs: string[];
    services: SeoService[];
    knowsAbout: string[];
};
