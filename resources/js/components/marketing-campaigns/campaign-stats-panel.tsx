import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    Eye,
    MailCheck,
    Send,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export type CampaignStats = {
    total: number;
    queued: number;
    sent: number;
    received: number;
    read: number;
    failed: number;
    bounced: number;
};

type CampaignStatsPanelProps = {
    stats: CampaignStats;
    channel: string;
    selectedStatusFilter?: string | null;
    onSelectStatusFilter?: (status: string | null) => void;
};

type StatSlice = {
    key: string;
    label: string;
    value: number;
    color: string;
    description: string;
};

function percent(value: number, total: number): number {
    if (total <= 0) {
        return 0;
    }

    return Math.round((value / total) * 1000) / 10;
}

function DonutChart({
    slices,
    total,
    activeSliceKey,
    onHoverSlice,
}: {
    slices: StatSlice[];
    total: number;
    activeSliceKey: string | null;
    onHoverSlice: (key: string | null) => void;
}) {
    const size = 180;
    const stroke = 24;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    const activeSlice = slices.find((slice) => slice.key === activeSliceKey);

    return (
        <div className="relative mx-auto size-48">
            <svg viewBox={`0 0 ${size} ${size}`} className="size-full -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={stroke}
                    className="text-muted/20"
                />
                {slices
                    .filter((slice) => slice.value > 0)
                    .map((slice) => {
                        const length = total > 0 ? (slice.value / total) * circumference : 0;
                        const isHovered = activeSliceKey === slice.key;
                        const circle = (
                            <circle
                                key={slice.key}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="transparent"
                                stroke={slice.color}
                                strokeWidth={isHovered ? stroke + 4 : stroke}
                                strokeDasharray={`${length} ${circumference - length}`}
                                strokeDashoffset={-offset}
                                strokeLinecap="butt"
                                className="cursor-pointer transition-all duration-200"
                                onMouseEnter={() => onHoverSlice(slice.key)}
                                onMouseLeave={() => onHoverSlice(null)}
                            />
                        );
                        offset += length;

                        return circle;
                    })}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                {activeSlice ? (
                    <>
                        <p className="text-[11px] font-medium text-muted-foreground truncate max-w-[100px]">
                            {activeSlice.label}
                        </p>
                        <p className="font-heading text-xl font-bold">{activeSlice.value}</p>
                        <p className="text-[10px] font-semibold" style={{ color: activeSlice.color }}>
                            {percent(activeSlice.value, total)}%
                        </p>
                    </>
                ) : (
                    <>
                        <p className="font-heading text-2xl font-bold tracking-tight">{total}</p>
                        <p className="text-muted-foreground text-xs">destinataires</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default function CampaignStatsPanel({
    stats,
    channel,
    selectedStatusFilter = null,
    onSelectStatusFilter,
}: CampaignStatsPanelProps) {
    const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
    const isWhatsApp = channel === 'whatsapp';

    const failures = stats.failed + stats.bounced;
    const deliveredCount = stats.received + stats.read;
    const sentCount = stats.sent + deliveredCount + failures;

    // Rates calculation
    const deliverabilityRate = percent(deliveredCount, stats.total - stats.queued);
    const openRate = deliveredCount > 0 ? percent(stats.read, deliveredCount) : percent(stats.read, stats.total);
    const failureRate = percent(failures, stats.total);
    const processedRate = percent(stats.total - stats.queued, stats.total);

    const slices: StatSlice[] = [
        {
            key: 'queued',
            label: 'En file',
            value: stats.queued,
            color: '#94a3b8',
            description: 'En attente de traitement par les workers',
        },
        {
            key: 'sent',
            label: 'Envoyés',
            value: stats.sent,
            color: '#3b82f6',
            description: isWhatsApp ? 'Transmis au serveur WhatsApp' : 'Expédiés via le serveur SMTP',
        },
        {
            key: 'received',
            label: isWhatsApp ? 'Reçus (distribués)' : 'Reçus (délivrés)',
            value: stats.received,
            color: '#06b6d4',
            description: isWhatsApp ? 'Reçus sur l’appareil du destinataire' : 'Arrivés en boîte de réception',
        },
        {
            key: 'read',
            label: isWhatsApp ? 'Lus (read)' : 'Ouverts',
            value: stats.read,
            color: '#10b981',
            description: isWhatsApp ? 'Confirmés lus par WhatsApp' : 'Ouverture détectée par tracking',
        },
        {
            key: 'failed',
            label: 'Échecs / Rebonds',
            value: failures,
            color: '#ef4444',
            description: 'Numéro invalide, rejet ou erreur d’envoi',
        },
    ];

    const kpiCards = [
        {
            id: 'total',
            label: 'Destinataires ciblés',
            value: stats.total,
            icon: Users,
            subtext: `${stats.total - stats.queued} traités sur ${stats.total}`,
            badge: `${processedRate}% traité`,
            badgeColor: 'bg-primary/10 text-primary border-primary/20',
        },
        {
            id: 'deliverability',
            label: isWhatsApp ? 'Taux de réception' : 'Taux de délivrabilité',
            value: `${deliverabilityRate}%`,
            icon: MailCheck,
            subtext: `${deliveredCount} message(s) distribué(s)`,
            badge: deliverabilityRate >= 90 ? 'Excellent' : deliverabilityRate >= 70 ? 'Bon' : 'Moyen',
            badgeColor: deliverabilityRate >= 90 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        },
        {
            id: 'open',
            label: isWhatsApp ? 'Taux de lecture' : 'Taux d’ouverture',
            value: `${openRate}%`,
            icon: isWhatsApp ? Eye : TrendingUp,
            subtext: `${stats.read} lu(s) / ouvert(s)`,
            badge: `${stats.read} confirmation(s)`,
            badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        },
        {
            id: 'failed',
            label: 'Taux d’échec',
            value: `${failureRate}%`,
            icon: AlertTriangle,
            subtext: `${failures} échec(s) / rebond(s)`,
            badge: failures === 0 ? '0 erreur' : `${failures} anomalie(s)`,
            badgeColor: failures === 0 ? 'bg-muted text-muted-foreground border-border' : 'bg-destructive/10 text-destructive border-destructive/20',
        },
    ];

    const funnelSteps = [
        {
            step: 1,
            label: 'Cible totale',
            value: stats.total,
            pct: 100,
            icon: Users,
            color: 'bg-slate-500',
        },
        {
            step: 2,
            label: 'Expédiés',
            value: sentCount,
            pct: percent(sentCount, stats.total),
            icon: Send,
            color: 'bg-blue-500',
        },
        {
            step: 3,
            label: isWhatsApp ? 'Reçus' : 'Délivrés',
            value: deliveredCount,
            pct: percent(deliveredCount, stats.total),
            icon: CheckCircle2,
            color: 'bg-cyan-500',
        },
        {
            step: 4,
            label: isWhatsApp ? 'Confirmés lus' : 'Ouverts',
            value: stats.read,
            pct: percent(stats.read, stats.total),
            icon: isWhatsApp ? Eye : MailCheck,
            color: 'bg-emerald-500',
        },
    ];

    return (
        <section className="app-panel space-y-6 p-5">
            {/* Header & Main KPIs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                    <h2 className="font-heading text-lg font-semibold tracking-tight">
                        Tableau de bord de performance
                    </h2>
                    <p className="text-muted-foreground text-xs mt-0.5">
                        Statistiques de diffusion et indicateurs d’engagement en temps réel.
                    </p>
                </div>
                {stats.queued > 0 ? (
                    <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                        <Clock className="size-3.5 animate-spin" />
                        <span>{stats.queued} envoi(s) encore en file d’attente</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3.5" />
                        <span>Campagne entièrement traitée</span>
                    </div>
                )}
            </div>

            {/* KPI Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {kpiCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.id}
                            className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-primary/40"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
                                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                    <Icon className="size-4" aria-hidden />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline justify-between gap-2">
                                <p className="font-heading text-2xl font-bold tracking-tight">{card.value}</p>
                                <span className={cn('rounded-md border px-1.5 py-0.5 text-[10px] font-semibold', card.badgeColor)}>
                                    {card.badge}
                                </span>
                            </div>
                            <p className="text-muted-foreground mt-1 text-xs truncate">{card.subtext}</p>
                        </div>
                    );
                })}
            </div>

            {/* Graphs Section: Donut + Detailed Distribution */}
            <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
                {/* Donut Chart Card */}
                <div className="rounded-xl border bg-card/50 p-4 shadow-sm lg:col-span-5 xl:col-span-4 flex flex-col items-center justify-center">
                    <div className="w-full text-left mb-2">
                        <h3 className="text-sm font-semibold">Répartition des statuts</h3>
                        <p className="text-muted-foreground text-xs">Survolez un segment pour voir le détail.</p>
                    </div>
                    <DonutChart
                        slices={slices}
                        total={stats.total}
                        activeSliceKey={hoveredSlice}
                        onHoverSlice={setHoveredSlice}
                    />

                    {/* Quick interactive status filters */}
                    {onSelectStatusFilter ? (
                        <div className="mt-4 flex flex-wrap justify-center gap-1.5 w-full pt-3 border-t">
                            <button
                                type="button"
                                onClick={() => onSelectStatusFilter(null)}
                                className={cn(
                                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                                    selectedStatusFilter === null
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
                                )}
                            >
                                Tous ({stats.total})
                            </button>
                            {slices.map((slice) => (
                                <button
                                    key={slice.key}
                                    type="button"
                                    onClick={() => onSelectStatusFilter(slice.key === selectedStatusFilter ? null : slice.key)}
                                    className={cn(
                                        'rounded-md px-2 py-1 text-xs font-medium transition-colors flex items-center gap-1.5',
                                        selectedStatusFilter === slice.key
                                            ? 'bg-foreground text-background shadow-sm'
                                            : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
                                    )}
                                >
                                    <span className="size-2 rounded-full" style={{ backgroundColor: slice.color }} />
                                    <span>{slice.label}</span>
                                    <span className="opacity-70 text-[10px]">({slice.value})</span>
                                </button>
                            ))}
                        </div>
                    ) : null}
                </div>

                {/* Funnel / Conversion Pipeline */}
                <div className="rounded-xl border bg-card/50 p-4 shadow-sm lg:col-span-7 xl:col-span-8 space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold">Entonnoir d&apos;acheminement</h3>
                        <p className="text-muted-foreground text-xs">
                            Progression de la campagne à travers les différentes étapes de délivrance.
                        </p>
                    </div>

                    {/* Step-by-step Funnel Cards */}
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {funnelSteps.map((step) => {
                            const StepIcon = step.icon;
                            return (
                                <div
                                    key={step.step}
                                    className="relative rounded-lg border bg-background p-3 shadow-xs flex flex-col justify-between"
                                >
                                    <div className="flex items-center justify-between gap-1 text-xs text-muted-foreground">
                                        <span className="font-semibold text-foreground/80">Étape {step.step}</span>
                                        <StepIcon className="size-3.5" />
                                    </div>
                                    <div className="my-2">
                                        <p className="font-heading text-xl font-bold">{step.value}</p>
                                        <p className="text-xs text-muted-foreground font-medium">{step.label}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                                            <span>Conversion</span>
                                            <span className="font-semibold text-foreground">{step.pct}%</span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                            <div
                                                className={cn('h-full rounded-full transition-all duration-500', step.color)}
                                                style={{ width: `${step.pct}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Linear Stacked Progress Bar */}
                    <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-muted-foreground">Répartition globale proportionnelle</span>
                            <span className="text-muted-foreground text-[11px]">{stats.total} destinataires</span>
                        </div>
                        <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted/40 p-0.5">
                            {slices
                                .filter((s) => s.value > 0)
                                .map((slice) => {
                                    const widthPct = percent(slice.value, stats.total);
                                    return (
                                        <div
                                            key={slice.key}
                                            title={`${slice.label} : ${slice.value} (${widthPct}%)`}
                                            className="h-full first:rounded-l-full last:rounded-r-full transition-all hover:opacity-85 cursor-help"
                                            style={{
                                                width: `${widthPct}%`,
                                                backgroundColor: slice.color,
                                            }}
                                        />
                                    );
                                })}
                        </div>

                        {/* Status Legend Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2 pt-2">
                            {slices.map((slice) => (
                                <div
                                    key={slice.key}
                                    className="flex items-start gap-2 text-xs rounded-lg border p-2 bg-background/60"
                                >
                                    <span
                                        className="size-2.5 rounded-full mt-0.5 shrink-0"
                                        style={{ backgroundColor: slice.color }}
                                        aria-hidden
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium truncate text-foreground">{slice.label}</p>
                                        <p className="text-muted-foreground text-[11px]">
                                            {slice.value} ({percent(slice.value, stats.total)}%)
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
