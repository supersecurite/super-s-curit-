export type AristechSocialLinks = {
    facebook: string | null;
    twitter: string | null;
    instagram: string | null;
};

export type AristechConfig = {
    email: string;
    phone: string;
    phone_href: string;
    social: AristechSocialLinks;
};
