import { Head, usePage } from '@inertiajs/react';
import ArticleForm, {
    type ArticleFormData,
    type StatusOption,
} from '@/components/articles/article-form';
import ContentShareLinks from '@/components/content-share-links';
import { edit, index, update } from '@/routes/articles';

type PageProps = {
    article: ArticleFormData;
    statusOptions: StatusOption[];
    canApprove: boolean;
    canFeature: boolean;
    publicUrl: string | null;
    errors: Record<string, string>;
};

export default function ArticlesEdit() {
    const { article, statusOptions, canApprove, canFeature, publicUrl, errors } =
        usePage<PageProps>().props;

    return (
        <>
            <Head title={`Modifier — ${article.title}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Modifier l&apos;actualité
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {article.title}
                    </p>
                </div>

                {publicUrl ? (
                    <ContentShareLinks
                        title={article.title}
                        url={publicUrl}
                        description={article.excerpt}
                        variant="app"
                    />
                ) : null}

                <ArticleForm
                    article={article}
                    statusOptions={statusOptions}
                    canApprove={canApprove}
                    canFeature={canFeature}
                    submitUrl={update.url(article.slug)}
                    method="put"
                    submitLabel="Enregistrer"
                    cancelHref={index.url()}
                    errors={errors}
                />
            </div>
        </>
    );
}

ArticlesEdit.layout = {
    breadcrumbs: [
        { title: 'Actualités', href: index.url() },
        { title: 'Modifier', href: "#" },
    ],
};
