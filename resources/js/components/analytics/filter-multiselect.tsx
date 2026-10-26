import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { Check, ChevronDown, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

type Option = {
    value: string;
    label: string;
};

type Props = {
    label: string;
    icon?: React.ElementType;
    options: Option[];
    selected: string[];
    onChange: (values: string[]) => void;
    searchPlaceholder?: string;
    emptyLabel?: string;
    align?: 'start' | 'end';
};

export default function FilterMultiselect({
    label,
    icon: Icon,
    options,
    selected,
    onChange,
    searchPlaceholder = 'Rechercher...',
    emptyLabel = 'Aucune option',
    align = 'start',
}: Props) {
    const { t: uiText } = useUiTranslations();

    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);

    const filtered = useMemo(() => {
        if (search.trim() === '') {
            return options;
        }
        const needle = search.toLowerCase();
        return options.filter((opt) =>
            opt.label.toLowerCase().includes(needle),
        );
    }, [options, search]);

    const toggle = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const reset = () => {
        onChange([]);
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-dashed"
                >
                    {Icon && <Icon className="size-3.5" aria-hidden />}
                    <span>{label}</span>
                    {selected.length > 0 ? (
                        <Badge
                            variant="secondary"
                            className="ml-1 rounded-sm px-1.5 font-normal"
                        >
                            {selected.length}
                        </Badge>
                    ) : null}
                    <ChevronDown className="size-3.5 opacity-50" aria-hidden />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-72 p-0"
                align={align}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <div className="flex items-center justify-between gap-2 px-2 pt-2">
                    <DropdownMenuLabel className="px-1 py-0 text-xs font-semibold tracking-wide uppercase">
                        {label}
                    </DropdownMenuLabel>
                    {selected.length > 0 && (
                        <button
                            type="button"
                            onClick={reset}
                            className="text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                        >
                            {uiText(
                                'ui.components.text_54408b8064a2',
                                'Tout effacer',
                            )}
                        </button>
                    )}
                </div>
                <div className="px-2 py-2">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="h-8 text-sm"
                    />
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-72 overflow-y-auto py-1">
                    {filtered.length === 0 ? (
                        <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                            {emptyLabel}
                        </p>
                    ) : (
                        filtered.map((option) => {
                            const checked = selected.includes(option.value);
                            return (
                                <button
                                    type="button"
                                    key={option.value}
                                    onClick={() => toggle(option.value)}
                                    className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-sm hover:bg-accent"
                                >
                                    <span
                                        className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                                            checked
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-input'
                                        }`}
                                    >
                                        {checked && (
                                            <Check className="size-3" />
                                        )}
                                    </span>
                                    <span className="truncate">
                                        {option.label}
                                    </span>
                                </button>
                            );
                        })
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

type ChipProps = {
    label: string;
    onRemove: () => void;
};

export function FilterChip({ label, onRemove }: ChipProps) {
    const { t: uiText } = useUiTranslations();

    return (
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs">
            <span className="max-w-[160px] truncate">{label}</span>
            <button
                type="button"
                onClick={onRemove}
                className="text-muted-foreground hover:text-foreground"
                aria-label={uiText(
                    'ui.components.text_18cab2889216',
                    'Retirer le filtre',
                )}
            >
                <X className="size-3" />
            </button>
        </span>
    );
}
