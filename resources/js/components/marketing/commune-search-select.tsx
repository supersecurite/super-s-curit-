import { Check, ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    getCommunesForAgentSelect,
    type CommuneSelectOption,
} from '@/data/guinea-localisation';
import { cn } from '@/lib/utils';

type Props = {
    value: string;
    onChange: (communeId: string) => void;
    error?: string;
    fieldClasses?: string;
};

const options = getCommunesForAgentSelect();

export default function CommuneSearchSelect({
    value,
    onChange,
    error,
    fieldClasses,
}: Props) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const selected = useMemo(
        () => options.find((opt) => opt.value === value),
        [value],
    );

    const filtered = useMemo(() => {
        if (search.trim() === '') {
            return options;
        }

        const needle = search.toLowerCase().trim();

        return options.filter((opt) => opt.searchText.includes(needle));
    }, [search]);

    const handleSelect = (option: CommuneSelectOption) => {
        onChange(option.value);
        setOpen(false);
        setSearch('');
    };

    return (
        <div className="grid gap-2">
            <Label htmlFor="commune_id">
                Commune{' '}
                <span className="text-super-securite-accent">*</span>
            </Label>
            <input type="hidden" name="commune_id" value={value} />
            <DropdownMenu
                open={open}
                onOpenChange={(next) => {
                    setOpen(next);
                    if (!next) {
                        setSearch('');
                    }
                }}
            >
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        id="commune_id"
                        variant="outline"
                        aria-invalid={error ? true : undefined}
                        className={cn(
                            'h-10 w-full justify-between px-3 font-normal',
                            fieldClasses,
                            !selected && 'text-super-securite-muted',
                        )}
                    >
                        <span className="truncate">
                            {selected?.label ?? 'Rechercher une commune...'}
                        </span>
                        <ChevronDown
                            className="size-4 shrink-0 opacity-50"
                            aria-hidden
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-[var(--radix-dropdown-menu-trigger-width)] p-0"
                    align="start"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                >
                    <div className="p-2">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher une commune..."
                            className="h-9 text-sm"
                            autoFocus
                        />
                    </div>
                    <DropdownMenuSeparator />
                    <div
                        className="max-h-72 overflow-y-auto py-1"
                        role="listbox"
                        aria-label="Communes"
                    >
                        {filtered.length === 0 ? (
                            <p className="text-muted-foreground px-3 py-4 text-center text-sm">
                                Aucune commune trouvée
                            </p>
                        ) : (
                            filtered.map((option) => {
                                const isSelected = option.value === value;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() => handleSelect(option)}
                                        className={cn(
                                            'hover:bg-accent flex w-full items-center gap-2 px-3 py-2 text-left text-sm',
                                            isSelected && 'bg-accent/50',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'flex size-4 shrink-0 items-center justify-center',
                                                isSelected
                                                    ? 'text-super-securite-accent'
                                                    : 'text-transparent',
                                            )}
                                        >
                                            <Check className="size-4" />
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
            <InputError message={error} />
        </div>
    );
}
