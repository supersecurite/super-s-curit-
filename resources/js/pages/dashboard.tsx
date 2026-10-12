import { Head, Link, setLayoutProps, usePage } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    BarChart3,
    Eye,
    FileText,
    Lightbulb,
    MousePointerClick,
    Newspaper,
    UserPlus,
    Users,
} from 'lucide-react';
import TrafficChart, {
    type ChartPoint,
} from '@/components/analytics/traffic-chart';
import { useBackofficePermission } from '@/hooks/use-backoffice-permission';
import { useTrans } from '@/hooks/use-trans';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { index as analyticsIndex } from '@/routes/analytics';
import {
    create as articleCreate,
    index as articlesIndex,
    show as articleShow,
} from '@/routes/articles';
import { index as candidaturesIndex, show as candidatureShow } from '@/routes/candidatures-agents';
import {
    create as conseilCreate,
    index as conseilsIndex,
    show as conseilShow,
} from '@/routes/conseils';
import { dashboard } from '@/routes';
import { edit as profileEdit } from '@/routes/profile';
import { index as usersIndex } from '@/routes/users';

type Overview = {
    greeting: string;
    role_label: string;
    is_admin: boolean;
};

type DashboardStats = {
    visits: {
        views: number;
        visitors: number;
        views_change: number | null;
    };
    content: {
        articles_published: number;
        articles_pending: number;
        tips_published: number;
        tips_pending: number;
    };
    applications: {
        pending: number;
        total: number;
        this_week: number;
    };
    users: number;
};

type UserContentSummary = {
    total: number;
    published: number;
    pending: number;
    rejected: number;
    draft: number;
    views: number;
};

type UserDashboardStats = {
    articles: UserContentSummary;
    tips: UserContentSummary;
};

type RecentContentItem = {
    title: string;
    slug: string;
    status: string;
    status_label: string;
    views: number;
    created_at_formatted: string | null;
};

type RecentApplication = {
    uuid: string;
    full_name: string;
    phone: string;
    post_label: string | null;
    status: string;
    status_label: string;
    created_at_formatted: string | null;
};

type DashboardPageProps = {
    overview: Overview;
    stats?: DashboardStats | UserDashboardStats;
    trafficChart?: ChartPoint[];
    recentApplications?: RecentApplication[];
    recentArticles?: RecentContentItem[];
    recentTips?: RecentContentItem[];
};

type TranslateFn = (
    key: string,
    fallbackOrReplace?: string | Record<string, string | number>,
    replace?: Record<string, string | number>,
) => string;

function countLabel(
    t: TranslateFn,
    count: number,
    oneKey: string,
    otherKey: string,
    oneFallback: string,
    otherFallback: string,
): string {
    const key = count > 1 ? otherKey : oneKey;
    const fallback = count > 1 ? otherFallback : oneFallback;

    return t(key, fallback, { count });
}

function ChangeChip({ value }: { value: number | null }) {
    if (value === null) {
        return <span className="text-muted-foreground text-xs">—</span>;
    }

    const positive = value >= 0;

    return (
        <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium ${positive ? 'text-emerald-600' : 'text-red-500'}`}
        >
            {positive ? (
                <ArrowUp className="size-3" aria-hidden />
            ) : (
                <ArrowDown className="size-3" aria-hidden />
            )}
            {Math.abs(value)}%
        </span>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    change,
    hint,
    href,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    change?: number | null;
    hint?: string;
    href?: string;
}) {
    const content = (
        <div className="app-panel flex h-full flex-col gap-3 p-5 transition-colors hover:border-super-securite-accent/40">
            <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground text-sm font-medium">
                    {label}
                </span>
                <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                    <Icon className="size-4" aria-hidden />
                </div>
            </div>
            <div className="flex items-end justify-between gap-2">
                <span className="font-heading text-3xl font-bold tracking-tight">
                    {value}
                </span>
                {change !== undefined && <ChangeChip value={change ?? null} />}
            </div>
            {hint ? (
                <span className="text-muted-foreground text-xs">{hint}</span>
            ) : null}
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block h-full">
                {content}
            </Link>
        );
    }

    return content;
}

function applicationBadgeVariant(
    status: string,
): 'default' | 'secondary' | 'outline' | 'destructive' {
    if (status === 'recruited') {
        return 'default';
    }
    if (status === 'pending') {
        return 'secondary';
    }
    if (status === 'rejected') {
        return 'destructive';
    }
    return 'outline';
}

function contentBadgeVariant(
    status: string,
): 'default' | 'secondary' | 'outline' | 'destructive' {
    if (status === 'published') {
        return 'default';
    }
    if (status === 'pending_approval') {
        return 'secondary';
    }
    if (status === 'rejected') {
        return 'destructive';
    }
    return 'outline';
}

function RecentContentPanel({
    title,
    description,
    items,
    indexHref,
    showHref,
    emptyMessage,
}: {
    title: string;
    description: string;
    items: RecentContentItem[];
    indexHref: string;
    showHref: (slug: string) => string;
    emptyMessage: string;
}) {
    const { t, locale } = useTrans();
    const numberFormat = locale === 'en' ? 'en-US' : 'fr-FR';

    return (
        <div className="app-panel overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                <div>
                    <h2 className="font-heading text-lg font-semibold">
                        {title}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        {description}
                    </p>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link href={indexHref}>
                        {t('dashboard.view_all', 'Voir tout')}
                        <ArrowRight className="size-4" />
                    </Link>
                </Button>
            </div>

            {items.length === 0 ? (
                <p className="text-muted-foreground px-5 py-8 text-sm">
                    {emptyMessage}
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-sm">
                        <thead className="bg-muted/40 text-muted-foreground">
                            <tr>
                                <th className="px-5 py-3 text-left font-medium">
                                    {t('dashboard.col_title', 'Titre')}
                                </th>
                                <th className="px-5 py-3 text-left font-medium">
                                    {t('common.status', 'Statut')}
                                </th>
                                <th className="px-5 py-3 text-left font-medium">
                                    {t('dashboard.col_views', 'Vues')}
                                </th>
                                <th className="px-5 py-3 text-left font-medium">
                                    {t('dashboard.col_created', 'Créé le')}
                                </th>
                                <th className="px-5 py-3 text-right font-medium">
                                    {t('common.actions', 'Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr
                                    key={item.slug}
                                    className="border-t border-border hover:bg-muted/30"
                                >
                                    <td className="max-w-[220px] truncate px-5 py-3 font-medium">
                                        {item.title}
                                    </td>
                                    <td className="px-5 py-3">
                                        <Badge
                                            variant={contentBadgeVariant(
                                                item.status,
                                            )}
                                        >
                                            {item.status_label}
                                        </Badge>
                                    </td>
                                    <td className="text-muted-foreground px-5 py-3">
                                        {item.views.toLocaleString(numberFormat)}
                                    </td>
                                    <td className="text-muted-foreground px-5 py-3">
                                        {item.created_at_formatted ?? '—'}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <Button asChild size="sm" variant="ghost">
                                            <Link href={showHref(item.slug)}>
                                                <Eye className="size-4" />
                                                {t('common.view', 'Voir')}
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function UserDashboard({
    stats,
    recentArticles,
    recentTips,
}: {
    stats: UserDashboardStats;
    recentArticles: RecentContentItem[];
    recentTips: RecentContentItem[];
}) {
    const { t, locale } = useTrans();
    const numberFormat = locale === 'en' ? 'en-US' : 'fr-FR';
    const { has, canAccessFeature } = useBackofficePermission();
    const canCreateArticle = has('articles.create');
    const canCreateConseil = has('conseils.create');
    const canViewArticles = canAccessFeature('articles');
    const canViewConseils = canAccessFeature('conseils');
    const pendingTotal =
        stats.articles.pending +
        stats.tips.pending +
        stats.articles.rejected +
        stats.tips.rejected;
    const pendingValidationCount =
        stats.articles.pending + stats.tips.pending;
    const rejectedCount = stats.articles.rejected + stats.tips.rejected;

    return (
        <div className="flex flex-col gap-6">
            {pendingTotal > 0 ? (
                <div className="app-panel flex flex-col gap-3 border-super-securite-accent/30 bg-super-securite-accent/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-heading text-sm font-semibold text-super-securite-heading">
                            {t(
                                'dashboard.follow_content_title',
                                'Vos contenus à suivre',
                            )}
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {pendingValidationCount > 0
                                ? t(
                                      'dashboard.pending_validation_count',
                                      ':count en attente de validation',
                                      { count: pendingValidationCount },
                                  )
                                : null}
                            {pendingValidationCount > 0 && rejectedCount > 0
                                ? ' · '
                                : null}
                            {rejectedCount > 0
                                ? countLabel(
                                      t,
                                      rejectedCount,
                                      'dashboard.rejected_one',
                                      'dashboard.rejected_other',
                                      ':count refusé',
                                      ':count refusés',
                                  )
                                : null}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {canViewArticles ? (
                            <Button asChild size="sm" variant="outline">
                                <Link href={articlesIndex.url()}>
                                    {t('dashboard.my_articles', 'Mes actualités')}
                                </Link>
                            </Button>
                        ) : null}
                        {canViewConseils ? (
                            <Button asChild size="sm" variant="outline">
                                <Link href={conseilsIndex.url()}>
                                    {t('dashboard.my_tips', 'Mes conseils')}
                                </Link>
                            </Button>
                        ) : null}
                    </div>
                </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {canViewArticles ? (
                    <>
                        <StatCard
                            icon={Newspaper}
                            label={t('dashboard.my_articles', 'Mes actualités')}
                            value={stats.articles.total}
                            hint={t(
                                'dashboard.published_pending_hint_articles',
                                ':published publiée(s) · :pending en attente',
                                {
                                    published: stats.articles.published,
                                    pending: stats.articles.pending,
                                },
                            )}
                            href={articlesIndex.url()}
                        />
                        <StatCard
                            icon={Eye}
                            label={t(
                                'dashboard.article_views',
                                'Vues actualités',
                            )}
                            value={stats.articles.views.toLocaleString(
                                numberFormat,
                            )}
                            hint={
                                stats.articles.published > 0
                                    ? t(
                                          'dashboard.on_published_articles',
                                          'Sur vos articles publiés',
                                      )
                                    : t(
                                          'dashboard.no_published_articles',
                                          'Aucun article publié',
                                      )
                            }
                            href={articlesIndex.url()}
                        />
                    </>
                ) : null}
                {canViewConseils ? (
                    <>
                        <StatCard
                            icon={Lightbulb}
                            label={t('dashboard.my_tips', 'Mes conseils')}
                            value={stats.tips.total}
                            hint={t(
                                'dashboard.published_pending_hint_tips',
                                ':published publié(s) · :pending en attente',
                                {
                                    published: stats.tips.published,
                                    pending: stats.tips.pending,
                                },
                            )}
                            href={conseilsIndex.url()}
                        />
                        <StatCard
                            icon={Eye}
                            label={t('dashboard.tip_views', 'Vues conseils')}
                            value={stats.tips.views.toLocaleString(numberFormat)}
                            hint={
                                stats.tips.published > 0
                                    ? t(
                                          'dashboard.on_published_tips',
                                          'Sur vos conseils publiés',
                                      )
                                    : t(
                                          'dashboard.no_published_tips',
                                          'Aucun conseil publié',
                                      )
                            }
                            href={conseilsIndex.url()}
                        />
                    </>
                ) : null}
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                {canViewArticles ? (
                    <RecentContentPanel
                        title={t(
                            'dashboard.recent_articles',
                            'Dernières actualités',
                        )}
                        description={t(
                            'dashboard.recent_articles_desc',
                            'Vos 5 articles les plus récents',
                        )}
                        items={recentArticles}
                        indexHref={articlesIndex.url()}
                        showHref={(slug) => articleShow.url(slug)}
                        emptyMessage={t(
                            'dashboard.no_articles_yet',
                            "Vous n'avez pas encore rédigé d'actualité.",
                        )}
                    />
                ) : null}
                {canViewConseils ? (
                    <RecentContentPanel
                        title={t('dashboard.recent_tips', 'Derniers conseils')}
                        description={t(
                            'dashboard.recent_tips_desc',
                            'Vos 5 conseils les plus récents',
                        )}
                        items={recentTips}
                        indexHref={conseilsIndex.url()}
                        showHref={(slug) => conseilShow.url(slug)}
                        emptyMessage={t(
                            'dashboard.no_tips_yet',
                            "Vous n'avez pas encore rédigé de conseil.",
                        )}
                    />
                ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
                {canCreateArticle ? (
                    <Button asChild>
                        <Link href={articleCreate.url()}>
                            {t('dashboard.new_article', 'Nouvelle actualité')}
                        </Link>
                    </Button>
                ) : null}
                {canCreateConseil ? (
                    <Button asChild variant="outline">
                        <Link href={conseilCreate.url()}>
                            {t('dashboard.new_tip', 'Nouveau conseil')}
                        </Link>
                    </Button>
                ) : null}
                <Button asChild variant="outline">
                    <Link href={profileEdit.url()}>
                        {t('dashboard.my_profile', 'Mon profil')}
                    </Link>
                </Button>
            </div>
        </div>
    );
}

function AdminDashboard({
    stats,
    trafficChart,
    recentApplications,
}: {
    stats: DashboardStats;
    trafficChart: ChartPoint[];
    recentApplications: RecentApplication[];
}) {
    const { t, locale } = useTrans();
    const numberFormat = locale === 'en' ? 'en-US' : 'fr-FR';
    const { has, canAccessFeature } = useBackofficePermission();
    const canViewAnalytics = has('analytics.view');
    const canViewUsers = canAccessFeature('users');
    const canViewApplications = canAccessFeature('agent_applications');
    const canViewArticles = canAccessFeature('articles');
    const canViewConseils = canAccessFeature('conseils');
    const pendingTotal =
        stats.content.articles_pending +
        stats.content.tips_pending +
        stats.applications.pending;

    return (
        <div className="flex flex-col gap-6">
            {pendingTotal > 0 ? (
                <div className="app-panel flex flex-col gap-3 border-super-securite-accent/30 bg-super-securite-accent/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-heading text-sm font-semibold text-super-securite-heading">
                            {t(
                                'dashboard.pending_banner_title',
                                'Actions en attente',
                            )}
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {t(
                                'dashboard.pending_banner_body',
                                ':count élément(s) nécessite(nt) votre attention.',
                                { count: pendingTotal },
                            )}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {stats.applications.pending > 0 && canViewApplications ? (
                            <Button asChild size="sm" variant="outline">
                                <Link href={candidaturesIndex.url()}>
                                    {countLabel(
                                        t,
                                        stats.applications.pending,
                                        'dashboard.pending_applications_link_one',
                                        'dashboard.pending_applications_link_other',
                                        ':count candidature',
                                        ':count candidatures',
                                    )}
                                </Link>
                            </Button>
                        ) : null}
                        {stats.content.articles_pending > 0 && canViewArticles ? (
                            <Button asChild size="sm" variant="outline">
                                <Link href={articlesIndex.url()}>
                                    {countLabel(
                                        t,
                                        stats.content.articles_pending,
                                        'dashboard.pending_articles_link_one',
                                        'dashboard.pending_articles_link_other',
                                        ':count actualité',
                                        ':count actualités',
                                    )}
                                </Link>
                            </Button>
                        ) : null}
                        {stats.content.tips_pending > 0 && canViewConseils ? (
                            <Button asChild size="sm" variant="outline">
                                <Link href={conseilsIndex.url()}>
                                    {countLabel(
                                        t,
                                        stats.content.tips_pending,
                                        'dashboard.pending_tips_link_one',
                                        'dashboard.pending_tips_link_other',
                                        ':count conseil',
                                        ':count conseils',
                                    )}
                                </Link>
                            </Button>
                        ) : null}
                    </div>
                </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {canViewAnalytics ? (
                    <StatCard
                        icon={MousePointerClick}
                        label={t('dashboard.pages_views_7d', 'Pages vues (7 j)')}
                        value={stats.visits.views.toLocaleString(numberFormat)}
                        change={stats.visits.views_change}
                        hint={t(
                            'dashboard.unique_visitors_hint',
                            ':count visiteurs uniques',
                            {
                                count: stats.visits.visitors.toLocaleString(
                                    numberFormat,
                                ),
                            },
                        )}
                        href={analyticsIndex.url()}
                    />
                ) : null}
                {canViewApplications ? (
                    <StatCard
                        icon={UserPlus}
                        label={t(
                            'dashboard.applications_pending',
                            'Candidatures en attente',
                        )}
                        value={stats.applications.pending}
                        hint={t(
                            'dashboard.applications_week_hint',
                            ':week cette semaine · :total au total',
                            {
                                week: stats.applications.this_week,
                                total: stats.applications.total,
                            },
                        )}
                        href={candidaturesIndex.url()}
                    />
                ) : null}
                {canViewArticles ? (
                    <StatCard
                        icon={Newspaper}
                        label={t(
                            'dashboard.articles_published',
                            'Actualités publiées',
                        )}
                        value={stats.content.articles_published}
                        hint={
                            stats.content.articles_pending > 0
                                ? t(
                                      'dashboard.pending_approval_count',
                                      ':count en attente de validation',
                                      {
                                          count: stats.content.articles_pending,
                                      },
                                  )
                                : t('dashboard.none_pending', 'Aucune en attente')
                        }
                        href={articlesIndex.url()}
                    />
                ) : null}
                {canViewConseils ? (
                    <StatCard
                        icon={Lightbulb}
                        label={t(
                            'dashboard.tips_published',
                            'Conseils publiés',
                        )}
                        value={stats.content.tips_published}
                        hint={
                            stats.content.tips_pending > 0
                                ? t(
                                      'dashboard.pending_approval_count',
                                      ':count en attente de validation',
                                      {
                                          count: stats.content.tips_pending,
                                      },
                                  )
                                : t(
                                      'dashboard.none_pending_m',
                                      'Aucun en attente',
                                  )
                        }
                        href={conseilsIndex.url()}
                    />
                ) : null}
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
                {canViewAnalytics ? (
                    <div className="app-panel p-5 xl:col-span-2">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="font-heading text-lg font-semibold">
                                    {t(
                                        'dashboard.traffic_title',
                                        'Trafic des 7 derniers jours',
                                    )}
                                </h2>
                                <p className="text-muted-foreground text-sm">
                                    {t(
                                        'dashboard.traffic_subtitle',
                                        'Pages vues et visiteurs uniques',
                                    )}
                                </p>
                            </div>
                            <Button asChild variant="outline" size="sm">
                                <Link href={analyticsIndex.url()}>
                                    <BarChart3 className="size-4" />
                                    {t('nav.analytics', 'Analytics')}
                                </Link>
                            </Button>
                        </div>
                        <TrafficChart data={trafficChart} height={260} />
                    </div>
                ) : null}

                <div className="app-panel p-5">
                    <h2 className="font-heading text-lg font-semibold">
                        {t('dashboard.overview_title', "Vue d'ensemble")}
                    </h2>
                    <dl className="mt-4 space-y-4">
                        <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
                            <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                                <Users className="size-4" aria-hidden />
                                {t('dashboard.users', 'Utilisateurs')}
                            </dt>
                            <dd className="font-heading font-semibold">
                                {canViewUsers ? (
                                    <Link
                                        href={usersIndex.url()}
                                        className="hover:text-super-securite-accent"
                                    >
                                        {stats.users}
                                    </Link>
                                ) : (
                                    stats.users
                                )}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
                            <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                                <FileText className="size-4" aria-hidden />
                                {t(
                                    'dashboard.total_applications',
                                    'Candidatures totales',
                                )}
                            </dt>
                            <dd className="font-heading font-semibold">
                                {stats.applications.total}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                                <Eye className="size-4" aria-hidden />
                                {t(
                                    'dashboard.unique_visitors_7d',
                                    'Visiteurs uniques (7 j)',
                                )}
                            </dt>
                            <dd className="font-heading font-semibold">
                                {stats.visits.visitors.toLocaleString(
                                    numberFormat,
                                )}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {canViewApplications ? (
                <div className="app-panel overflow-hidden">
                    <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                        <div>
                            <h2 className="font-heading text-lg font-semibold">
                                {t(
                                    'dashboard.recent_applications',
                                    'Dernières candidatures',
                                )}
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                {t(
                                    'dashboard.recent_applications_desc',
                                    'Les 5 demandes les plus récentes',
                                )}
                            </p>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <Link href={candidaturesIndex.url()}>
                                {t('dashboard.view_all', 'Voir tout')}
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>

                    {recentApplications.length === 0 ? (
                        <p className="text-muted-foreground px-5 py-8 text-sm">
                            {t(
                                'dashboard.no_applications',
                                'Aucune candidature pour le moment.',
                            )}
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px] text-sm">
                                <thead className="bg-muted/40 text-muted-foreground">
                                    <tr>
                                        <th className="px-5 py-3 text-left font-medium">
                                            {t(
                                                'dashboard.col_candidate',
                                                'Candidat',
                                            )}
                                        </th>
                                        <th className="px-5 py-3 text-left font-medium">
                                            {t('dashboard.col_post', 'Poste')}
                                        </th>
                                        <th className="px-5 py-3 text-left font-medium">
                                            {t('common.phone', 'Téléphone')}
                                        </th>
                                        <th className="px-5 py-3 text-left font-medium">
                                            {t('common.status', 'Statut')}
                                        </th>
                                        <th className="px-5 py-3 text-left font-medium">
                                            {t(
                                                'dashboard.col_received',
                                                'Reçue le',
                                            )}
                                        </th>
                                        <th className="px-5 py-3 text-right font-medium">
                                            {t('common.actions', 'Actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentApplications.map((application) => (
                                        <tr
                                            key={application.uuid}
                                            className="border-t border-border hover:bg-muted/30"
                                        >
                                            <td className="px-5 py-3 font-medium">
                                                {application.full_name}
                                            </td>
                                            <td className="text-muted-foreground px-5 py-3">
                                                {application.post_label ?? '—'}
                                            </td>
                                            <td className="text-muted-foreground px-5 py-3">
                                                {application.phone}
                                            </td>
                                            <td className="px-5 py-3">
                                                <Badge
                                                    variant={applicationBadgeVariant(
                                                        application.status,
                                                    )}
                                                >
                                                    {application.status_label}
                                                </Badge>
                                            </td>
                                            <td className="text-muted-foreground px-5 py-3">
                                                {application.created_at_formatted ??
                                                    '—'}
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <Button asChild size="sm" variant="ghost">
                                                    <Link
                                                        href={candidatureShow.url(
                                                            application.uuid,
                                                        )}
                                                    >
                                                        <Eye className="size-4" />
                                                        {t('common.view', 'Voir')}
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}

export default function Dashboard() {
    const { t } = useTrans();
    const {
        overview,
        stats,
        trafficChart = [],
        recentApplications = [],
        recentArticles = [],
        recentTips = [],
    } = usePage<DashboardPageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            {
                title: t('dashboard.breadcrumb', 'Tableau de bord'),
                href: dashboard.url(),
            },
        ],
    });

    const adminStats =
        overview.is_admin && stats && 'visits' in stats
            ? (stats as DashboardStats)
            : null;
    const userStats =
        !overview.is_admin && stats && 'articles' in stats
            ? (stats as UserDashboardStats)
            : null;

    return (
        <>
            <Head title={t('dashboard.title', 'Dashboard')} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="font-heading text-2xl font-bold tracking-tight">
                        {overview.greeting}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        {overview.role_label} · {t('dashboard.title', 'Dashboard')}
                    </p>
                </div>

                {adminStats ? (
                    <AdminDashboard
                        stats={adminStats}
                        trafficChart={trafficChart}
                        recentApplications={recentApplications}
                    />
                ) : userStats ? (
                    <UserDashboard
                        stats={userStats}
                        recentArticles={recentArticles}
                        recentTips={recentTips}
                    />
                ) : null}
            </div>
        </>
    );
}
