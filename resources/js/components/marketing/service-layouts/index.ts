import type { ComponentType } from 'react';
import ServiceV2Layout from '@/components/marketing/service-layouts/service-v2-layout';

import type { ServicePageLayoutProps } from '@/components/marketing/service-layouts/types';
import type { SuperSecuriteServiceId } from '@/data/super-securite-services';

export const servicePageLayouts: Record<
    SuperSecuriteServiceId,
    ComponentType<ServicePageLayoutProps>
> = {
    entreprise: ServiceV2Layout,
    residence: ServiceV2Layout,
    chantiers: ServiceV2Layout,
    'zones-minieres': ServiceV2Layout,
};
