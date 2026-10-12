import { Form, Head, Link, setLayoutProps, usePage } from '@inertiajs/react';
import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTrans } from '@/hooks/use-trans';
import { importMethod as importPage, index } from '@/routes/marketing-clients';
import { store as importStore, template as importTemplate } from '@/routes/marketing-clients/import';

type ImportReport = {
    added: number;
    skipped: number;
    errors_count: number;
    duplicates_count: number;
    errors: Array<{ row: number; message: string }>;
    duplicates: Array<{ row: number; email: string | null; phone: string | null }>;
};

type PageProps = {
    importReport?: ImportReport | null;
    errors: Record<string, string>;
};

export default function MarketingClientsImport() {
    const { t } = useTrans();
    const { importReport, errors } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            {
                title: t('marketing_contacts.title', 'Contacts marketing'),
                href: index.url(),
            },
            {
                title: t(
                    'marketing_contacts.import_breadcrumb',
                    'Import CSV',
                ),
                href: importPage.url(),
            },
        ],
    });

    return (
        <>
            <Head
                title={t(
                    'marketing_contacts.import_page',
                    'Importer des contacts',
                )}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
                        <Upload className="size-6" aria-hidden />
                        {t(
                            'marketing_contacts.import_page',
                            'Importer des contacts',
                        )}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {t(
                            'marketing_contacts.import_subtitle',
                            'Téléchargez le modèle CSV, remplissez-le puis importez-le ci-dessous.',
                        )}
                    </p>
                </div>

                <div className="max-w-xl rounded-xl border bg-card p-6">
                    <h2 className="mb-2 text-sm font-semibold">
                        {t(
                            'marketing_contacts.import_template_heading',
                            'Modèle CSV',
                        )}
                    </h2>
                    <p className="text-muted-foreground mb-4 text-sm">
                        {t(
                            'marketing_contacts.import_template_description',
                            "Colonnes : nom, email, telephone, groupe (optionnel), adresse, consentement (oui/non). Au moins un e-mail ou un téléphone E.164 par ligne.",
                        )}
                    </p>
                    <Button variant="outline" asChild>
                        <a href={importTemplate.url()} download>
                            <Download className="size-4" aria-hidden />
                            {t(
                                'marketing_contacts.import_download_template',
                                'Télécharger le modèle',
                            )}
                        </a>
                    </Button>
                </div>

                <Form
                    action={importStore.url()}
                    method="post"
                    encType="multipart/form-data"
                    className="max-w-xl space-y-4 rounded-xl border bg-card p-6"
                >
                    <div className="space-y-2">
                        <Label htmlFor="file">
                            {t(
                                'marketing_contacts.import_file_label',
                                'Fichier CSV',
                            )}
                        </Label>
                        <Input id="file" name="file" type="file" accept=".csv,text/csv" required />
                        {errors.file ? (
                            <p className="text-sm text-destructive">{errors.file}</p>
                        ) : null}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button type="submit">
                            {t(
                                'marketing_contacts.import_submit',
                                "Lancer l'import",
                            )}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href={index.url()}>
                                {t(
                                    'marketing_contacts.back_to_list',
                                    'Retour à la liste',
                                )}
                            </Link>
                        </Button>
                    </div>
                </Form>

                {importReport ? (
                    <div className="space-y-4 rounded-xl border bg-card p-6">
                        <h2 className="font-semibold">
                            {t(
                                'marketing_contacts.import_report_heading',
                                "Rapport d'import",
                            )}
                        </h2>
                        <ul className="text-sm">
                            <li>
                                {t(
                                    'marketing_contacts.import_added',
                                    ':count contact(s) ajouté(s)',
                                    { count: importReport.added },
                                )}
                            </li>
                            <li>
                                {t(
                                    'marketing_contacts.import_skipped',
                                    ':count doublon(s) ignoré(s)',
                                    { count: importReport.skipped },
                                )}
                            </li>
                            <li>
                                {t(
                                    'marketing_contacts.import_errors_count',
                                    ':count ligne(s) en erreur',
                                    { count: importReport.errors_count },
                                )}
                            </li>
                        </ul>

                        {importReport.errors.length > 0 ? (
                            <div>
                                <h3 className="mb-2 text-sm font-medium">
                                    {t(
                                        'marketing_contacts.import_errors_heading',
                                        'Erreurs',
                                    )}
                                </h3>
                                <ul className="text-muted-foreground space-y-1 text-sm">
                                    {importReport.errors.map((error) => (
                                        <li key={`error-${error.row}`}>
                                            {t(
                                                'marketing_contacts.import_line_error',
                                                'Ligne :row : :message',
                                                {
                                                    row: error.row,
                                                    message: error.message,
                                                },
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}

                        {importReport.duplicates.length > 0 ? (
                            <div>
                                <h3 className="mb-2 text-sm font-medium">
                                    {t(
                                        'marketing_contacts.import_duplicates_heading',
                                        'Doublons ignorés',
                                    )}
                                </h3>
                                <ul className="text-muted-foreground space-y-1 text-sm">
                                    {importReport.duplicates.map((duplicate) => (
                                        <li key={`dup-${duplicate.row}`}>
                                            {t(
                                                'marketing_contacts.import_line_duplicate',
                                                'Ligne :row : :value',
                                                {
                                                    row: duplicate.row,
                                                    value:
                                                        duplicate.email ??
                                                        duplicate.phone ??
                                                        '—',
                                                },
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </>
    );
}
