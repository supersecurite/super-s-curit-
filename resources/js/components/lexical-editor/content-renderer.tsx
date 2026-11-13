import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import type { ReactNode } from 'react';

type LexicalNode = {
    type?: string;
    text?: string;
    format?: number;
    tag?: string;
    listType?: string;
    src?: string;
    alt?: string;
    url?: string;
    children?: LexicalNode[];
};

type LexicalDocument = {
    root?: {
        children?: LexicalNode[];
    };
    isPlainText?: boolean;
    content?: string;
};

type ContentRendererProps = {
    content: string | null | undefined;
    className?: string;
};

const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
const MARKDOWN_LINK_PATTERN =
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|tel:[^\s)]+|\/[^\s)]+)\)/g;

function validateAndParseContent(rawContent: string | null | undefined) {
    if (!rawContent) {
        return null;
    }

    if (typeof rawContent !== 'string') {
        return null;
    }

    const trimmedContent = rawContent.trim();

    if (!trimmedContent) {
        return null;
    }

    try {
        const parsedContent = JSON.parse(trimmedContent) as LexicalDocument;

        if (
            parsedContent?.root?.children &&
            Array.isArray(parsedContent.root.children)
        ) {
            return parsedContent;
        }

        return { isPlainText: true, content: trimmedContent };
    } catch {
        return { isPlainText: true, content: trimmedContent };
    }
}

function renderAnchor(href: string, children: ReactNode, key?: string | number) {
    const isExternal = /^https?:\/\//i.test(href);

    return (
        <a
            key={key}
            href={href}
            className="font-medium text-super-securite-accent underline underline-offset-2 hover:opacity-90"
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
        >
            {children}
        </a>
    );
}

function applyTextFormat(text: ReactNode, format?: number): ReactNode {
    if (!format || typeof format !== 'number') {
        return text;
    }

    let formattedText: ReactNode = text;

    if (format & 1) {
        formattedText = <strong>{formattedText}</strong>;
    }
    if (format & 2) {
        formattedText = <em>{formattedText}</em>;
    }
    if (format & 4) {
        formattedText = <u>{formattedText}</u>;
    }
    if (format & 8) {
        formattedText = <del>{formattedText}</del>;
    }
    if (format & 16) {
        formattedText = (
            <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                {formattedText}
            </code>
        );
    }

    return formattedText;
}

/** Compatibilité : anciens contenus où le lien était stocké en markdown texte. */
function renderTextWithMarkdownLinks(
    text: string,
    format?: number,
): ReactNode {
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    const pattern = new RegExp(MARKDOWN_LINK_PATTERN.source, 'g');
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(
                applyTextFormat(text.slice(lastIndex, match.index), format),
            );
        }

        parts.push(renderAnchor(match[2], applyTextFormat(match[1], format), match.index));
        lastIndex = match.index + match[0].length;
    }

    if (parts.length === 0) {
        return applyTextFormat(text, format);
    }

    if (lastIndex < text.length) {
        parts.push(applyTextFormat(text.slice(lastIndex), format));
    }

    return parts;
}

function renderTextContent(child: LexicalNode): ReactNode {
    const text = child.text ?? '';

    if (!text && text !== '') {
        return null;
    }

    return renderTextWithMarkdownLinks(text, child.format);
}

function renderImage(node: LexicalNode, index: number) {
    if (!node.src) {
        return null;
    }

    return (
        <div key={index} className="mx-auto my-4 max-w-full">
            <img
                src={node.src}
                alt={node.alt || 'Image'}
                className="mx-auto h-auto max-w-full rounded-lg shadow-lg"
                style={{ maxHeight: '500px' }}
            />
            {node.alt ? (
                <p className="mt-2 text-center text-sm text-super-securite-muted italic">
                    {node.alt}
                </p>
            ) : null}
        </div>
    );
}

function renderNodeChildren(children: LexicalNode[] | undefined): ReactNode {
    if (!Array.isArray(children)) {
        return null;
    }

    return children.map((child, index) => {
        if (!child || typeof child !== 'object') {
            return null;
        }

        if (child.type === 'text') {
            return <span key={index}>{renderTextContent(child)}</span>;
        }

        if (child.type === 'template-variable') {
            return (
                <span
                    key={index}
                    className="rounded bg-primary/15 px-1.5 py-0.5 font-mono text-sm font-semibold text-primary"
                >
                    {child.text}
                </span>
            );
        }

        if (child.type === 'linebreak' || child.type === 'break') {
            return <br key={index} />;
        }

        if (child.type === 'link' && child.children) {
            return renderAnchor(
                child.url || '#',
                renderNodeChildren(child.children),
                index,
            );
        }

        if (child.type === 'image') {
            return renderImage(child, index);
        }

        return null;
    });
}

export default function ContentRenderer({
    content,
    className = '',
}: ContentRendererProps) {
    const { t: uiText } = useUiTranslations();

    const parsedContent = validateAndParseContent(content);

    if (!parsedContent) {
        return (
            <p className="text-super-securite-muted italic">
                {uiText(
                    'ui.components.text_33028e77dd97',
                    'Aucun contenu disponible.',
                )}
            </p>
        );
    }

    if ('isPlainText' in parsedContent && parsedContent.isPlainText) {
        return (
            <div className={`whitespace-pre-wrap ${className}`}>
                {(parsedContent.content ?? '')
                    .split('\n')
                    .map((line, index) => (
                        <p
                            key={index}
                            className="mb-2 leading-relaxed last:mb-0"
                        >
                            {line
                                .split(/(\{\{[a-z_]+\}\})/g)
                                .filter(Boolean)
                                .map((part, partIndex) => {
                                    const match =
                                        part.match(/^\{\{([a-z_]+)\}\}$/);

                                    if (match) {
                                        return (
                                            <span
                                                key={`${index}-${partIndex}`}
                                                className="rounded bg-primary/15 px-1.5 py-0.5 font-mono text-sm font-semibold text-primary"
                                            >
                                                {part}
                                            </span>
                                        );
                                    }

                                    return (
                                        <span key={`${index}-${partIndex}`}>
                                            {part}
                                        </span>
                                    );
                                })}
                            {!line ? <br /> : null}
                        </p>
                    ))}
            </div>
        );
    }

    const nodes = parsedContent.root?.children ?? [];

    return (
        <div className={`prose prose-lg max-w-none ${className}`}>
            {nodes.map((node, index) => {
                if (!node || typeof node !== 'object') {
                    return null;
                }

                if (node.type === 'paragraph') {
                    return (
                        <p
                            key={index}
                            className="mb-4 leading-relaxed text-super-securite-text last:mb-0"
                        >
                            {renderNodeChildren(node.children) ?? <br />}
                        </p>
                    );
                }

                if (node.type === 'heading' && node.tag) {
                    const level = Math.min(
                        Math.max(
                            parseInt(node.tag.replace('h', ''), 10) || 1,
                            1,
                        ),
                        6,
                    );
                    const Tag = HEADING_TAGS[level - 1];
                    const classes = [
                        'font-heading font-bold text-super-securite-heading first:mt-0',
                        level === 1 ? 'mb-4 mt-6 text-3xl' : '',
                        level === 2 ? 'mb-3 mt-5 text-2xl' : '',
                        level >= 3 ? 'mb-3 mt-4 text-xl' : '',
                    ].join(' ');

                    return (
                        <Tag key={index} className={classes}>
                            {renderNodeChildren(node.children)}
                        </Tag>
                    );
                }

                if (node.type === 'list') {
                    const ListTag = node.listType === 'number' ? 'ol' : 'ul';
                    const listClass =
                        node.listType === 'number'
                            ? 'mb-4 ml-4 list-decimal space-y-1'
                            : 'mb-4 ml-4 list-disc space-y-1';

                    return (
                        <ListTag key={index} className={listClass}>
                            {node.children?.map((item, itemIndex) => (
                                <li
                                    key={itemIndex}
                                    className="leading-relaxed text-super-securite-text"
                                >
                                    {renderNodeChildren(item.children)}
                                </li>
                            ))}
                        </ListTag>
                    );
                }

                if (node.type === 'quote') {
                    return (
                        <blockquote
                            key={index}
                            className="mb-4 border-l-4 border-super-securite-border bg-super-securite-surface/50 py-2 pl-4 italic"
                        >
                            {renderNodeChildren(node.children)}
                        </blockquote>
                    );
                }

                if (node.type === 'code') {
                    return (
                        <pre
                            key={index}
                            className="mb-4 overflow-x-auto rounded border bg-muted px-2 py-1 font-mono"
                        >
                            <code>{renderNodeChildren(node.children)}</code>
                        </pre>
                    );
                }

                if (node.type === 'image') {
                    return renderImage(node, index);
                }

                if (node.type === 'horizontalrule') {
                    return (
                        <hr
                            key={index}
                            className="my-6 border-super-securite-border"
                        />
                    );
                }

                if (node.children) {
                    return (
                        <div key={index} className="mb-4">
                            {renderNodeChildren(node.children)}
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
}
