import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import {
    $createParagraphNode,
    $createTextNode,
    $getRoot,
    type EditorState,
    type LexicalEditor,
} from 'lexical';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import ImagePlugin, { ImageNode } from '@/components/lexical-editor/plugins/image-plugin';
import Toolbar from '@/components/lexical-editor/toolbar';

const theme = {
    paragraph: 'mb-4',
    heading: {
        h1: 'text-3xl font-bold mb-4',
        h2: 'text-2xl font-bold mb-3',
    },
    list: {
        ul: 'list-disc ml-4 mb-4',
        ol: 'list-decimal ml-4 mb-4',
    },
    quote: 'border-l-4 border-border pl-4 mb-4 italic',
    code: 'bg-muted rounded px-2 py-1 font-mono',
};

function Placeholder() {
    return (
        <div className="pointer-events-none absolute top-[60px] left-3 text-muted-foreground select-none">
            Commencez à écrire ou glissez des images ici...
        </div>
    );
}

function initializeWithText(editor: LexicalEditor, text: string) {
    editor.update(() => {
        const root = $getRoot();
        root.clear();
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(text));
        root.append(paragraph);
    });
}

function EditorInitializer({ initialContent }: { initialContent: string }) {
    const [editor] = useLexicalComposerContext();
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current || !initialContent.trim()) {
            return;
        }

        hasInitialized.current = true;

        try {
            const parsedContent = JSON.parse(initialContent) as {
                root?: { children?: unknown[] };
            };

            if (parsedContent?.root?.children) {
                const editorState = editor.parseEditorState(initialContent);
                editor.setEditorState(editorState);
                return;
            }
        } catch {
            initializeWithText(editor, initialContent);
        }
    }, [editor, initialContent]);

    return null;
}

function prepareInitialState(initialContent: string) {
    if (!initialContent.trim()) {
        return null;
    }

    try {
        const parsedContent = JSON.parse(initialContent) as {
            root?: { children?: unknown[]; type?: string };
        };

        if (
            parsedContent?.root?.children &&
            Array.isArray(parsedContent.root.children) &&
            parsedContent.root.type === 'root'
        ) {
            return initialContent;
        }
    } catch {
        return null;
    }

    return null;
}

type EditorProps = {
    onChange: (serializedContent: string) => void;
    initialContent?: string;
};

export default function Editor({
    onChange,
    initialContent = '',
}: EditorProps) {
    const mountInitialContent = useRef(initialContent);

    const initialConfig = useMemo(
        () => ({
            namespace: 'SuperSecuriteArticleEditor',
            theme,
            onError(error: Error) {
                console.error('Erreur Lexical:', error);
            },
            nodes: [
                LinkNode,
                ListNode,
                ListItemNode,
                HorizontalRuleNode,
                HeadingNode,
                QuoteNode,
                CodeNode,
                ImageNode,
            ],
            editorState: prepareInitialState(mountInitialContent.current),
        }),
        [],
    );

    const handleChange = useCallback(
        (editorState: EditorState) => {
            editorState.read(() => {
                const content = editorState.toJSON();
                onChange(JSON.stringify(content));
            });
        },
        [onChange],
    );

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="overflow-hidden rounded-lg border bg-card">
                <Toolbar />
                <div className="relative min-h-[300px] p-3">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className="prose min-h-[300px] max-w-none rounded-md p-2 outline-none focus:ring-2 focus:ring-ring/20"
                                style={{ wordBreak: 'break-word' }}
                                aria-label="Éditeur de contenu"
                            />
                        }
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <MarkdownShortcutPlugin />
                    <ImagePlugin />
                    <OnChangePlugin onChange={handleChange} />
                    <EditorInitializer
                        initialContent={mountInitialContent.current}
                    />
                </div>
            </div>
        </LexicalComposer>
    );
}
