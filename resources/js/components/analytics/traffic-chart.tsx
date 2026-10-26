import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { useMemo, useState } from 'react';

export type ChartPoint = {
    date: string;
    views: number;
    visitors: number;
};

type Props = {
    data: ChartPoint[];
    height?: number;
};

const PADDING = { top: 16, right: 12, bottom: 28, left: 36 };

export default function TrafficChart({ data, height = 240 }: Props) {
    const { t: uiText } = useUiTranslations();

    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [containerWidth, setContainerWidth] = useState<number>(720);

    const stats = useMemo(() => {
        const maxViews = Math.max(...data.map((d) => d.views), 1);
        const maxVisitors = Math.max(...data.map((d) => d.visitors), 1);
        const yMax = Math.max(maxViews, maxVisitors);
        const niceMax = niceCeiling(yMax);
        const ticks = buildTicks(niceMax, 4);
        return { maxViews, maxVisitors, niceMax, ticks };
    }, [data]);

    const width = containerWidth;
    const chartW = Math.max(width - PADDING.left - PADDING.right, 1);
    const chartH = Math.max(height - PADDING.top - PADDING.bottom, 1);

    const xFor = (index: number): number => {
        if (data.length <= 1) {
            return PADDING.left + chartW / 2;
        }
        return PADDING.left + (index / (data.length - 1)) * chartW;
    };

    const yFor = (value: number): number => {
        const ratio = stats.niceMax === 0 ? 0 : value / stats.niceMax;
        return PADDING.top + (1 - ratio) * chartH;
    };

    const viewsPath = useMemo(
        () => buildPath(data.map((d, i) => [xFor(i), yFor(d.views)])),
        [data, chartH, chartW],
    );

    const visitorsPath = useMemo(
        () => buildPath(data.map((d, i) => [xFor(i), yFor(d.visitors)])),
        [data, chartH, chartW],
    );

    const areaPath = useMemo(() => {
        if (data.length === 0) {
            return '';
        }
        const top = data
            .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(d.views)}`)
            .join(' ');
        return `${top} L ${xFor(data.length - 1)} ${PADDING.top + chartH} L ${xFor(0)} ${PADDING.top + chartH} Z`;
    }, [data, chartH, chartW]);

    const xLabelIndexes = useMemo(() => {
        if (data.length <= 6) {
            return data.map((_, i) => i);
        }
        const step = Math.ceil(data.length / 6);
        const indexes: number[] = [];
        for (let i = 0; i < data.length; i += step) {
            indexes.push(i);
        }
        if (indexes[indexes.length - 1] !== data.length - 1) {
            indexes.push(data.length - 1);
        }
        return indexes;
    }, [data.length]);

    const total = useMemo(
        () => data.reduce((acc, d) => acc + d.views, 0),
        [data],
    );

    if (data.length === 0) {
        return (
            <p className="py-10 text-center text-sm text-muted-foreground">
                {uiText(
                    'ui.components.text_d7315c751a39',
                    'Aucune donnée pour cette période.',
                )}
            </p>
        );
    }

    return (
        <div
            ref={(node) => {
                if (node) {
                    const w = node.getBoundingClientRect().width;
                    if (w > 0 && Math.abs(w - containerWidth) > 1) {
                        setContainerWidth(w);
                    }
                }
            }}
            className="relative w-full"
        >
            <svg
                viewBox={`0 0 ${width} ${height}`}
                width="100%"
                height={height}
                role="img"
                aria-label={`Évolution du trafic — ${total} pages vues`}
                onMouseLeave={() => setHoverIndex(null)}
            >
                <defs>
                    <linearGradient
                        id="traffic-area"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stopColor="currentColor"
                            stopOpacity="0.25"
                        />
                        <stop
                            offset="100%"
                            stopColor="currentColor"
                            stopOpacity="0"
                        />
                    </linearGradient>
                </defs>

                {stats.ticks.map((tick) => {
                    const y = yFor(tick);
                    return (
                        <g key={`tick-${tick}`}>
                            <line
                                x1={PADDING.left}
                                x2={width - PADDING.right}
                                y1={y}
                                y2={y}
                                className="stroke-border"
                                strokeDasharray="2 4"
                                strokeWidth="1"
                            />
                            <text
                                x={PADDING.left - 6}
                                y={y}
                                dy="0.32em"
                                textAnchor="end"
                                className="fill-muted-foreground text-[10px] tabular-nums"
                            >
                                {formatTickValue(tick)}
                            </text>
                        </g>
                    );
                })}

                <g className="text-primary">
                    <path d={areaPath} fill="url(#traffic-area)" />
                    <path
                        d={viewsPath}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />
                </g>

                <path
                    d={visitorsPath}
                    fill="none"
                    className="stroke-emerald-500"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />

                {xLabelIndexes.map((i) => (
                    <text
                        key={`x-${i}`}
                        x={xFor(i)}
                        y={height - PADDING.bottom + 16}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[10px]"
                    >
                        {formatShortDate(data[i].date)}
                    </text>
                ))}

                {data.map((_, i) => (
                    <rect
                        key={`hit-${i}`}
                        x={xFor(i) - chartW / Math.max(data.length, 1) / 2}
                        y={PADDING.top}
                        width={chartW / Math.max(data.length, 1)}
                        height={chartH}
                        fill="transparent"
                        onMouseEnter={() => setHoverIndex(i)}
                        onFocus={() => setHoverIndex(i)}
                        tabIndex={-1}
                    />
                ))}

                {hoverIndex !== null && (
                    <g>
                        <line
                            x1={xFor(hoverIndex)}
                            x2={xFor(hoverIndex)}
                            y1={PADDING.top}
                            y2={PADDING.top + chartH}
                            className="stroke-border"
                            strokeWidth="1"
                        />
                        <circle
                            cx={xFor(hoverIndex)}
                            cy={yFor(data[hoverIndex].views)}
                            r="4"
                            className="fill-primary stroke-background"
                            strokeWidth="2"
                        />
                        <circle
                            cx={xFor(hoverIndex)}
                            cy={yFor(data[hoverIndex].visitors)}
                            r="3"
                            className="fill-emerald-500 stroke-background"
                            strokeWidth="2"
                        />
                    </g>
                )}
            </svg>

            {hoverIndex !== null && (
                <div
                    className="pointer-events-none absolute top-2 rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md"
                    style={{
                        left: clampTooltipLeft(xFor(hoverIndex), width),
                    }}
                >
                    <div className="font-medium">
                        {formatFullDate(data[hoverIndex].date)}
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                        <span className="inline-block size-2 rounded-full bg-primary" />
                        <span>
                            {data[hoverIndex].views}{' '}
                            {uiText(
                                'ui.components.text_723cb60154ce',
                                'pages vues',
                            )}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600">
                        <span className="inline-block size-2 rounded-full bg-emerald-500" />
                        <span>
                            {data[hoverIndex].visitors}{' '}
                            {uiText(
                                'ui.components.text_6d7e48186a6b',
                                'visiteurs',
                            )}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

function buildPath(points: [number, number][]): string {
    if (points.length === 0) {
        return '';
    }
    return points
        .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`)
        .join(' ');
}

function niceCeiling(value: number): number {
    if (value <= 1) {
        return 1;
    }
    const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
    const normalized = value / magnitude;

    let nice = 1;
    if (normalized > 5) {
        nice = 10;
    } else if (normalized > 2) {
        nice = 5;
    } else if (normalized > 1) {
        nice = 2;
    }

    return nice * magnitude;
}

function buildTicks(max: number, count: number): number[] {
    const step = max / count;
    const ticks: number[] = [];
    for (let i = 0; i <= count; i++) {
        ticks.push(Math.round(step * i));
    }
    return ticks;
}

function formatTickValue(value: number): string {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
    }
    return value.toString();
}

function formatShortDate(iso: string): string {
    const date = new Date(`${iso}T00:00:00`);
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
    }).format(date);
}

function formatFullDate(iso: string): string {
    const date = new Date(`${iso}T00:00:00`);
    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
}

function clampTooltipLeft(x: number, width: number): number {
    const tooltipWidth = 200;
    const max = width - tooltipWidth - 8;
    return Math.max(8, Math.min(x - tooltipWidth / 2, max));
}
