import { Head, usePage } from '@inertiajs/react';
import ArticleForm from '@/components/articles/article-form';
import { create, index, store } from '@/routes/articles';

type PageProps = {
    canApprove: boolean;
    canFeature: boolean;
    errors: Record<string, string>;
};

export default function ArticlesCreate() {
    const { canApprove, canFeature, errors } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Nouvelle actualité" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Nouvelle actualité
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Rédigez un article : il sera automatiquement soumis
                        pour validation.
                    </p>
                </div>

                <ArticleForm
                    canApprove={canApprove}
                    canFeature={canFeature}
                    submitUrl={store.url()}
                    submitLabel="Créer l'actualité"
                    cancelHref={index.url()}
                    errors={errors}
                />
            </div>
        </>
    );
}

ArticlesCreate.layout = {
    breadcrumbs: [
        { title: 'Actualités', href: index.url() },
        { title: 'Nouvelle', href: create.url() },
    ],
};
