import {
    $applyNodeReplacement,
    TextNode,
    type EditorConfig,
    type LexicalNode,
    type NodeKey,
    type SerializedTextNode,
    type Spread,
} from 'lexical';

export type SerializedTemplateVariableNode = Spread<
    {
        type: 'template-variable';
        variable: string;
    },
    SerializedTextNode
>;

export class TemplateVariableNode extends TextNode {
    __variable: string;

    static getType(): string {
        return 'template-variable';
    }

    static clone(node: TemplateVariableNode): TemplateVariableNode {
        return new TemplateVariableNode(node.__variable, node.__key);
    }

    constructor(variable: string, key?: NodeKey) {
        super(formatVariableToken(variable), key);
        this.__variable = variable;
    }

    getVariable(): string {
        return this.__variable;
    }

    createDOM(config: EditorConfig): HTMLElement {
        const dom = super.createDOM(config);
        dom.className =
            'rounded bg-primary/15 px-1.5 py-0.5 font-mono text-sm font-semibold text-primary';
        dom.setAttribute('data-template-variable', this.__variable);
        return dom;
    }

    isToken(): boolean {
        return true;
    }

    exportJSON(): SerializedTemplateVariableNode {
        return {
            ...super.exportJSON(),
            type: 'template-variable',
            variable: this.__variable,
            text: formatVariableToken(this.__variable),
        };
    }

    static importJSON(
        serialized: SerializedTemplateVariableNode,
    ): TemplateVariableNode {
        return $createTemplateVariableNode(serialized.variable);
    }
}

export function formatVariableToken(variable: string): string {
    return `{{${variable}}}`;
}

export function $createTemplateVariableNode(variable: string): TemplateVariableNode {
    return $applyNodeReplacement(new TemplateVariableNode(variable));
}

export function $isTemplateVariableNode(
    node: LexicalNode | null | undefined,
): node is TemplateVariableNode {
    return node instanceof TemplateVariableNode;
}
