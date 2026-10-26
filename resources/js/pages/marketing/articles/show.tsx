import { useTrans } from '@/hooks/use-trans';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, ChevronLeft, Clock, Eye } from 'lucide-react';
import ContentRenderer from '@/components/lexical-editor/content-renderer';
import ContentShareLinks from '@/components/content-share-links';
import MarketingContentImage from '@/components/marketing/marketing-content-image';
import CmsLocaleNotice from '@/components/marketing/cms-locale-notice';
import SeoHead from '@/components/marketing/seo-head';
import type { MarketingContentImageSource } from '@/types/marketing-content';
import {
    index as actualitesIndex,
    show as actualitesShow,
} from '@/routes/actualites';

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

export default function MarketingArticleShow() {
    const { t } = useTrans();
    const lp = useLocalizedUrl();
    const { article, articleContent, relatedArticles } =
        usePage<PageProps>().props;

    return (
        <>
            <SeoHead />
            <CmsLocaleNotice show={article.is_locale_fallback !== false} />
            <Head title={article.title} />

            <section className="marketing-section-band py-12 md:py-16">
                <div className="container mx-auto max-w-4xl px-4">
                    <Link
                        href={lp(actualitesIndex.url())}
                        className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-super-securite-muted transition-colors hover:text-super-securite-accent"
                    >
                        <ChevronLeft className="size-4" />
                        {t('public_content.back_articles')}
                    </Link>

                    <article>
                        {article.image_url ? (
                            <div className="relative mb-6 h-72 overflow-hidden rounded-2xl md:mb-8 md:h-96">
                                <MarketingContentImage
                                    src={article.image_url}
                                    source={article.image_source}
                                    alt={article.title}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </div>
                        ) : null}

                        <div className="marketing-card">
                            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
                                {article.category ? (
                                    <span className="rounded-full bg-super-securite-accent px-4 py-1 font-medium text-white">
                                        {article.category}
                                    </span>
                                ) : null}
                                {article.published_at_formatted ? (
                                    <span className="flex items-center gap-1 text-super-securite-muted">
                                        <Calendar className="size-4" />
                                        {article.published_at_formatted}
                                    </span>
                                ) : null}
                                <span className="flex items-center gap-1 text-super-securite-muted">
                                    <Clock className="size-4" />
                                    {t('public_content.reading', {
                                        count: article.read_time,
                                    })}
                                </span>
                                <span className="flex items-center gap-1 text-super-securite-muted">
                                    <Eye className="size-4" />
                                    {t('public_content.views', {
                                        count: article.views,
                                    })}
                                </span>
                            </div>

                            <h1 className="marketing-heading-display mb-6">
                                {article.title}
                            </h1>

                            {article.excerpt ? (
                                <p className="mb-8 text-lg leading-relaxed text-super-securite-muted">
                                    {article.excerpt}
                                </p>
                            ) : null}

                            <ContentRenderer content={articleContent} />

                            <div className="mt-10">
                                <ContentShareLinks
                                    title={article.title}
                                    url={lp(actualitesShow.url(article.slug))}
                                    description={article.excerpt}
                                    variant="marketing"
                                />
                            </div>
                        </div>
                    </article>

                    {relatedArticles.length > 0 ? (
                        <section className="mt-16">
                            <h2 className="marketing-heading-section mb-8">
                                {t('public_content.related_articles')}
                            </h2>
                            <div className="grid gap-6 md:grid-cols-3">
                                {relatedArticles.map((related) => (
                                    <Link
                                        key={related.id}
                                        href={lp(
                                            actualitesShow.url(related.slug),
                                        )}
                                        className="group flex flex-col overflow-hidden rounded-2xl bg-super-securite-surface shadow-md shadow-slate-900/5 transition-shadow duration-200 hover:shadow-lg hover:shadow-slate-900/10"
                                    >
                                        {related.image_url ? (
                                            <MarketingContentImage
                                                src={related.image_url}
                                                source={related.image_source}
                                                alt={related.title}
                                                className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="h-40 bg-super-securite-surface-elevated" />
                                        )}
                                        <div className="p-5">
                                            <h3 className="mb-2 line-clamp-2 font-heading font-semibold text-super-securite-heading group-hover:text-super-securite-accent">
                                                {related.title}
                                            </h3>
                                            {related.excerpt ? (
                                                <p className="line-clamp-2 text-sm text-super-securite-muted">
                                                    {related.excerpt}
                                                </p>
                                            ) : null}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ) : null}
                </div>
            </section>
        </>
    );
}
