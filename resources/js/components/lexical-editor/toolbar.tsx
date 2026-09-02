import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    UNDO_COMMAND,
} from 'lexical';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Heading1,
    Heading2,
    Image,
    Italic,
    Link,
    List,
    ListOrdered,
    Quote,
    Redo,
    Strikethrough,
    Type,
    Underline,
    Undo,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { INSERT_IMAGE_COMMAND } from '@/components/lexical-editor/plugins/image-plugin';

const HEADING_OPTIONS = [
    { label: 'Titre 1', value: 'h1', icon: <Heading1 className="size-4" /> },
    { label: 'Titre 2', value: 'h2', icon: <Heading2 className="size-4" /> },
    { label: 'Normal', value: 'p', icon: <Type className="size-4" /> },
];

function ToolbarButton({
    onClick,
    icon,
    title,
}: {
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="rounded p-2 transition-colors hover:bg-muted"
            title={title}
        >
            {icon}
        </button>
    );
}

export default function Toolbar({
    onPickImageFile,
}: {
    onPickImageFile?: () => void;
} = {}) {
    const [editor] = useLexicalComposerContext();
    const [showHeadingOptions, setShowHeadingOptions] = useState(false);

    const formatHeading = useCallback(
        (headingSize: string) => {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    if (headingSize === 'p') {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
                    } else {
                        const headingNode = $createHeadingNode(
                            headingSize as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
                        );
                        selection.insertNodes([headingNode]);
                    }
                }
            });
        },
        [editor],
    );

    const insertImage = useCallback(() => {
        if (onPickImageFile) {
            onPickImageFile();
            return;
        }

        const url = window.prompt("Entrez l'URL de l'image :");
        if (url) {
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                src: url,
                alt: 'Image insérée',
            });
        }
    }, [editor, onPickImageFile]);

    const insertLink = useCallback(() => {
        const url = window.prompt("Entrez l'URL du lien :");
        if (!url) {
            return;
        }
        const text = window.prompt('Entrez le texte du lien :', url);
        if (text) {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    selection.insertText(`[${text}](${url})`);
                }
            });
        }
    }, [editor]);

    return (
        <div className="sticky top-0 z-10 flex flex-wrap gap-2 border-b bg-card p-2">
            <div className="flex items-center gap-1 border-r pr-2">
                <ToolbarButton
                    onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                    icon={<Undo className="size-4" />}
                    title="Annuler"
                />
                <ToolbarButton
                    onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                    icon={<Redo className="size-4" />}
                    title="Rétablir"
                />
            </div>

            <div className="relative flex items-center gap-1 border-r pr-2">
                <ToolbarButton
                    onClick={() => setShowHeadingOptions(!showHeadingOptions)}
                    icon={<Type className="size-4" />}
                    title="Style de texte"
                />
                {showHeadingOptions ? (
                    <div className="absolute top-full left-0 z-20 mt-1 w-40 rounded-md border bg-card shadow-lg">
                        {HEADING_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                                onClick={() => {
                                    formatHeading(option.value);
                                    setShowHeadingOptions(false);
                                }}
                            >
                                {option.icon}
                                {option.label}
                            </button>
                        ))}
                    </div>
                ) : null}
            </div>

            <div className="flex items-center gap-1 border-r pr-2">
                <ToolbarButton
                    onClick={() =>
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
                    }
                    icon={<Bold className="size-4" />}
                    title="Gras"
                />
                <ToolbarButton
                    onClick={() =>
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
                    }
                    icon={<Italic className="size-4" />}
                    title="Italique"
                />
                <ToolbarButton
                    onClick={() =>
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
                    }
                    icon={<Underline className="size-4" />}
                    title="Souligné"
                />
                <ToolbarButton
                    onClick={() =>
                        editor.dispatchCommand(
                            FORMAT_TEXT_COMMAND,
                            'strikethrough',
                        )
                    }
                    icon={<Strikethrough className="size-4" />}
                    title="Barré"
                />
            </div>

            <div className="flex items-center gap-1 border-r pr-2">
                <ToolbarButton
                    onClick={() =>
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
                    }
                    icon={<AlignLeft className="size-4" />}
                    title="Aligner à gauche"
                />
                <ToolbarButton
                    onClick={() =>
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
                    }
                    icon={<AlignCenter className="size-4" />}
                    title="Centrer"
                />
                <ToolbarButton
                    onClick={() =>
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
                    }
                    icon={<AlignRight className="size-4" />}
                    title="Aligner à droite"
                />
            </div>

            <div className="flex items-center gap-1 border-r pr-2">
                <ToolbarButton
                    onClick={() =>
                        editor.dispatchCommand(
                            INSERT_UNORDERED_LIST_COMMAND,
                            undefined,
                        )
                    }
                    icon={<List className="size-4" />}
                    title="Liste à puces"
                />
                <ToolbarButton
                    onClick={() =>
                        editor.dispatchCommand(
                            INSERT_ORDERED_LIST_COMMAND,
                            undefined,
                        )
                    }
                    icon={<ListOrdered className="size-4" />}
                    title="Liste numérotée"
                />
            </div>

            <div className="flex items-center gap-1">
                <ToolbarButton
                    onClick={insertImage}
                    icon={<Image className="size-4" />}
                    title="Insérer une image"
                />
                <ToolbarButton
                    onClick={insertLink}
                    icon={<Link className="size-4" />}
                    title="Insérer un lien"
                />
                <ToolbarButton
                    onClick={() =>
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
                    }
                    icon={<Code className="size-4" />}
                    title="Code"
                />
                <ToolbarButton
                    onClick={() => {
                        editor.update(() => {
                            const selection = $getSelection();
                            if ($isRangeSelection(selection)) {
                                $setBlocksType(selection, () =>
                                    $createQuoteNode(),
                                );
                            }
                        });
                    }}
                    icon={<Quote className="size-4" />}
                    title="Citation"
                />
            </div>
        </div>
    );
}
