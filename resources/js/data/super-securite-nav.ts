import { superSecuriteServices } from '@/data/super-securite-content';

export const superSecuriteNavLinks = superSecuriteServices.map((service) => ({
    href: service.path,
    label: service.title,
}));
