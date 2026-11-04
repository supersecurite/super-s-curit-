import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import CmsLocaleNotice from '@/components/marketing/cms-locale-notice';
import ResourcesV2Header, {
    type ResourceSection,
} from '@/components/marketing/resources-v2-header';
import SeoHead from '@/components/marketing/seo-head';
import { cn } from '@/lib/utils';

type ResourcesV2LayoutProps = {
    active: ResourceSection;
    title: string;
    children: ReactNode;
    className?: string;
    compact?: boolean;
    /** Contenu hors du conteneur principal (ex. lightbox galerie). */
    after?: ReactNode;
};

/** Gabarit commun des listes Ressources V2 : SEO, bandeau, onglets et zone de contenu. */
export default function ResourcesV2Layout({
    active,
    title,
    children,
    className,
    compact = false,
    after = null,
}: ResourcesV2LayoutProps) {
    return (
        <div className={cn('resources-v2', className)}>
            <SeoHead />
            <CmsLocaleNotice />
            <Head title={title} />

            <ResourcesV2Header active={active} compact={compact} />

            <section className="resources-v2-list">
                <div className="resources-v2-container">{children}</div>
            </section>

            {after}
        </div>
    );
}
