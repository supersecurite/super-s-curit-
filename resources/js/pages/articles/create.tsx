import { Head, setLayoutProps, usePage } from '@inertiajs/react';
import ArticleForm from '@/components/articles/article-form';
import { useTrans } from '@/hooks/use-trans';
import { create, index, store } from '@/routes/articles';

type PageProps = {
    canApprove: boolean;
    canFeature: boolean;
    errors: Record<string, string>;
};

export default function ArticlesCreate() {
    const { t } = useTrans();
    const { canApprove, canFeature, errors } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            { title: t('articles.title', 'Actualités'), href: index.url() },
            { title: t('articles.create', 'Nouvel article'), href: create.url() },
        ],
    });

    return (
        <>
            <Head title={t('articles.create', 'Nouvel article')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        {t('articles.create', 'Nouvel article')}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {t(
                            'articles.create_subtitle',
                            'Rédigez un article : il sera automatiquement soumis pour validation.',
                        )}
                    </p>
                </div>

                <ArticleForm
                    canApprove={canApprove}
                    canFeature={canFeature}
                    submitUrl={store.url()}
                    submitLabel={t('common.create', 'Créer')}
                    cancelHref={index.url()}
                    errors={errors}
                />
            </div>
        </>
    );
}
