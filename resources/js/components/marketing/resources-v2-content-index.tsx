import { router } from '@inertiajs/react';
import { Star } from 'lucide-react';
import type { ReactNode } from 'react';
import MarketingContentFilters from '@/components/marketing/marketing-content-filters';
import ResourceV2Card, {
    type ResourceV2CardItem,
} from '@/components/marketing/resource-v2-card';
import type { ResourceSection } from '@/components/marketing/resources-v2-header';
import { useTrans } from '@/hooks/use-trans';
import ResourcesV2Layout from '@/layouts/resources-v2-layout';

type PaginatedResources = {
    data: ResourceV2CardItem[];
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type ContentFilters = {
    search?: string;
    category?: string;
    sort_by?: string;
    sort_direction?: string;
};

type ResourcesV2ContentIndexProps = {
    active: Extract<ResourceSection, 'news' | 'tips'>;
    title: string;
    filters: ContentFilters;
    categories: string[];
    indexUrl: string;
    searchPlaceholder: string;
    featured: ResourceV2CardItem[];
    items: PaginatedResources;
    sectionTitle: string;
    emptyMessage: string;
    itemHref: (item: ResourceV2CardItem) => string;
    emptyMedia?: ReactNode;
};

/** Liste éditoriale partagée (actualités / conseils) : filtres, à la une, grille et pagination. */
export default function ResourcesV2ContentIndex({
    active,
    title,
    filters,
    categories,
    indexUrl,
    searchPlaceholder,
    featured,
    items,
    sectionTitle,
    emptyMessage,
    itemHref,
    emptyMedia,
}: ResourcesV2ContentIndexProps) {
    const { t } = useTrans();

    return (
        <ResourcesV2Layout active={active} title={title}>
            <MarketingContentFilters
                filters={filters}
                categories={categories}
                indexUrl={indexUrl}
                searchPlaceholder={searchPlaceholder}
            />

            {featured.length > 0 ? (
                <div className="resource-v2-featured mb-10">
                    <h2 className="marketing-heading-section mb-6 flex items-center gap-2">
                        <Star className="size-5 text-super-securite-accent" />
                        {t('common.featured')}
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {featured.slice(0, 1).map((item) => (
                            <ResourceV2Card
                                key={item.id}
                                item={item}
                                href={itemHref(item)}
                                emptyMedia={emptyMedia}
                            />
                        ))}
                    </div>
                </div>
            ) : null}

            <h2 className="resource-v2-section-title">{sectionTitle}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.data.map((item) => (
                    <ResourceV2Card
                        key={item.id}
                        item={item}
                        href={itemHref(item)}
                        emptyMedia={emptyMedia}
                    />
                ))}
            </div>

            {items.data.length === 0 ? (
                <div className="marketing-card py-12 text-center">
                    <p className="text-super-securite-muted">{emptyMessage}</p>
                </div>
            ) : null}

            {items.last_page > 1 ? (
                <div className="mt-10 flex flex-wrap justify-center gap-2">
                    {items.links.map((link, index) => (
                        <button
                            key={index}
                            type="button"
                            disabled={!link.url}
                            onClick={() => {
                                if (link.url) {
                                    router.get(
                                        link.url,
                                        {},
                                        {
                                            preserveState: true,
                                        },
                                    );
                                }
                            }}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                link.active
                                    ? 'bg-super-securite-accent text-white'
                                    : 'border border-super-securite-border bg-white text-super-securite-heading hover:bg-super-securite-surface'
                            }`}
                            dangerouslySetInnerHTML={{
                                __html: link.label,
                            }}
                        />
                    ))}
                </div>
            ) : null}
        </ResourcesV2Layout>
    );
}
