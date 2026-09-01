import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
} from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
    formatMarketingTemplateVariable,
    MARKETING_TEMPLATE_VARIABLE_LABELS,
    variableTokenClassName,
} from '@/lib/marketing-template-variables';

type TemplateSubjectInputProps = {
    id?: string;
    name?: string;
    value: string;
    onChange: (value: string) => void;
    variables: string[];
    placeholder?: string;
    required?: boolean;
};

export default function TemplateSubjectInput({
    id = 'subject',
    name = 'subject',
    value,
    onChange,
    variables,
    placeholder,
    required = false,
}: TemplateSubjectInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState<string | null>(null);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const suggestions = useMemo(() => {
        if (query === null) {
            return [];
        }

        return variables.filter((variable) => variable.startsWith(query));
    }, [query, variables]);

    const closeMenu = useCallback(() => {
        setQuery(null);
        setHighlightedIndex(0);
    }, []);

    const insertVariable = useCallback(
        (variable: string, replaceAutocomplete = false) => {
            const input = inputRef.current;

            if (!input) {
                onChange(`${value}${formatMarketingTemplateVariable(variable)}`);
                return;
            }

            const start = input.selectionStart ?? value.length;
            const end = input.selectionEnd ?? value.length;
            let insertStart = start;

            if (replaceAutocomplete) {
                const textBefore = value.slice(0, start);
                const match = textBefore.match(/\{\{([a-z_]*)$/);

                if (match) {
                    insertStart = start - match[0].length;
                }
            }

            const token = formatMarketingTemplateVariable(variable);
            const nextValue =
                value.slice(0, insertStart) + token + value.slice(end);

            onChange(nextValue);
            closeMenu();

            requestAnimationFrame(() => {
                const cursor = insertStart + token.length;
                input.setSelectionRange(cursor, cursor);
                input.focus();
            });
        },
        [closeMenu, onChange, value],
    );

    const syncAutocomplete = useCallback(
        (nextValue: string, cursor: number) => {
            const textBefore = nextValue.slice(0, cursor);
            const match = textBefore.match(/\{\{([a-z_]*)$/);
            setQuery(match ? match[1] : null);
            setHighlightedIndex(0);
        },
        [],
    );

    const handleChange = (nextValue: string) => {
        onChange(nextValue);
        syncAutocomplete(nextValue, inputRef.current?.selectionStart ?? nextValue.length);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (query === null || suggestions.length === 0) {
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setHighlightedIndex((index) => (index + 1) % suggestions.length);
            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHighlightedIndex(
                (index) => (index - 1 + suggestions.length) % suggestions.length,
            );
            return;
        }

        if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault();
            insertVariable(suggestions[highlightedIndex], true);
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            closeMenu();
        }
    };

    useEffect(() => {
        if (query !== null && suggestions.length === 0) {
            closeMenu();
        }
    }, [closeMenu, query, suggestions.length]);

    const previewParts = value.split(/(\{\{[a-z_]+\}\})/g).filter(Boolean);

    return (
        <div className="space-y-2">
            <div className="relative">
                <Input
                    ref={inputRef}
                    id={id}
                    name={name}
                    value={value}
                    onChange={(event) => handleChange(event.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                        window.setTimeout(closeMenu, 120);
                    }}
                    onClick={(event) =>
                        syncAutocomplete(
                            value,
                            event.currentTarget.selectionStart ?? value.length,
                        )
                    }
                    placeholder={placeholder}
                    required={required}
                />

                {query !== null && suggestions.length > 0 ? (
                    <ul className="bg-popover text-popover-foreground absolute z-20 mt-1 w-full overflow-hidden rounded-md border shadow-md">
                        {suggestions.map((variable, index) => (
                            <li key={variable}>
                                <button
                                    type="button"
                                    className={cn(
                                        'flex w-full items-center gap-2 px-3 py-2 text-left font-mono text-sm',
                                        index === highlightedIndex && 'bg-accent',
                                    )}
                                    onMouseDown={(event) => {
                                        event.preventDefault();
                                        insertVariable(variable, true);
                                    }}
                                >
                                    {formatMarketingTemplateVariable(variable)}
                                    <span className="text-muted-foreground font-sans text-xs">
                                        {MARKETING_TEMPLATE_VARIABLE_LABELS[variable]}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>

            {value ? (
                <p className="text-muted-foreground text-xs">
                    Aperçu :{' '}
                    {previewParts.map((part, index) => {
                        const match = part.match(/^\{\{([a-z_]+)\}\}$/);

                        if (match) {
                            return (
                                <span key={`${part}-${index}`} className={variableTokenClassName()}>
                                    {part}
                                </span>
                            );
                        }

                        return <span key={`${part}-${index}`}>{part}</span>;
                    })}
                </p>
            ) : null}

            <div className="flex flex-wrap gap-1.5">
                {variables.map((variable) => (
                    <button
                        key={variable}
                        type="button"
                        className={cn(variableTokenClassName(), 'cursor-pointer hover:bg-primary/25')}
                        onClick={() => insertVariable(variable)}
                        title={MARKETING_TEMPLATE_VARIABLE_LABELS[variable]}
                    >
                        {formatMarketingTemplateVariable(variable)}
                    </button>
                ))}
            </div>
        </div>
    );
}
