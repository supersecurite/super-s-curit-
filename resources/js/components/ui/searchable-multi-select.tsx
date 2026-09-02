import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type SearchableMultiSelectOption = {
    value: string;
    label: string;
};

type SearchableMultiSelectProps = {
    id?: string;
    name?: string;
    options: SearchableMultiSelectOption[];
    value?: string[];
    defaultValue?: string[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    className?: string;
    onChange?: (values: string[]) => void;
};

/**
 * Sélection multiple avec recherche — champs hidden `name[]` pour formulaires HTML / Inertia.
 */
export function SearchableMultiSelect({
    id,
    name,
    options,
    value,
    defaultValue = [],
    placeholder = 'Sélectionner…',
    searchPlaceholder = 'Rechercher…',
    emptyMessage = 'Aucun résultat',
    disabled = false,
    className,
    onChange,
}: SearchableMultiSelectProps) {
    const listId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [internalValue, setInternalValue] = useState<string[]>(value ?? defaultValue);

    const selectedValues = value !== undefined ? value : internalValue;

    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value);
        }
    }, [value]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const onPointerDown = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
                setSearch('');
            }
        };

        document.addEventListener('mousedown', onPointerDown);

        return () => document.removeEventListener('mousedown', onPointerDown);
    }, [open]);

    useEffect(() => {
        if (open) {
            searchRef.current?.focus();
        }
    }, [open]);

    const selectedOptions = useMemo(
        () => options.filter((option) => selectedValues.includes(option.value)),
        [options, selectedValues],
    );

    const filteredOptions = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (term === '') {
            return options;
        }

        return options.filter((option) =>
            option.label.toLowerCase().includes(term),
        );
    }, [options, search]);

    const setSelected = (next: string[]) => {
        if (value === undefined) {
            setInternalValue(next);
        }

        onChange?.(next);
    };

    const toggle = (optionValue: string) => {
        if (selectedValues.includes(optionValue)) {
            setSelected(selectedValues.filter((item) => item !== optionValue));

            return;
        }

        setSelected([...selectedValues, optionValue]);
    };

    const remove = (optionValue: string) => {
        setSelected(selectedValues.filter((item) => item !== optionValue));
    };

    return (
        <div ref={containerRef} className={cn('relative space-y-2', className)}>
            {name
                ? selectedValues.map((selected) => (
                      <input
                          key={selected}
                          type="hidden"
                          name={`${name}[]`}
                          value={selected}
                      />
                  ))
                : null}

            <Button
                id={id}
                type="button"
                variant="outline"
                disabled={disabled}
                aria-expanded={open}
                aria-controls={listId}
                className="h-auto min-h-9 w-full justify-between px-3 py-2 font-normal"
                onClick={() => setOpen((previous) => !previous)}
            >
                <span className="text-muted-foreground truncate text-left">
                    {selectedOptions.length > 0
                        ? `${selectedOptions.length} sélectionné${selectedOptions.length > 1 ? 's' : ''}`
                        : placeholder}
                </span>
                <ChevronsUpDown className="size-4 shrink-0 opacity-50" aria-hidden />
            </Button>

            {selectedOptions.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                    {selectedOptions.map((option) => (
                        <Badge
                            key={option.value}
                            variant="secondary"
                            className="gap-1 font-normal"
                        >
                            <span className="max-w-[14rem] truncate">{option.label}</span>
                            <button
                                type="button"
                                className="hover:text-foreground rounded-sm opacity-70 hover:opacity-100"
                                onClick={() => remove(option.value)}
                                aria-label={`Retirer ${option.label}`}
                                disabled={disabled}
                            >
                                <X className="size-3" aria-hidden />
                            </button>
                        </Badge>
                    ))}
                </div>
            ) : null}

            {open ? (
                <div
                    id={listId}
                    className="bg-popover text-popover-foreground absolute z-50 mt-1 w-full rounded-md border shadow-md"
                >
                    <div className="border-b p-2">
                        <Input
                            ref={searchRef}
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={searchPlaceholder}
                            className="h-8"
                        />
                    </div>
                    <ul className="max-h-56 overflow-y-auto p-1">
                        {filteredOptions.length === 0 ? (
                            <li className="text-muted-foreground px-2 py-3 text-center text-sm">
                                {emptyMessage}
                            </li>
                        ) : (
                            filteredOptions.map((option) => {
                                const selected = selectedValues.includes(option.value);

                                return (
                                    <li key={option.value}>
                                        <button
                                            type="button"
                                            className={cn(
                                                'hover:bg-muted flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm',
                                                selected && 'bg-muted/60',
                                            )}
                                            onClick={() => toggle(option.value)}
                                        >
                                            <span
                                                className={cn(
                                                    'border-input flex size-4 shrink-0 items-center justify-center rounded-sm border',
                                                    selected &&
                                                        'bg-primary border-primary text-primary-foreground',
                                                )}
                                            >
                                                {selected ? (
                                                    <Check className="size-3" aria-hidden />
                                                ) : null}
                                            </span>
                                            <span className="min-w-0 flex-1 truncate">
                                                {option.label}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            ) : null}
        </div>
    );
}
