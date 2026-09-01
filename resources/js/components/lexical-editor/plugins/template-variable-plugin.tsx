import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $createParagraphNode,
    $createTextNode,
    $getRoot,
    $getSelection,
    $isRangeSelection,
    $isTextNode,
    COMMAND_PRIORITY_LOW,
    KEY_ARROW_DOWN_COMMAND,
    KEY_ARROW_UP_COMMAND,
    KEY_ENTER_COMMAND,
    KEY_ESCAPE_COMMAND,
    KEY_TAB_COMMAND,
    type LexicalEditor,
} from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import {
    $createTemplateVariableNode,
    formatVariableToken,
} from '@/components/lexical-editor/nodes/template-variable-node';

const VARIABLE_PATTERN = /\{\{([a-z_]+)\}\}/g;

export function $importPlainTemplateContent(text: string): void {
    const root = $getRoot();
    root.clear();

    const lines = text.split('\n');

    lines.forEach((line, lineIndex) => {
        const paragraph = $createParagraphNode();
        const parts = line.split(/(\{\{[a-z_]+\}\})/g).filter((part) => part !== '');

        if (parts.length === 0) {
            root.append(paragraph);
            return;
        }

        parts.forEach((part) => {
            const match = part.match(/^\{\{([a-z_]+)\}\}$/);

            if (match) {
                paragraph.append($createTemplateVariableNode(match[1]));
                return;
            }

            if (part) {
                paragraph.append($createTextNode(part));
            }
        });

        root.append(paragraph);

        if (lineIndex < lines.length - 1 && parts.length > 0) {
            // Line breaks are represented as separate paragraphs.
        }
    });

    if (root.getChildrenSize() === 0) {
        root.append($createParagraphNode());
    }
}

export function insertTemplateVariable(
    editor: LexicalEditor,
    variable: string,
    replaceAutocomplete = false,
): void {
    editor.update(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) {
            return;
        }

        if (replaceAutocomplete) {
            const anchorNode = selection.anchor.getNode();

            if ($isTextNode(anchorNode)) {
                const offset = selection.anchor.offset;
                const textBefore = anchorNode.getTextContent().slice(0, offset);
                const match = textBefore.match(/\{\{([a-z_]*)$/);

                if (match) {
                    const start = offset - match[0].length;
                    selection.setTextNodeRange(anchorNode, start, anchorNode, offset);
                    selection.removeText();
                }
            }
        }

        selection.insertNodes([$createTemplateVariableNode(variable)]);
    });
}

type TemplateVariableAutocompletePluginProps = {
    variables: string[];
};

export function TemplateVariableAutocompletePlugin({
    variables,
}: TemplateVariableAutocompletePluginProps) {
    const [editor] = useLexicalComposerContext();
    const [query, setQuery] = useState<string | null>(null);
    const [menuRect, setMenuRect] = useState<DOMRect | null>(null);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const suggestions =
        query === null
            ? []
            : variables.filter((variable) => variable.startsWith(query));

    const closeMenu = useCallback(() => {
        setQuery(null);
        setMenuRect(null);
        setHighlightedIndex(0);
    }, []);

    const pickVariable = useCallback(
        (variable: string) => {
            insertTemplateVariable(editor, variable, true);
            closeMenu();
        },
        [closeMenu, editor],
    );

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const selection = $getSelection();

                if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
                    closeMenu();
                    return;
                }

                const anchorNode = selection.anchor.getNode();

                if (!$isTextNode(anchorNode)) {
                    closeMenu();
                    return;
                }

                const textBefore = anchorNode
                    .getTextContent()
                    .slice(0, selection.anchor.offset);
                const match = textBefore.match(/\{\{([a-z_]*)$/);

                if (!match) {
                    closeMenu();
                    return;
                }

                const domSelection = window.getSelection();

                if (domSelection && domSelection.rangeCount > 0) {
                    const range = domSelection.getRangeAt(0);
                    setMenuRect(range.getBoundingClientRect());
                }

                setQuery(match[1]);
                setHighlightedIndex(0);
            });
        });
    }, [closeMenu, editor]);

    useEffect(() => {
        if (query === null || suggestions.length === 0) {
            return;
        }

        const pickHighlighted = () => {
            pickVariable(suggestions[highlightedIndex]);
            return true;
        };

        const removeDown = editor.registerCommand(
            KEY_ARROW_DOWN_COMMAND,
            (event) => {
                event.preventDefault();
                setHighlightedIndex((index) => (index + 1) % suggestions.length);
                return true;
            },
            COMMAND_PRIORITY_LOW,
        );

        const removeUp = editor.registerCommand(
            KEY_ARROW_UP_COMMAND,
            (event) => {
                event.preventDefault();
                setHighlightedIndex(
                    (index) => (index - 1 + suggestions.length) % suggestions.length,
                );
                return true;
            },
            COMMAND_PRIORITY_LOW,
        );

        const removeEnter = editor.registerCommand(
            KEY_ENTER_COMMAND,
            (event) => {
                if (event) {
                    event.preventDefault();
                }
                return pickHighlighted();
            },
            COMMAND_PRIORITY_LOW,
        );

        const removeTab = editor.registerCommand(
            KEY_TAB_COMMAND,
            (event) => {
                event.preventDefault();
                return pickHighlighted();
            },
            COMMAND_PRIORITY_LOW,
        );

        const removeEscape = editor.registerCommand(
            KEY_ESCAPE_COMMAND,
            (event) => {
                event.preventDefault();
                closeMenu();
                return true;
            },
            COMMAND_PRIORITY_LOW,
        );

        return () => {
            removeDown();
            removeUp();
            removeEnter();
            removeTab();
            removeEscape();
        };
    }, [
        closeMenu,
        editor,
        highlightedIndex,
        pickVariable,
        query,
        suggestions,
    ]);

    if (query === null || suggestions.length === 0 || !menuRect) {
        return null;
    }

    return createPortal(
        <div
            className="bg-popover text-popover-foreground fixed z-50 min-w-[180px] overflow-hidden rounded-md border shadow-md"
            style={{
                top: menuRect.bottom + window.scrollY + 4,
                left: menuRect.left + window.scrollX,
            }}
        >
            <ul className="py-1 text-sm">
                {suggestions.map((variable, index) => (
                    <li key={variable}>
                        <button
                            type="button"
                            className={cn(
                                'flex w-full items-center gap-2 px-3 py-2 text-left font-mono',
                                index === highlightedIndex && 'bg-accent',
                            )}
                            onMouseDown={(event) => {
                                event.preventDefault();
                                pickVariable(variable);
                            }}
                        >
                            {formatVariableToken(variable)}
                        </button>
                    </li>
                ))}
            </ul>
        </div>,
        document.body,
    );
}

export function highlightPlainTemplateVariables(text: string): string {
    return text.replace(
        VARIABLE_PATTERN,
        (token) => `<span class="template-variable-token">${token}</span>`,
    );
}
