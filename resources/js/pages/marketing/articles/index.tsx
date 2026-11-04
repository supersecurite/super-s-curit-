import { usePage } from '@inertiajs/react';
import ResourcesV2ContentIndex from '@/components/marketing/resources-v2-content-index';
import type { ResourceV2CardItem } from '@/components/marketing/resource-v2-card';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useMarketingPageHero } from '@/hooks/use-marketing-page-hero';
import { useTrans } from '@/hooks/use-trans';
import {
    index as actualitesIndex,
    show as actualitesShow,
} from '@/routes/actualites';

type PaginatedArticles = {
    data: ResourceV2CardItem[];
    current_page: number;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type PageProps = {
    articles: PaginatedArticles;
    featuredArticles: ResourceV2CardItem[];
    categories: string[];
    filters: {
        search?: string;
        category?: string;
        sort_by?: string;
        sort_direction?: string;
    };
};

export default function MarketingArticlesIndex() {
    const { t } = useTrans();
    const lp = useLocalizedUrl();
    const { articles, featuredArticles, categories, filters } =
        usePage<PageProps>().props;
    const hero = useMarketingPageHero('actualites');

    return (
        <ResourcesV2ContentIndex
            active="news"
            title={hero.label}
            filters={filters}
            categories={categories}
            indexUrl={lp(actualitesIndex.url())}
            searchPlaceholder={t('articles.search_placeholder')}
            featured={featuredArticles}
            items={articles}
            sectionTitle={t('resources_v2.all_news')}
            emptyMessage={t('articles.empty')}
            itemHref={(item) => lp(actualitesShow.url(item.slug))}
        />
    );
}
