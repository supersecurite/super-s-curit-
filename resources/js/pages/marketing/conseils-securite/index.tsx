import { useTrans } from '@/hooks/use-trans';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Calendar, Clock, Eye, Shield, Star } from 'lucide-react';
import MarketingContentFilters from '@/components/marketing/marketing-content-filters';
import MarketingFullscreenHero from '@/components/marketing/marketing-fullscreen-hero';
import MarketingContentImage from '@/components/marketing/marketing-content-image';
import ContentShareButton from '@/components/content-share-button';
import CmsLocaleNotice from '@/components/marketing/cms-locale-notice';
import SeoHead from '@/components/marketing/seo-head';
import type { MarketingContentImageSource } from '@/types/marketing-content';
import { useMarketingPageHero } from '@/hooks/use-marketing-page-hero';
import {
    index as conseilsIndex,
    show as conseilsShow,
} from '@/routes/conseils-securite';

type SecurityTipCard = {
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

type PaginatedSecurityTips = {
    data: SecurityTipCard[];
    current_page: number;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type PageProps = {
    securityTips: PaginatedSecurityTips;
    featuredSecurityTips: SecurityTipCard[];
    categories: string[];
    filters: {
        search?: string;
        category?: string;
        sort_by?: string;
        sort_direction?: string;
    };
};

function SecurityTipCardItem({ tip }: { tip: SecurityTipCard }) {
    const { t } = useTrans();
    const lp = useLocalizedUrl();
    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl bg-super-securite-surface shadow-md shadow-slate-900/5 transition-shadow duration-200 hover:shadow-lg hover:shadow-slate-900/10">
            <div className="relative aspect-video overflow-hidden">
                {tip.image_url ? (
                    <MarketingContentImage
                        src={tip.image_url}
                        source={tip.image_source}
                        alt={tip.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-super-securite-surface-elevated">
                        <Shield className="size-10 text-super-securite-muted" />
                    </div>
                )}
                {tip.category ? (
                    <span className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {tip.category}
                    </span>
                ) : null}
            </div>

            <div className="p-6">
                <div className="mb-3 flex items-center gap-3 text-sm text-super-securite-muted">
                    {tip.published_at_formatted ? (
                        <span className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            {tip.published_at_formatted}
                        </span>
                    ) : null}
                    <span className="flex items-center gap-1">
                        <Clock className="size-4" />
                        {t('public_content.minutes', { count: tip.read_time })}
                    </span>
                </div>

                <h2 className="mb-3 line-clamp-2 font-heading text-xl font-semibold text-super-securite-heading transition-colors group-hover:text-super-securite-accent">
                    {tip.title}
                </h2>

                {tip.excerpt ? (
                    <p className="mb-4 line-clamp-3 text-sm text-super-securite-muted">
                        {tip.excerpt}
                    </p>
                ) : null}

                <div className="flex items-center justify-between border-t border-super-securite-border pt-4">
                    <span className="flex items-center gap-1 text-sm text-super-securite-muted">
                        <Eye className="size-4" />
                        {tip.views}
                    </span>
                    <div className="flex items-center gap-1">
                        <ContentShareButton
                            title={tip.title}
                            url={lp(conseilsShow.url(tip.slug))}
                            description={tip.excerpt}
                            variant="marketing"
                        />
                        <Link
                            href={lp(conseilsShow.url(tip.slug))}
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

export default function MarketingConseilsSecuriteIndex() {
    const { t } = useTrans();
    const lp = useLocalizedUrl();
    const { securityTips, featuredSecurityTips, categories, filters } =
        usePage<PageProps>().props;
    const hero = useMarketingPageHero('conseils');

    return (
        <>
            <SeoHead />
            <CmsLocaleNotice />
            <Head title={hero.label} />

            <MarketingFullscreenHero {...hero} />

            <section className="marketing-section-band marketing-below-fold py-16">
                <div className="container mx-auto max-w-6xl px-4">
                    <MarketingContentFilters
                        filters={filters}
                        categories={categories}
                        indexUrl={lp(conseilsIndex.url())}
                        searchPlaceholder={t('tips.search_placeholder')}
                    />

                    {featuredSecurityTips.length > 0 ? (
                        <div className="mb-12">
                            <h2 className="marketing-heading-section mb-6 flex items-center gap-2">
                                <Star className="size-5 text-super-securite-accent" />
                                {t('common.featured')}
                            </h2>
                            <div className="grid gap-6 md:grid-cols-3">
                                {featuredSecurityTips.map((tip) => (
                                    <SecurityTipCardItem
                                        key={tip.id}
                                        tip={tip}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {securityTips.data.map((tip) => (
                            <SecurityTipCardItem key={tip.id} tip={tip} />
                        ))}
                    </div>

                    {securityTips.data.length === 0 ? (
                        <div className="marketing-card py-12 text-center">
                            <p className="text-super-securite-muted">
                                {t('tips.empty')}
                            </p>
                        </div>
                    ) : null}

                    {securityTips.last_page > 1 ? (
                        <div className="mt-10 flex flex-wrap justify-center gap-2">
                            {securityTips.links.map((link, index) => (
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
        </>
    );
}
