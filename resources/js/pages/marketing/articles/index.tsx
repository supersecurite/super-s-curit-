import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Calendar, Clock, Eye, Star } from 'lucide-react';
import ContentShareButton from '@/components/content-share-button';
import CmsLocaleNotice from '@/components/marketing/cms-locale-notice';
import MarketingContentFilters from '@/components/marketing/marketing-content-filters';
import MarketingContentImage from '@/components/marketing/marketing-content-image';
import ResourcesV2Header from '@/components/marketing/resources-v2-header';
import SeoHead from '@/components/marketing/seo-head';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useMarketingPageHero } from '@/hooks/use-marketing-page-hero';
import { useTrans } from '@/hooks/use-trans';
import {
    index as actualitesIndex,
    show as actualitesShow,
} from '@/routes/actualites';
import type { MarketingContentImageSource } from '@/types/marketing-content';

type ArticleCard = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image_url: string | null;
    image_source?: MarketingContentImageSource | null;
    category: string | null;
    featured: boolean;
    views: number;
    read_time: number;
    published_at_formatted: string | null;
};

type PaginatedArticles = {
    data: ArticleCard[];
    current_page: number;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type PageProps = {
    articles: PaginatedArticles;
    featuredArticles: ArticleCard[];
    categories: string[];
    filters: {
        search?: string;
        category?: string;
        sort_by?: string;
        sort_direction?: string;
    };
};

function ArticleCardItem({ article }: { article: ArticleCard }) {
    const { t } = useTrans();
    const lp = useLocalizedUrl();

    return (
        <article className="resource-v2-card group">
            <div className="relative aspect-video overflow-hidden">
                {article.image_url ? (
                    <MarketingContentImage
                        src={article.image_url}
                        source={article.image_source}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-super-securite-surface-elevated">
                        <span className="text-sm text-super-securite-muted">
                            Super Sécurité
                        </span>
                    </div>
                )}
                {article.category ? (
                    <span className="resource-v2-category absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {article.category}
                    </span>
                ) : null}
            </div>

            <div className="p-6">
                <div className="mb-3 flex items-center gap-3 text-sm text-super-securite-muted">
                    {article.published_at_formatted ? (
                        <span className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            {article.published_at_formatted}
                        </span>
                    ) : null}
                    <span className="flex items-center gap-1">
                        <Clock className="size-4" />
                        {t('public_content.minutes', {
                            count: article.read_time,
                        })}
                    </span>
                </div>

                <h3 className="mb-3 line-clamp-2 font-heading text-xl font-semibold text-super-securite-heading transition-colors group-hover:text-super-securite-accent">
                    {article.title}
                </h3>

                {article.excerpt ? (
                    <p className="mb-4 line-clamp-3 text-sm text-super-securite-muted">
                        {article.excerpt}
                    </p>
                ) : null}

                <div className="flex items-center justify-between border-t border-super-securite-border pt-4">
                    <span className="flex items-center gap-1 text-sm text-super-securite-muted">
                        <Eye className="size-4" />
                        {article.views}
                    </span>
                    <div className="flex items-center gap-1">
                        <ContentShareButton
                            title={article.title}
                            url={lp(actualitesShow.url(article.slug))}
                            description={article.excerpt}
                            variant="marketing"
                        />
                        <Link
                            href={lp(actualitesShow.url(article.slug))}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-super-securite-accent"
                        >
                            {t('public_content.read')}
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function MarketingArticlesIndex() {
    const { t } = useTrans();
    const lp = useLocalizedUrl();
    const { articles, featuredArticles, categories, filters } =
        usePage<PageProps>().props;
    const hero = useMarketingPageHero('actualites');

    return (
        <div className="resources-v2">
            <SeoHead />
            <CmsLocaleNotice />
            <Head title={hero.label} />

            <ResourcesV2Header active="news" />

            <section className="resources-v2-list">
                <div className="resources-v2-container">
                    <MarketingContentFilters
                        filters={filters}
                        categories={categories}
                        indexUrl={lp(actualitesIndex.url())}
                        searchPlaceholder={t('articles.search_placeholder')}
                    />

                    {featuredArticles.length > 0 ? (
                        <div className="resource-v2-featured mb-10">
                            <h2 className="marketing-heading-section mb-6 flex items-center gap-2">
                                <Star className="size-5 text-super-securite-accent" />
                                {t('common.featured')}
                            </h2>
                            <div className="grid gap-6 md:grid-cols-3">
                                {featuredArticles.slice(0, 1).map((article) => (
                                    <ArticleCardItem
                                        key={article.id}
                                        article={article}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <h2 className="resource-v2-section-title">
                        {t('resources_v2.all_news')}
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {articles.data.map((article) => (
                            <ArticleCardItem
                                key={article.id}
                                article={article}
                            />
                        ))}
                    </div>

                    {articles.data.length === 0 ? (
                        <div className="marketing-card py-12 text-center">
                            <p className="text-super-securite-muted">
                                {t('articles.empty')}
                            </p>
                        </div>
                    ) : null}

                    {articles.last_page > 1 ? (
                        <div className="mt-10 flex flex-wrap justify-center gap-2">
                            {articles.links.map((link, index) => (
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
                </div>
            </section>
        </div>
    );
}
