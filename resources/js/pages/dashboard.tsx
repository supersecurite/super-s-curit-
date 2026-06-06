import { Head, Link, usePage } from '@inertiajs/react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { index as analyticsIndex } from '@/routes/analytics';
import { index as articlesIndex } from '@/routes/articles';
import { index as candidaturesIndex, show as candidatureShow } from '@/routes/candidatures-agents';
import { index as conseilsIndex } from '@/routes/conseils';
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

type RecentApplication = {
    uuid: string;
    full_name: string;
    phone: string;
    status: string;
    status_label: string;
    created_at_formatted: string | null;
};

type DashboardPageProps = {
    overview: Overview;
    stats?: DashboardStats;
    trafficChart?: ChartPoint[];
    recentApplications?: RecentApplication[];
};

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

function AdminDashboard({
    stats,
    trafficChart,
    recentApplications,
}: {
    stats: DashboardStats;
    trafficChart: ChartPoint[];
    recentApplications: RecentApplication[];
}) {
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
                            Actions en attente
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {pendingTotal} élément{pendingTotal > 1 ? 's' : ''}{' '}
                            nécessite{pendingTotal > 1 ? 'nt' : ''} votre attention.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {stats.applications.pending > 0 ? (
                            <Button asChild size="sm" variant="outline">
                                <Link href={candidaturesIndex.url()}>
                                    {stats.applications.pending} candidature
                                    {stats.applications.pending > 1 ? 's' : ''}
                                </Link>
                            </Button>
                        ) : null}
                        {stats.content.articles_pending > 0 ? (
                            <Button asChild size="sm" variant="outline">
                                <Link href={articlesIndex.url()}>
                                    {stats.content.articles_pending} actualité
                                    {stats.content.articles_pending > 1 ? 's' : ''}
                                </Link>
                            </Button>
                        ) : null}
                        {stats.content.tips_pending > 0 ? (
                            <Button asChild size="sm" variant="outline">
                                <Link href={conseilsIndex.url()}>
                                    {stats.content.tips_pending} conseil
                                    {stats.content.tips_pending > 1 ? 's' : ''}
                                </Link>
                            </Button>
                        ) : null}
                    </div>
                </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    icon={MousePointerClick}
                    label="Pages vues (7 j)"
                    value={stats.visits.views.toLocaleString('fr-FR')}
                    change={stats.visits.views_change}
                    hint={`${stats.visits.visitors.toLocaleString('fr-FR')} visiteurs uniques`}
                    href={analyticsIndex.url()}
                />
                <StatCard
                    icon={UserPlus}
                    label="Candidatures en attente"
                    value={stats.applications.pending}
                    hint={`${stats.applications.this_week} cette semaine · ${stats.applications.total} au total`}
                    href={candidaturesIndex.url()}
                />
                <StatCard
                    icon={Newspaper}
                    label="Actualités publiées"
                    value={stats.content.articles_published}
                    hint={
                        stats.content.articles_pending > 0
                            ? `${stats.content.articles_pending} en attente de validation`
                            : 'Aucune en attente'
                    }
                    href={articlesIndex.url()}
                />
                <StatCard
                    icon={Lightbulb}
                    label="Conseils publiés"
                    value={stats.content.tips_published}
                    hint={
                        stats.content.tips_pending > 0
                            ? `${stats.content.tips_pending} en attente de validation`
                            : 'Aucun en attente'
                    }
                    href={conseilsIndex.url()}
                />
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
                <div className="app-panel p-5 xl:col-span-2">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="font-heading text-lg font-semibold">
                                Trafic des 7 derniers jours
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Pages vues et visiteurs uniques
                            </p>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <Link href={analyticsIndex.url()}>
                                <BarChart3 className="size-4" />
                                Analytics
                            </Link>
                        </Button>
                    </div>
                    <TrafficChart data={trafficChart} height={260} />
                </div>

                <div className="app-panel p-5">
                    <h2 className="font-heading text-lg font-semibold">
                        Vue d&apos;ensemble
                    </h2>
                    <dl className="mt-4 space-y-4">
                        <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
                            <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                                <Users className="size-4" aria-hidden />
                                Utilisateurs
                            </dt>
                            <dd className="font-heading font-semibold">
                                <Link
                                    href={usersIndex.url()}
                                    className="hover:text-super-securite-accent"
                                >
                                    {stats.users}
                                </Link>
                            </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
                            <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                                <FileText className="size-4" aria-hidden />
                                Candidatures totales
                            </dt>
                            <dd className="font-heading font-semibold">
                                {stats.applications.total}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                                <Eye className="size-4" aria-hidden />
                                Visiteurs uniques (7 j)
                            </dt>
                            <dd className="font-heading font-semibold">
                                {stats.visits.visitors.toLocaleString('fr-FR')}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="app-panel overflow-hidden">
                <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                    <div>
                        <h2 className="font-heading text-lg font-semibold">
                            Dernières candidatures
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Les 5 demandes les plus récentes
                        </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href={candidaturesIndex.url()}>
                            Voir tout
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </div>

                {recentApplications.length === 0 ? (
                    <p className="text-muted-foreground px-5 py-8 text-sm">
                        Aucune candidature pour le moment.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-sm">
                            <thead className="bg-muted/40 text-muted-foreground">
                                <tr>
                                    <th className="px-5 py-3 text-left font-medium">
                                        Candidat
                                    </th>
                                    <th className="px-5 py-3 text-left font-medium">
                                        Téléphone
                                    </th>
                                    <th className="px-5 py-3 text-left font-medium">
                                        Statut
                                    </th>
                                    <th className="px-5 py-3 text-left font-medium">
                                        Reçue le
                                    </th>
                                    <th className="px-5 py-3 text-right font-medium">
                                        Action
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
                                                    Voir
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
        </div>
    );
}

function UserDashboard() {
    return (
        <div className="app-panel mx-auto max-w-2xl p-8 text-center">
            <p className="text-muted-foreground text-sm">
                Votre espace personnel Super Sécurité
            </p>
            <p className="mt-3 text-base leading-relaxed">
                Rédigez vos actualités et conseils de sécurité, suivez leur
                validation, ou mettez à jour votre profil.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild>
                    <Link href={articlesIndex.url()}>Mes actualités</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href={conseilsIndex.url()}>Mes conseils</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href={profileEdit.url()}>Mon profil</Link>
                </Button>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { overview, stats, trafficChart = [], recentApplications = [] } =
        usePage<DashboardPageProps>().props;

    return (
        <>
            <Head title="Tableau de bord" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="font-heading text-2xl font-bold tracking-tight">
                        {overview.greeting}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        {overview.role_label} · Tableau de bord Super Sécurité
                    </p>
                </div>

                {overview.is_admin && stats ? (
                    <AdminDashboard
                        stats={stats}
                        trafficChart={trafficChart}
                        recentApplications={recentApplications}
                    />
                ) : (
                    <UserDashboard />
                )}
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Tableau de bord', href: dashboard.url() }],
};
