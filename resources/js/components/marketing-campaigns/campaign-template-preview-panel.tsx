import { Link } from '@inertiajs/react';
import { FileText, CheckCheck } from 'lucide-react';
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
                    <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground border-b pb-1">
                            <span>Modèle : <strong className="text-foreground">{template.meta_template_name ?? '—'}</strong></span>
                            <span>{template.meta_template_language?.toUpperCase() ?? 'FR'}</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 space-y-1 text-xs shadow-2xs">
                        {template.subject ? (
                            <p className="font-bold text-foreground border-b border-emerald-500/10 pb-1">
                                {template.subject}
                            </p>
                        ) : null}
                        <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                            {template.body
                                ? template.body
                                      .replace(/\{\{1\}\}/g, 'Mamadou Camara')
                                      .replace(/\{\{2\}\}/g, '+224 620 00 00 00')
                                      .replace(/\{\{3\}\}/g, 'Super Sécurité')
                                : `Message modèle WhatsApp : ${template.meta_template_name}`}
                        </p>
                        <div className="text-[10px] text-muted-foreground/60 flex items-center justify-end gap-1 pt-1">
                            <span>12:00</span>
                            <CheckCheck className="size-3 text-emerald-500" aria-hidden />
                        </div>
                    </div>

                    <p className="text-[11px] text-muted-foreground">
                        Les variables <code className="font-bold text-primary">{'{{1}}'}</code> (Nom), <code className="font-bold text-primary">{'{{2}}'}</code> (Téléphone) et <code className="font-bold text-primary">{'{{3}}'}</code> (Entreprise) sont automatiquement insérées pour chaque destinataire.
                    </p>
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
