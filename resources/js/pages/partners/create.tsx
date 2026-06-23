import { Head, usePage } from '@inertiajs/react';
import PartnerForm from '@/components/partners/partner-form';
import { create, index, store } from '@/routes/partners';

type PageProps = {
    errors: Record<string, string>;
};

export default function PartnersCreate() {
    const { errors } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Nouveau partenaire" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Nouveau partenaire
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Ajoutez un nouveau partenaire pour l’afficher sur le défilement de la page d’accueil.
                    </p>
                </div>

                <PartnerForm
                    submitUrl={store.url()}
                    submitLabel="Ajouter le partenaire"
                    cancelHref={index.url()}
                    errors={errors}
                />
            </div>
        </>
    );
}

PartnersCreate.layout = {
    breadcrumbs: [
        { title: 'Partenaires', href: index.url() },
        { title: 'Nouveau', href: create.url() },
    ],
};
