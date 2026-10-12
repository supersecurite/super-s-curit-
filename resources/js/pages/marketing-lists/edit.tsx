import { Head, Link, setLayoutProps, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import MarketingListForm from '@/components/marketing-lists/marketing-list-form';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { useTrans } from '@/hooks/use-trans';
import { destroy, edit, index, show, update } from '@/routes/marketing-lists';

type ListData = {
    uuid: string;
    name: string;
    description: string | null;
};

type PageProps = {
    list: ListData;
    canDelete: boolean;
    errors: Record<string, string>;
};

export default function MarketingListsEdit() {
    const { t } = useTrans();
    const { list, canDelete, errors } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            { title: t('marketing_lists.title', 'Groupes'), href: index.url() },
            { title: list.name, href: show.url(list.uuid) },
            {
                title: t('common.modify', 'Modifier'),
                href: edit.url(list.uuid),
            },
        ],
    });

    return (
        <>
            <Head
                title={`${t('marketing_lists.edit', 'Modifier le groupe')} — ${list.name}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <Link
                        href={show.url(list.uuid)}
                        className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-sm"
                    >
                        <ArrowLeft className="size-4" aria-hidden />
                        {t(
                            'marketing_lists.back_to_detail',
                            'Retour au détail',
                        )}
                    </Link>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        {t('marketing_lists.edit', 'Modifier le groupe')}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {t(
                            'marketing_lists.edit_subtitle',
                            "Nom et description de l'audience.",
                        )}
                    </p>
                </div>

                <MarketingListForm
                    submitUrl={update.url(list.uuid)}
                    submitLabel={t('common.save', 'Enregistrer')}
                    cancelHref={show.url(list.uuid)}
                    errors={errors}
                    list={list}
                    method="put"
                />

                {canDelete ? (
                    <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
                        <p className="text-sm font-medium text-red-700">
                            {t(
                                'marketing_lists.sensitive_zone',
                                'Zone sensible',
                            )}
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {t(
                                'marketing_lists.sensitive_delete_hint',
                                'La suppression retire le groupe sans effacer les contacts.',
                            )}
                        </p>
                        <div className="mt-3">
                            <ConfirmDeleteDialog
                                title={t(
                                    'marketing_lists.delete_confirm',
                                    'Supprimer ce groupe ?',
                                )}
                                description={t(
                                    'marketing_lists.delete_description_permanent',
                                    'Le groupe « :name » sera définitivement supprimé.',
                                    { name: list.name },
                                )}
                                deleteUrl={destroy.url(list.uuid)}
                            />
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
}
