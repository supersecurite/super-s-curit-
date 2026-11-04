import { usePage } from '@inertiajs/react';
import {
    ResourceV2ShieldPlaceholder,
    type ResourceV2CardItem,
} from '@/components/marketing/resource-v2-card';
import ResourcesV2ContentIndex from '@/components/marketing/resources-v2-content-index';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useMarketingPageHero } from '@/hooks/use-marketing-page-hero';
import { useTrans } from '@/hooks/use-trans';
import {
    index as conseilsIndex,
    show as conseilsShow,
} from '@/routes/conseils-securite';

type PaginatedSecurityTips = {
    data: ResourceV2CardItem[];
    current_page: number;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type PageProps = {
    securityTips: PaginatedSecurityTips;
    featuredSecurityTips: ResourceV2CardItem[];
    categories: string[];
    filters: {
        search?: string;
        category?: string;
        sort_by?: string;
        sort_direction?: string;
    };
};

export default function MarketingConseilsSecuriteIndex() {
    const { t } = useTrans();
    const lp = useLocalizedUrl();
    const { securityTips, featuredSecurityTips, categories, filters } =
        usePage<PageProps>().props;
    const hero = useMarketingPageHero('conseils');

    return (
        <ResourcesV2ContentIndex
            active="tips"
            title={hero.label}
            filters={filters}
            categories={categories}
            indexUrl={lp(conseilsIndex.url())}
            searchPlaceholder={t('tips.search_placeholder')}
            featured={featuredSecurityTips}
            items={securityTips}
            sectionTitle={t('resources_v2.all_tips')}
            emptyMessage={t('tips.empty')}
            itemHref={(item) => lp(conseilsShow.url(item.slug))}
            emptyMedia={<ResourceV2ShieldPlaceholder />}
        />
    );
}
