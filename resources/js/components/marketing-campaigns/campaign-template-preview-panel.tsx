import { useTrans as useUiTranslations } from '@/hooks/use-trans';
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
    const { t: uiText } = useUiTranslations();

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
                        {isWhatsApp
                            ? uiText(
                                  'ui.components.text_94723168a3f4',
                                  'Modèle Meta',
                              )
                            : uiText(
                                  'ui.components.text_854cbc63db02',
                                  'Aperçu du template',
                              )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {template.name}
                    </p>
                </div>
                <Link
                    href={marketingTemplateShow.url(template.uuid)}
                    className="text-xs text-primary hover:underline"
                >
                    {uiText('ui.components.text_9fb440435a04', 'Ouvrir')}
                </Link>
            </div>

            {isWhatsApp ? (
                <>
                    <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between border-b pb-1 font-mono text-[11px] text-muted-foreground">
                            <span>
                                {uiText(
                                    'ui.components.text_01a7bf433c74',
                                    'Modèle :',
                                )}{' '}
                                <strong className="text-foreground">
                                    {template.meta_template_name ?? '—'}
                                </strong>
                            </span>
                            <span>
                                {template.meta_template_language?.toUpperCase() ??
                                    'FR'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1 rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-3 text-xs shadow-2xs dark:bg-emerald-950/20">
                        {template.subject ? (
                            <p className="border-b border-emerald-500/10 pb-1 font-bold text-foreground">
                                {template.subject}
                            </p>
                        ) : null}
                        <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
                            {template.body
                                ? template.body
                                      .replace(/\{\{1\}\}/g, 'Mamadou Camara')
                                      .replace(
                                          /\{\{2\}\}/g,
                                          '+224 620 00 00 00',
                                      )
                                      .replace(/\{\{3\}\}/g, 'Super Sécurité')
                                : `Message modèle WhatsApp : ${template.meta_template_name}`}
                        </p>
                        <div className="flex items-center justify-end gap-1 pt-1 text-[10px] text-muted-foreground/60">
                            <span>12:00</span>
                            <CheckCheck
                                className="size-3 text-emerald-500"
                                aria-hidden
                            />
                        </div>
                    </div>

                    <p className="text-[11px] text-muted-foreground">
                        {uiText(
                            'ui.components.text_748242fe0f6f',
                            'Les variables',
                        )}{' '}
                        <code className="font-bold text-primary">
                            {'{{1}}'}
                        </code>{' '}
                        {uiText('ui.components.text_a85ad92bf9c2', '(Nom),')}{' '}
                        <code className="font-bold text-primary">
                            {'{{2}}'}
                        </code>{' '}
                        {uiText(
                            'ui.components.text_842b7a454f7f',
                            '(Téléphone) et',
                        )}{' '}
                        <code className="font-bold text-primary">
                            {'{{3}}'}
                        </code>{' '}
                        {uiText(
                            'ui.components.text_29e75bf2b5f9',
                            '(Entreprise) sont automatiquement insérées pour chaque destinataire.',
                        )}
                    </p>
                </>
            ) : (
                <>
                    <div className="space-y-2">
                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {uiText('ui.components.text_b01189cd35d9', 'Objet')}
                        </p>
                        <p className="text-sm leading-relaxed">
                            {template.subject
                                ? template.subject
                                      .split(/(\{\{[a-z_]+\}\})/g)
                                      .filter(Boolean)
                                      .map((part, index) => {
                                          const match =
                                              part.match(/^\{\{([a-z_]+)\}\}$/);

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
                                              <span
                                                  key={`subject-text-${index}`}
                                              >
                                                  {part}
                                              </span>
                                          );
                                      })
                                : '—'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {uiText(
                                'ui.components.text_7a6de5670ea8',
                                'Contenu',
                            )}
                        </p>
                        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                            <ContentRenderer content={template.body} />
                        </div>
                    </div>

                    <Badge variant="outline" className="text-xs">
                        {uiText(
                            'ui.components.text_c115c7b1b675',
                            'Le contenu ci-dessous reste personnalisable avant envoi.',
                        )}
                    </Badge>
                </>
            )}
        </section>
    );
}
