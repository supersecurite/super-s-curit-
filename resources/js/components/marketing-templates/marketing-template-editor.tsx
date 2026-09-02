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
    type EditorState,
    type LexicalEditor,
} from 'lexical';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { TemplateVariableNode } from '@/components/lexical-editor/nodes/template-variable-node';
import ImagePlugin, { ImageNode } from '@/components/lexical-editor/plugins/image-plugin';
import {
    $importPlainTemplateContent,
    TemplateVariableAutocompletePlugin,
} from '@/components/lexical-editor/plugins/template-variable-plugin';
import Toolbar from '@/components/lexical-editor/toolbar';
import { TemplateVariablePicker } from '@/components/marketing-templates/template-variable-picker';

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
            Rédigez votre message ou insérez des variables…
        </div>
    );
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

function EditorInitializer({
    initialContent,
    fallbackPlainContent,
}: {
    initialContent: string;
    fallbackPlainContent: string;
}) {
    const [editor] = useLexicalComposerContext();
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current) {
            return;
        }

        hasInitialized.current = true;

        const content = initialContent.trim() || fallbackPlainContent.trim();

        if (!content) {
            return;
        }

        try {
            const parsedContent = JSON.parse(content) as {
                root?: { children?: unknown[] };
            };

            if (parsedContent?.root?.children) {
                const editorState = editor.parseEditorState(content);
                editor.setEditorState(editorState);
                return;
            }
        } catch {
            editor.update(() => {
                $importPlainTemplateContent(content);
            });
        }
    }, [editor, fallbackPlainContent, initialContent]);

    return null;
}

type MarketingTemplateEditorProps = {
    onChange: (serializedContent: string) => void;
    initialContent?: string;
    fallbackPlainContent?: string;
    variables: string[];
};

export default function MarketingTemplateEditor({
    onChange,
    initialContent = '',
    fallbackPlainContent = '',
    variables,
}: MarketingTemplateEditorProps) {
    const mountInitialContent = useRef(initialContent);

    const initialConfig = useMemo(
        () => ({
            namespace: 'SuperSecuriteMarketingTemplateEditor',
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
                TemplateVariableNode,
            ],
            editorState: prepareInitialState(mountInitialContent.current),
        }),
        [],
    );

    const handleChange = useCallback(
        (editorState: EditorState) => {
            editorState.read(() => {
                onChange(JSON.stringify(editorState.toJSON()));
            });
        },
        [onChange],
    );

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="overflow-hidden rounded-lg border bg-card">
                <Toolbar />
                <TemplateVariablePicker variables={variables} />
                <div className="relative min-h-[300px] p-3">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className="prose min-h-[300px] max-w-none rounded-md p-2 outline-none focus:ring-2 focus:ring-ring/20"
                                style={{ wordBreak: 'break-word' }}
                                aria-label="Éditeur de template de message"
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
                    <TemplateVariableAutocompletePlugin variables={variables} />
                    <OnChangePlugin onChange={handleChange} />
                    <EditorInitializer
                        initialContent={mountInitialContent.current}
                        fallbackPlainContent={fallbackPlainContent}
                    />
                </div>
            </div>
        </LexicalComposer>
    );
}
