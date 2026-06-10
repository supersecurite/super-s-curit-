import ServicePageLayout from '@/components/marketing/service-layouts/service-page-layout';
import type { SuperSecuriteServiceId } from '@/data/super-securite-services';
import type { ServicePageLayoutProps } from '@/components/marketing/service-layouts/types';
import type { ComponentType } from 'react';

export const servicePageLayouts: Record<
    SuperSecuriteServiceId,
    ComponentType<ServicePageLayoutProps>
> = {
    entreprise: ServicePageLayout,
    residence: ServicePageLayout,
    chantiers: ServicePageLayout,
    'zones-minieres': ServicePageLayout,
};
