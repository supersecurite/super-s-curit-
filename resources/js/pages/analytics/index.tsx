import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowDown,
    ArrowUp,
    BarChart3,
    Clock,
    Globe,
    Monitor,
    MousePointerClick,
    TrendingUp,
    Users,
} from 'lucide-react';
import CountryFlag from '@/components/analytics/country-flag';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { index } from '@/routes/analytics';

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

type KpiData = {
    total_views: number;
    total_views_change: number | null;
    unique_visitors: number;
    unique_visitors_change: number | null;
    sessions: number;
    sessions_change: number | null;
    avg_duration_seconds: number;
    bounce_rate: number;
};

type ChartPoint = { date: string; views: number; visitors: number };

type TopPage = { path: string; views: number; visitors: number };

type TopReferrer = { referrer_domain: string; count: number };

type GroupRow = { label: string; count: number; percentage: number };

type CountryRow = {
    country_code: string;
    country: string;
    views: number;
    visitors: number;
    percentage: number;
};

type PageProps = {
    period: number;
    kpis: KpiData;
    chartData: ChartPoint[];
    topPages: TopPage[];
    topReferrers: TopReferrer[];
    countries: CountryRow[];
    browsers: GroupRow[];
    devices: GroupRow[];
    platforms: GroupRow[];
};

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function formatDuration(seconds: number): string {
    if (seconds < 60) {
        return `${seconds}s`;
    }

    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function formatNumber(n: number): string {
    return n.toLocaleString('fr-FR');
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

function KpiCard({
    icon: Icon,
    label,
    value,
    change,
    sub,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    change?: number | null;
    sub?: string;
}) {
    return (
        <div className="app-panel flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">
                    {label}
                </span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" aria-hidden />
                </div>
            </div>
            <div className="flex items-end justify-between gap-2">
                <span className="font-heading text-3xl font-bold tracking-tight">
                    {value}
                </span>
                {change !== undefined && <ChangeChip value={change ?? null} />}
            </div>
            {sub && (
                <span className="text-muted-foreground text-xs">{sub}</span>
            )}
        </div>
    );
}

/* Mini sparkline chart using SVG – no external library */
function SparkLine({ data }: { data: ChartPoint[] }) {
    const maxViews = Math.max(...data.map((d) => d.views), 1);
    const w = 100;
    const h = 40;
    const pad = 2;

    const points = data.map((d, i) => {
        const x = pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2);
        const y = pad + (1 - d.views / maxViews) * (h - pad * 2);
        return `${x},${y}`;
    });

    return (
        <svg
            viewBox={`0 0 ${w} ${h}`}
            className="text-primary w-full"
            preserveAspectRatio="none"
            aria-hidden
        >
            <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={points.join(' ')}
            />
        </svg>
    );
}

/* Bar chart row */
function CountryStatRow({
    country_code,
    country,
    views,
    visitors,
    percentage,
}: CountryRow) {
    return (
        <div className="flex items-center gap-3 text-sm">
            <CountryFlag code={country_code} className="h-4 w-6 shrink-0" />
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium">{country}</span>
                    <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                        {formatNumber(visitors)} visiteurs
                    </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <span className="w-16 shrink-0 text-right text-xs tabular-nums">
                        {formatNumber(views)} ({percentage}%)
                    </span>
                </div>
            </div>
        </div>
    );
}

function BarRow({ label, count, percentage }: GroupRow) {
    return (
        <div className="flex items-center gap-3 text-sm">
            <span className="w-28 truncate text-muted-foreground shrink-0">
                {label}
            </span>
            <div className="flex-1 overflow-hidden rounded-full bg-border h-1.5">
                <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="w-10 text-right font-medium tabular-nums">
                {formatNumber(count)}
            </span>
            <span className="text-muted-foreground w-12 text-right tabular-nums">
                {percentage}%
            </span>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const PERIODS = [
    { label: '7 j', value: 7 },
    { label: '14 j', value: 14 },
    { label: '30 j', value: 30 },
    { label: '90 j', value: 90 },
];

export default function AnalyticsIndex() {
    const {
        period,
        kpis,
        chartData,
        topPages,
        topReferrers,
        countries,
        browsers,
        devices,
        platforms,
    } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Analytics" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="font-heading flex items-center gap-2 text-2xl font-semibold tracking-tight">
                            <BarChart3 className="size-6 text-primary" aria-hidden />
                            Analytics
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Trafic réel — hors bots, {period} derniers jours
                        </p>
                    </div>
                    {/* Period selector */}
                    <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
                        {PERIODS.map((p) => (
                            <Button
                                key={p.value}
                                variant={period === p.value ? 'default' : 'ghost'}
                                size="sm"
                                asChild
                            >
                                <Link
                                    href={index.url({ query: { period: p.value } })}
                                    preserveScroll
                                >
                                    {p.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* KPI cards */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <KpiCard
                        icon={MousePointerClick}
                        label="Pages vues"
                        value={formatNumber(kpis.total_views)}
                        change={kpis.total_views_change}
                        sub="vs période précédente"
                    />
                    <KpiCard
                        icon={Users}
                        label="Visiteurs uniques"
                        value={formatNumber(kpis.unique_visitors)}
                        change={kpis.unique_visitors_change}
                    />
                    <KpiCard
                        icon={Activity}
                        label="Sessions"
                        value={formatNumber(kpis.sessions)}
                        change={kpis.sessions_change}
                    />
                    <KpiCard
                        icon={Clock}
                        label="Durée moy."
                        value={formatDuration(kpis.avg_duration_seconds)}
                        sub={`Taux de rebond : ${kpis.bounce_rate}%`}
                    />
                </div>

                {/* Sparkline chart */}
                <div className="app-panel p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-heading text-sm font-semibold">
                            Évolution du trafic
                        </h2>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <span className="inline-block h-0.5 w-4 rounded-full bg-primary" />
                                Pages vues
                            </span>
                        </div>
                    </div>

                    {/* Grid + sparkline */}
                    <div className="relative h-40">
                        {/* Y-axis grid */}
                        <div className="absolute inset-0 flex flex-col justify-between py-1">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="border-t border-border/50 w-full"
                                />
                            ))}
                        </div>
                        {/* Chart bars */}
                        <div className="relative flex h-full items-end gap-px px-1">
                            {chartData.map((d) => {
                                const max = Math.max(...chartData.map((x) => x.views), 1);
                                const pct = (d.views / max) * 100;
                                return (
                                    <div
                                        key={d.date}
                                        className="group relative flex flex-1 flex-col items-center justify-end"
                                        title={`${d.date} : ${d.views} vues`}
                                    >
                                        <div
                                            className="w-full rounded-t-sm bg-primary/60 transition-all duration-300 group-hover:bg-primary"
                                            style={{ height: `${Math.max(pct, 1)}%` }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* X-axis labels — show only first and last */}
                    <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                        <span>{chartData[0]?.date ?? ''}</span>
                        <span>{chartData[chartData.length - 1]?.date ?? ''}</span>
                    </div>
                </div>

                {/* Bottom grid : pages, referrers, browsers, devices */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* Top pages */}
                    <div className="app-panel p-5">
                        <h2 className="font-heading mb-4 flex items-center gap-2 text-sm font-semibold">
                            <TrendingUp className="size-4 text-primary" aria-hidden />
                            Pages populaires
                        </h2>
                        <div className="divide-y divide-border">
                            {topPages.length === 0 ? (
                                <p className="text-muted-foreground py-6 text-center text-sm">
                                    Aucune donnée
                                </p>
                            ) : (
                                topPages.map((page) => (
                                    <div
                                        key={page.path}
                                        className="flex items-center justify-between gap-2 py-2.5 text-sm"
                                    >
                                        <span
                                            className="max-w-[60%] truncate font-mono text-xs text-foreground"
                                            title={page.path}
                                        >
                                            {page.path}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline">
                                                {formatNumber(page.views)} vues
                                            </Badge>
                                            <span className="text-muted-foreground text-xs">
                                                {formatNumber(page.visitors)} visites
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Countries */}
                    <div className="app-panel p-5 lg:col-span-2">
                        <h2 className="font-heading mb-4 flex items-center gap-2 text-sm font-semibold">
                            <Globe className="size-4 text-primary" aria-hidden />
                            Pays des visiteurs
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {countries.length === 0 ? (
                                <p className="text-muted-foreground col-span-full py-6 text-center text-sm">
                                    Aucune donnée géographique pour cette période.
                                </p>
                            ) : (
                                countries.map((country) => (
                                    <CountryStatRow
                                        key={country.country_code}
                                        {...country}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Top referrers */}
                    <div className="app-panel p-5">
                        <h2 className="font-heading mb-4 flex items-center gap-2 text-sm font-semibold">
                            <Globe className="size-4 text-primary" aria-hidden />
                            Sources de trafic
                        </h2>
                        <div className="divide-y divide-border">
                            {topReferrers.length === 0 ? (
                                <p className="text-muted-foreground py-6 text-center text-sm">
                                    Trafic direct uniquement
                                </p>
                            ) : (
                                topReferrers.map((ref) => (
                                    <div
                                        key={ref.referrer_domain}
                                        className="flex items-center justify-between gap-2 py-2.5 text-sm"
                                    >
                                        <span className="truncate">
                                            {ref.referrer_domain}
                                        </span>
                                        <Badge variant="secondary">
                                            {formatNumber(ref.count)}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Browsers */}
                    <div className="app-panel p-5">
                        <h2 className="font-heading mb-4 flex items-center gap-2 text-sm font-semibold">
                            <Monitor className="size-4 text-primary" aria-hidden />
                            Navigateurs
                        </h2>
                        <div className="space-y-3">
                            {browsers.map((b) => (
                                <BarRow key={b.label} {...b} />
                            ))}
                            {browsers.length === 0 && (
                                <p className="text-muted-foreground text-center text-sm">
                                    Aucune donnée
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Devices + Platforms */}
                    <div className="flex flex-col gap-4">
                        <div className="app-panel flex-1 p-5">
                            <h2 className="font-heading mb-4 text-sm font-semibold">
                                Appareils
                            </h2>
                            <div className="space-y-3">
                                {devices.map((d) => (
                                    <BarRow key={d.label} {...d} />
                                ))}
                            </div>
                        </div>
                        <div className="app-panel flex-1 p-5">
                            <h2 className="font-heading mb-4 text-sm font-semibold">
                                Systèmes
                            </h2>
                            <div className="space-y-3">
                                {platforms.map((p) => (
                                    <BarRow key={p.label} {...p} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AnalyticsIndex.layout = {
    breadcrumbs: [{ title: 'Analytics', href: '/analytics' }],
};
