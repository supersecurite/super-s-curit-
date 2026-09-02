import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    createCommand,
    DecoratorNode,
    type LexicalCommand,
    type NodeKey,
    type SerializedLexicalNode,
} from 'lexical';
import { useCallback, useEffect, type JSX } from 'react';

type ImagePayload = {
    src: string;
    alt?: string;
};

export const INSERT_IMAGE_COMMAND: LexicalCommand<ImagePayload> =
    createCommand('INSERT_IMAGE_COMMAND');

type SerializedImageNode = SerializedLexicalNode & {
    src: string;
    alt?: string;
};

export class ImageNode extends DecoratorNode<JSX.Element> {
    __src: string;
    __alt: string;

    static getType(): string {
        return 'image';
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(node.__src, node.__alt, node.__key);
    }

    constructor(src: string, alt?: string, key?: NodeKey) {
        super(key);
        this.__src = src;
        this.__alt = alt ?? '';
    }

    createDOM(): HTMLElement {
        const div = document.createElement('div');
        div.className = 'image-container my-4 text-center';
        return div;
    }

    updateDOM(): false {
        return false;
    }

    decorate(): JSX.Element {
        return (
            <img
                src={this.__src}
                alt={this.__alt || 'Image insérée'}
                className="h-auto max-w-full rounded-lg shadow-sm"
                style={{ maxHeight: '400px' }}
                draggable={false}
            />
        );
    }

    static importJSON(serializedNode: SerializedImageNode): ImageNode {
        return new ImageNode(serializedNode.src, serializedNode.alt);
    }

    exportJSON(): SerializedImageNode {
        return {
            type: 'image',
            src: this.__src,
            alt: this.__alt,
            version: 1,
        };
    }
}

export function $createImageNode(src: string, alt?: string): ImageNode {
    return new ImageNode(src, alt);
}

function csrfToken(): string | null {
    const meta = document.querySelector('meta[name="csrf-token"]');
    if (meta instanceof HTMLMetaElement && meta.content) {
        return meta.content;
    }

    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

type ImagePluginProps = {
    /** Si fourni, les fichiers sont uploadés (URL) au lieu d'être encodés en base64. */
    uploadUrl?: string;
};

export default function ImagePlugin({ uploadUrl }: ImagePluginProps = {}) {
    const [editor] = useLexicalComposerContext();

    const processImageFile = useCallback(
        async (file: File) => {
            if (!file.type.startsWith('image/')) {
                return;
            }

            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                window.alert("L'image est trop volumineuse. Taille maximale : 5 Mo.");
                return;
            }

            if (uploadUrl) {
                try {
                    const formData = new FormData();
                    formData.append('image', file);

                    const headers: HeadersInit = {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    };
                    const token = csrfToken();
                    if (token) {
                        headers['X-CSRF-TOKEN'] = token;
                        headers['X-XSRF-TOKEN'] = token;
                    }

                    const response = await fetch(uploadUrl, {
                        method: 'POST',
                        headers,
                        body: formData,
                        credentials: 'same-origin',
                    });

                    if (!response.ok) {
                        const payload = (await response.json().catch(() => null)) as {
                            message?: string;
                            errors?: Record<string, string[]>;
                        } | null;
                        const firstError = payload?.errors
                            ? Object.values(payload.errors)[0]?.[0]
                            : null;
                        throw new Error(
                            firstError ?? payload?.message ?? "Échec de l'upload de l'image.",
                        );
                    }

                    const payload = (await response.json()) as { url?: string };
                    if (!payload.url) {
                        throw new Error("L'upload n'a pas renvoyé d'URL.");
                    }

                    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                        src: payload.url,
                        alt: file.name,
                    });
                } catch (error: unknown) {
                    window.alert(
                        error instanceof Error
                            ? error.message
                            : "Impossible d'uploader l'image.",
                    );
                }

                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const src = event.target?.result;
                if (typeof src === 'string') {
                    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                        src,
                        alt: file.name,
                    });
                }
            };
            reader.readAsDataURL(file);
        },
        [editor, uploadUrl],
    );

    useEffect(() => {
        const editorElement = editor.getRootElement();
        if (!editorElement) {
            return;
        }

        let dragCounter = 0;

        const preventDefaults = (event: DragEvent) => {
            event.preventDefault();
            event.stopPropagation();
        };

        const handleDragEnter = (event: DragEvent) => {
            preventDefaults(event);
            dragCounter++;
            editorElement.classList.add('drag-over');
        };

        const handleDragLeave = (event: DragEvent) => {
            preventDefaults(event);
            dragCounter--;
            if (dragCounter === 0) {
                editorElement.classList.remove('drag-over');
            }
        };

        const handleDrop = (event: DragEvent) => {
            preventDefaults(event);
            dragCounter = 0;
            editorElement.classList.remove('drag-over');

            const files = Array.from(event.dataTransfer?.files ?? []);
            files
                .filter((file) => file.type.startsWith('image/'))
                .forEach((file) => {
                    void processImageFile(file);
                });
        };

        editorElement.addEventListener('dragenter', handleDragEnter);
        editorElement.addEventListener('dragleave', handleDragLeave);
        editorElement.addEventListener('dragover', preventDefaults);
        editorElement.addEventListener('drop', handleDrop);

        return () => {
            editorElement.removeEventListener('dragenter', handleDragEnter);
            editorElement.removeEventListener('dragleave', handleDragLeave);
            editorElement.removeEventListener('dragover', preventDefaults);
            editorElement.removeEventListener('drop', handleDrop);
        };
    }, [editor, processImageFile]);

    useEffect(() => {
        const editorElement = editor.getRootElement();
        if (!editorElement) {
            return;
        }

        const handlePaste = (event: ClipboardEvent) => {
            const items = Array.from(event.clipboardData?.items ?? []);
            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    event.preventDefault();
                    const file = item.getAsFile();
                    if (file) {
                        void processImageFile(file);
                    }
                    break;
                }
            }
        };

        editorElement.addEventListener('paste', handlePaste);
        return () => editorElement.removeEventListener('paste', handlePaste);
    }, [editor, processImageFile]);

    useEffect(() => {
        return editor.registerCommand<ImagePayload>(
            INSERT_IMAGE_COMMAND,
            (payload) => {
                editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        const imageNode = $createImageNode(
                            payload.src,
                            payload.alt,
                        );
                        selection.insertNodes([imageNode]);
                        selection.insertNodes([$createParagraphNode()]);
                    }
                });
                return true;
            },
            1,
        );
    }, [editor]);

    return null;
}
