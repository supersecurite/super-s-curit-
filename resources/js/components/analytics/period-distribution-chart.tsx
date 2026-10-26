import { useTrans as useUiTranslations } from '@/hooks/use-trans';
export type DistributionRow = {
    label: string;
    views: number;
    visitors: number;
    percentage: number;
    is_peak: boolean;
};

type Props = {
    data: DistributionRow[];
    emptyMessage?: string;
};

export default function PeriodDistributionChart({
    data,
    emptyMessage = 'Aucune donnée pour cette période.',
}: Props) {
    const { t: uiText } = useUiTranslations();

    const total = data.reduce((sum, row) => sum + row.views, 0);

    if (total === 0) {
        return (
            <p className="py-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
            </p>
        );
    }

    const maxViews = Math.max(...data.map((d) => d.views), 1);

    return (
        <div className="space-y-2.5">
            {data.map((row) => (
                <div key={row.label} className="group text-sm">
                    <div className="mb-1 flex items-center justify-between gap-2">
                        <span
                            className={`font-medium ${row.is_peak ? 'text-primary' : 'text-foreground'}`}
                        >
                            {row.label}
                            {row.is_peak && (
                                <span className="ml-1.5 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary uppercase">
                                    {uiText(
                                        'ui.components.text_2255c8b55faa',
                                        'pic',
                                    )}
                                </span>
                            )}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                            {row.views.toLocaleString('fr-FR')}{' '}
                            {uiText(
                                'ui.components.text_61315563b9fe',
                                'vues ·',
                            )}{' '}
                            {row.visitors.toLocaleString('fr-FR')}{' '}
                            {uiText(
                                'ui.components.text_6d7e48186a6b',
                                'visiteurs',
                            )}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                    row.is_peak ? 'bg-primary' : 'bg-primary/50'
                                }`}
                                style={{
                                    width: `${Math.max((row.views / maxViews) * 100, row.views > 0 ? 4 : 0)}%`,
                                }}
                            />
                        </div>
                        <span className="w-10 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
                            {row.percentage}%
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
