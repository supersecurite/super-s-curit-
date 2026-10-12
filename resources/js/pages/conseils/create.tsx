import { Head, setLayoutProps, usePage } from '@inertiajs/react';
import SecurityTipForm from '@/components/conseils/security-tip-form';
import { useTrans } from '@/hooks/use-trans';
import { create, index, store } from '@/routes/conseils';

type PageProps = {
    canApprove: boolean;
    canFeature: boolean;
    errors: Record<string, string>;
};

export default function ConseilsCreate() {
    const { t } = useTrans();
    const { canApprove, canFeature, errors } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            { title: t('tips.title', 'Conseils'), href: index.url() },
            { title: t('tips.create', 'Nouveau conseil'), href: create.url() },
        ],
    });

    return (
        <>
            <Head title={t('tips.create', 'Nouveau conseil')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        {t('tips.create', 'Nouveau conseil')}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {t(
                            'tips.create_subtitle',
                            'Rédigez un conseil de sécurité : il sera automatiquement soumis pour validation.',
                        )}
                    </p>
                </div>

                <SecurityTipForm
                    canApprove={canApprove}
                    canFeature={canFeature}
                    submitUrl={store.url()}
                    submitLabel={t('tips.submit_create', 'Créer le conseil')}
                    cancelHref={index.url()}
                    errors={errors}
                />
            </div>
        </>
    );
}
