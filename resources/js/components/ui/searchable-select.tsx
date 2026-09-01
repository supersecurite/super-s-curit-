import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type SearchableSelectOption = {
    value: string;
    label: string;
};

type SearchableSelectProps = {
    id?: string;
    name?: string;
    options: SearchableSelectOption[];
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    triggerClassName?: string;
    /** Style trigger (défaut boîte ; underline = formulaires marketing legacy). */
    variant?: 'default' | 'underline';
    onChange?: (value: string) => void;
};

/**
 * Select avec recherche (port Excorde / GMAO).
 * Champ hidden optionnel (`name`) pour les formulaires HTML / Inertia.
 */
export function SearchableSelect({
    id,
    name,
    options,
    value,
    defaultValue = '',
    placeholder = 'Sélectionner…',
    searchPlaceholder = 'Rechercher…',
    emptyMessage = 'Aucun résultat',
    disabled = false,
    required = false,
    className,
    triggerClassName,
    variant = 'default',
    onChange,
}: SearchableSelectProps) {
    const listId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [internalValue, setInternalValue] = useState(value ?? defaultValue);

    const selectedValue = value !== undefined ? value : internalValue;

    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value);
        }
    }, [value]);

    useEffect(() => {
        if (value === undefined) {
            setInternalValue(defaultValue);
        }
    }, [defaultValue, value]);

    const selectedOption = options.find(
        (option) => option.value === selectedValue,
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

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
                setSearch('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        searchRef.current?.focus();

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    const select = (next: string) => {
        if (value === undefined) {
            setInternalValue(next);
        }

        setOpen(false);
        setSearch('');
        onChange?.(next);
    };

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            {name ? (
                <input
                    type="hidden"
                    name={name}
                    value={selectedValue}
                    required={required}
                />
            ) : null}
            <Button
                id={id}
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                aria-controls={listId}
                disabled={disabled || options.length === 0}
                onClick={() => setOpen((prev) => !prev)}
                className={cn(
                    'h-10 w-full justify-between font-normal',
                    variant === 'underline' &&
                        'h-10 rounded-none border-0 border-b border-super-securite-border bg-transparent px-0 shadow-none hover:bg-transparent focus-visible:border-super-securite-accent focus-visible:ring-0',
                    !selectedOption && 'text-muted-foreground',
                    triggerClassName,
                )}
            >
                <span className="truncate">
                    {selectedOption?.label ?? placeholder}
                </span>
                <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
            </Button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
                    <div className="p-1">
                        <Input
                            ref={searchRef}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="h-8"
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    setOpen(false);
                                    setSearch('');
                                }
                            }}
                        />
                    </div>
                    <ul
                        id={listId}
                        className="max-h-48 overflow-y-auto p-1"
                        role="listbox"
                    >
                        {filteredOptions.length === 0 ? (
                            <li className="px-2 py-1.5 text-sm text-muted-foreground">
                                {emptyMessage}
                            </li>
                        ) : (
                            filteredOptions.map((option) => (
                                <li key={option.value}>
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={
                                            selectedValue === option.value
                                        }
                                        className={cn(
                                            'flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted',
                                            selectedValue === option.value &&
                                                'bg-muted',
                                        )}
                                        onClick={() => select(option.value)}
                                    >
                                        <Check
                                            className={cn(
                                                'size-4 shrink-0',
                                                selectedValue === option.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />
                                        <span className="truncate">
                                            {option.label}
                                        </span>
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
