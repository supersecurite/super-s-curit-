import { Head, usePage } from '@inertiajs/react';
import SecurityTipForm from '@/components/conseils/security-tip-form';
import { create, index, store } from '@/routes/conseils';

type PageProps = {
    errors: Record<string, string>;
};

export default function ConseilsCreate() {
    const { errors } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Nouveau conseil" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Nouveau conseil
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Rédigez un conseil de sécurité : il sera
                        automatiquement soumis pour validation.
                    </p>
                </div>

                <SecurityTipForm
                    submitUrl={store.url()}
                    submitLabel="Créer le conseil"
                    cancelHref={index.url()}
                    errors={errors}
                />
            </div>
        </>
    );
}

ConseilsCreate.layout = {
    breadcrumbs: [
        { title: 'Conseils', href: index.url() },
        { title: 'Nouveau', href: create.url() },
    ],
};
