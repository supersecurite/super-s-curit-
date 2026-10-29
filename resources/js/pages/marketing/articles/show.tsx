import { Head, usePage } from '@inertiajs/react';
import CmsLocaleNotice from '@/components/marketing/cms-locale-notice';
import ResourceV2Detail from '@/components/marketing/resource-v2-detail';
import SeoHead from '@/components/marketing/seo-head';
import type { MarketingContentImageSource } from '@/types/marketing-content';

type ArticleDetail = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image_url: string | null;
    image_source?: MarketingContentImageSource | null;
    category: string | null;
    views: number;
    read_time: number;
    formatted_read_time: string;
    published_at_formatted: string | null;
    is_locale_fallback?: boolean;
};

type RelatedArticle = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image_url: string | null;
    image_source?: MarketingContentImageSource | null;
    published_at_formatted: string | null;
};

type PageProps = {
    article: ArticleDetail;
    articleContent: string | null;
    relatedArticles: RelatedArticle[];
};

export default function ResourceShow() {
    const { article, articleContent, relatedArticles } =
        usePage<PageProps>().props;

    return (
        <>
            <SeoHead />
            <CmsLocaleNotice show={article.is_locale_fallback !== false} />
            <Head title={article.title} />
            <ResourceV2Detail
                kind="news"
                item={article}
                content={articleContent}
                related={relatedArticles}
            />
        </>
    );
}
