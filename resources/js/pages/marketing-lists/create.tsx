import { Head, usePage } from '@inertiajs/react';
import MarketingListForm from '@/components/marketing-lists/marketing-list-form';
import { create, index, store } from '@/routes/marketing-lists';

type PageProps = {
    errors: Record<string, string>;
};

export default function MarketingListsCreate() {
    const { errors } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Nouveau groupe" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Nouveau groupe
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Créez une audience pour vos campagnes marketing.
                    </p>
                </div>

                <MarketingListForm
                    submitUrl={store.url()}
                    submitLabel="Créer le groupe"
                    cancelHref={index.url()}
                    errors={errors}
                />
            </div>
        </>
    );
}

MarketingListsCreate.layout = {
    breadcrumbs: [
        { title: 'Groupes', href: index.url() },
        { title: 'Nouveau groupe', href: create.url() },
    ],
};
