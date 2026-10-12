import { Head, setLayoutProps, usePage } from '@inertiajs/react';
import MarketingListForm from '@/components/marketing-lists/marketing-list-form';
import { useTrans } from '@/hooks/use-trans';
import { create, index, store } from '@/routes/marketing-lists';

type PageProps = {
    errors: Record<string, string>;
};

export default function MarketingListsCreate() {
    const { t } = useTrans();
    const { errors } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            {
                title: t('marketing_lists.title', 'Groupes'),
                href: index.url(),
            },
            {
                title: t('marketing_lists.create', 'Nouveau groupe'),
                href: create.url(),
            },
        ],
    });

    return (
        <>
            <Head title={t('marketing_lists.create', 'Nouveau groupe')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        {t('marketing_lists.create', 'Nouveau groupe')}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {t(
                            'marketing_lists.create_subtitle',
                            'Créez une audience pour vos campagnes marketing.',
                        )}
                    </p>
                </div>

                <MarketingListForm
                    submitUrl={store.url()}
                    submitLabel={t(
                        'marketing_lists.submit_create',
                        'Créer le groupe',
                    )}
                    cancelHref={index.url()}
                    errors={errors}
                />
            </div>
        </>
    );
}
