import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Badge } from '@/components/ui/badge';
import { insertTemplateVariable } from '@/components/lexical-editor/plugins/template-variable-plugin';
import {
    formatMarketingTemplateVariable,
    MARKETING_TEMPLATE_VARIABLE_LABELS,
} from '@/lib/marketing-template-variables';

type TemplateVariablePickerProps = {
    variables: string[];
};

export function TemplateVariablePicker({
    variables,
}: TemplateVariablePickerProps) {
    const { t: uiText } = useUiTranslations();

    const [editor] = useLexicalComposerContext();

    return (
        <div className="flex flex-wrap items-center gap-2 border-b bg-muted/20 px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground">
                {uiText('ui.components.text_c41ce2cc0050', 'Variables :')}
            </span>
            {variables.map((variable) => (
                <button
                    key={variable}
                    type="button"
                    className="inline-flex"
                    onClick={() => insertTemplateVariable(editor, variable)}
                    title={
                        MARKETING_TEMPLATE_VARIABLE_LABELS[variable] ?? variable
                    }
                >
                    <Badge
                        variant="outline"
                        className="cursor-pointer font-mono text-xs hover:bg-primary/10 hover:text-primary"
                    >
                        {formatMarketingTemplateVariable(variable)}
                    </Badge>
                </button>
            ))}
        </div>
    );
}
