import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { CalendarRange, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type DateFilterMode = 'period' | 'single' | 'range';

type DateFilter = {
    mode: DateFilterMode;
    date: string | null;
    date_from: string | null;
    date_to: string | null;
};

type Props = {
    dateFilter: DateFilter;
    onApplySingle: (date: string) => void;
    onApplyRange: (dateFrom: string, dateTo: string) => void;
    onClear: () => void;
};

export default function DateRangeFilter({
    dateFilter,
    onApplySingle,
    onApplyRange,
    onClear,
}: Props) {
    const { t: uiText } = useUiTranslations();

    const [singleDate, setSingleDate] = useState(dateFilter.date ?? '');
    const [rangeFrom, setRangeFrom] = useState(dateFilter.date_from ?? '');
    const [rangeTo, setRangeTo] = useState(dateFilter.date_to ?? '');

    const isCustom =
        dateFilter.mode === 'single' || dateFilter.mode === 'range';

    const applySingle = () => {
        if (singleDate) {
            onApplySingle(singleDate);
        }
    };

    const applyRange = () => {
        if (rangeFrom && rangeTo) {
            onApplyRange(rangeFrom, rangeTo);
        }
    };

    return (
        <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
                <Label htmlFor="analytics-date-single" className="text-xs">
                    {uiText('ui.components.text_710952ede24e', 'Date précise')}
                </Label>
                <div className="flex items-center gap-1.5">
                    <Input
                        id="analytics-date-single"
                        type="date"
                        value={singleDate}
                        onChange={(e) => setSingleDate(e.target.value)}
                        className="h-8 w-[10.5rem] text-xs"
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-8"
                        disabled={!singleDate}
                        onClick={applySingle}
                    >
                        OK
                    </Button>
                </div>
            </div>

            <span className="hidden pb-2 text-xs text-muted-foreground sm:inline">
                {uiText('ui.components.text_fc74181ece96', 'ou')}
            </span>

            <div className="flex flex-col gap-1">
                <Label className="text-xs">
                    {uiText('ui.components.text_45b31f5996f8', 'Intervalle')}
                </Label>
                <div className="flex flex-wrap items-center gap-1.5">
                    <Input
                        id="analytics-date-from"
                        type="date"
                        aria-label={uiText(
                            'ui.components.text_980472432f98',
                            'Date de début',
                        )}
                        value={rangeFrom}
                        onChange={(e) => setRangeFrom(e.target.value)}
                        className="h-8 w-[10.5rem] text-xs"
                    />
                    <span className="text-xs text-muted-foreground">→</span>
                    <Input
                        id="analytics-date-to"
                        type="date"
                        aria-label={uiText(
                            'ui.components.text_b134aabee003',
                            'Date de fin',
                        )}
                        value={rangeTo}
                        onChange={(e) => setRangeTo(e.target.value)}
                        className="h-8 w-[10.5rem] text-xs"
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-8"
                        disabled={!rangeFrom || !rangeTo}
                        onClick={applyRange}
                    >
                        OK
                    </Button>
                </div>
            </div>

            {isCustom && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5"
                    onClick={onClear}
                >
                    <CalendarRange className="size-3.5" aria-hidden />
                    {uiText(
                        'ui.components.text_97f3c4722ee5',
                        'Période rapide',
                    )}{' '}
                    <X className="size-3" aria-hidden />
                </Button>
            )}
        </div>
    );
}
