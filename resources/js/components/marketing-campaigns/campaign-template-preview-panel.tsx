import { Link } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import ContentRenderer from '@/components/lexical-editor/content-renderer';
import { Badge } from '@/components/ui/badge';
import { variableTokenClassName } from '@/lib/marketing-template-variables';
import { show as marketingTemplateShow } from '@/routes/marketing-templates';

type TemplatePreview = {
    uuid: string;
    name: string;
    channel: string;
    subject: string | null;
    body: string;
    meta_template_name?: string | null;
    meta_template_language?: string | null;
};

type CampaignTemplatePreviewPanelProps = {
    template: TemplatePreview | null;
};

export default function CampaignTemplatePreviewPanel({
    template,
}: CampaignTemplatePreviewPanelProps) {
    if (template === null) {
        return null;
    }

    const isWhatsApp = template.channel === 'whatsapp';

    return (
        <section className="app-panel space-y-4 p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <FileText className="size-4" aria-hidden />
                        {isWhatsApp ? 'Modèle Meta' : 'Aperçu du template'}
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">{template.name}</p>
                </div>
                <Link
                    href={marketingTemplateShow.url(template.uuid)}
                    className="text-primary text-xs hover:underline"
                >
                    Ouvrir
                </Link>
            </div>

            {isWhatsApp ? (
                <>
                    <div className="space-y-2">
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                            Nom Meta
                        </p>
                        <p className="font-mono text-sm">
                            {template.meta_template_name ?? '—'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                            Langue
                        </p>
                        <p className="font-mono text-sm">
                            {template.meta_template_language ?? '—'}
                        </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        Envoi exclusivement via ce modèle Meta approuvé.
                    </Badge>
                </>
            ) : (
                <>
                    <div className="space-y-2">
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                            Objet
                        </p>
                        <p className="text-sm leading-relaxed">
                            {template.subject
                                ? template.subject
                                      .split(/(\{\{[a-z_]+\}\})/g)
                                      .filter(Boolean)
                                      .map((part, index) => {
                                          const match = part.match(/^\{\{([a-z_]+)\}\}$/);

                                          if (match) {
                                              return (
                                                  <span
                                                      key={`subject-var-${index}`}
                                                      className={variableTokenClassName()}
                                                  >
                                                      {part}
                                                  </span>
                                              );
                                          }

                                          return (
                                              <span key={`subject-text-${index}`}>{part}</span>
                                          );
                                      })
                                : '—'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                            Contenu
                        </p>
                        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                            <ContentRenderer content={template.body} />
                        </div>
                    </div>

                    <Badge variant="outline" className="text-xs">
                        Le contenu ci-dessous reste personnalisable avant envoi.
                    </Badge>
                </>
            )}
        </section>
    );
}
