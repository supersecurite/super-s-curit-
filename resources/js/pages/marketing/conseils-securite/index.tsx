import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    Clock,
    Eye,
    Search,
    Shield,
    Star,
} from 'lucide-react';
import PageHero from '@/components/marketing/page-hero';
import ContentShareButton from '@/components/content-share-button';
import SeoHead from '@/components/marketing/seo-head';
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
    };
};

function SecurityTipCardItem({ tip }: { tip: SecurityTipCard }) {
    return (
        <article className="marketing-card-interactive group overflow-hidden p-0">
            <div className="relative aspect-video overflow-hidden">
                {tip.image_url ? (
                    <img
                        src={tip.image_url}
                        alt={tip.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="bg-super-securite-surface-elevated flex h-full items-center justify-center">
                        <Shield className="text-super-securite-muted size-10" />
                    </div>
                )}
                {tip.category ? (
                    <span className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {tip.category}
                    </span>
                ) : null}
            </div>

            <div className="p-6">
                <div className="text-super-securite-muted mb-3 flex items-center gap-3 text-sm">
                    {tip.published_at_formatted ? (
                        <span className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            {tip.published_at_formatted}
                        </span>
                    ) : null}
                    <span className="flex items-center gap-1">
                        <Clock className="size-4" />
                        {tip.read_time} min
                    </span>
                </div>

                <h2 className="font-heading group-hover:text-super-securite-accent mb-3 line-clamp-2 text-xl font-semibold text-super-securite-heading transition-colors">
                    {tip.title}
                </h2>

                {tip.excerpt ? (
                    <p className="text-super-securite-muted mb-4 line-clamp-3 text-sm">
                        {tip.excerpt}
                    </p>
                ) : null}

                <div className="flex items-center justify-between border-t border-super-securite-border pt-4">
                    <span className="text-super-securite-muted flex items-center gap-1 text-sm">
                        <Eye className="size-4" />
                        {tip.views}
                    </span>
                    <div className="flex items-center gap-1">
                        <ContentShareButton
                            title={tip.title}
                            url={conseilsShow.url(tip.slug)}
                            description={tip.excerpt}
                            variant="marketing"
                        />
                        <Link
                            href={conseilsShow.url(tip.slug)}
                            className="text-super-securite-accent inline-flex items-center gap-1 text-sm font-semibold"
                        >
                            Lire
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function MarketingConseilsSecuriteIndex() {
    const { securityTips, featuredSecurityTips, categories, filters } =
        usePage<PageProps>().props;

    const applyFilters = (updates: Record<string, string>) => {
        router.get(
            conseilsIndex.url(),
            { ...filters, ...updates },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <SeoHead />
            <Head title="Conseils de sécurité" />

            <PageHero
                label="Conseils"
                title={
                    <>
                        Nos conseils de{' '}
                        <span className="marketing-text-gradient">
                            sécurité
                        </span>
                    </>
                }
                description="Prévention, bonnes pratiques et recommandations pour protéger vos locaux, événements et équipes en Guinée."
            />

            <section className="marketing-section-band marketing-below-fold py-16">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="mb-10 flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="text-super-securite-muted absolute top-1/2 left-4 size-4 -translate-y-1/2" />
                            <input
                                type="search"
                                placeholder="Rechercher un conseil..."
                                defaultValue={filters.search ?? ''}
                                onChange={(e) =>
                                    applyFilters({ search: e.target.value })
                                }
                                className="w-full rounded-xl border border-super-securite-border bg-white/70 py-3 pr-4 pl-11 text-super-securite-heading backdrop-blur-sm focus:ring-2 focus:ring-super-securite-accent focus:outline-none"
                            />
                        </div>
                        <select
                            defaultValue={filters.category ?? 'all'}
                            onChange={(e) =>
                                applyFilters({ category: e.target.value })
                            }
                            className="rounded-xl border border-super-securite-border bg-white/70 px-4 py-3 text-super-securite-heading focus:ring-2 focus:ring-super-securite-accent focus:outline-none"
                        >
                            <option value="all">Toutes les catégories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {featuredSecurityTips.length > 0 ? (
                        <div className="mb-12">
                            <h2 className="marketing-heading-section mb-6 flex items-center gap-2">
                                <Star className="text-super-securite-accent size-5" />
                                À la une
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
                                Aucun conseil publié pour le moment.
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
                                            router.get(link.url, {}, {
                                                preserveState: true,
                                            });
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
