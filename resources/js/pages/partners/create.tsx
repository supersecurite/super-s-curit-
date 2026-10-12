import { Head, setLayoutProps, usePage } from '@inertiajs/react';
import PartnerForm from '@/components/partners/partner-form';
import { useTrans } from '@/hooks/use-trans';
import { create, index, store } from '@/routes/partners';

type PageProps = {
    errors: Record<string, string>;
};

export default function PartnersCreate() {
    const { t } = useTrans();
    const { errors } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            { title: t('partners.title', 'Partenaires'), href: index.url() },
            {
                title: t('partners.create', 'Nouveau partenaire'),
                href: create.url(),
            },
        ],
    });

    return (
        <>
            <Head title={t('partners.create', 'Nouveau partenaire')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        {t('partners.create', 'Nouveau partenaire')}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {t(
                            'partners.create_subtitle',
                            "Ajoutez un nouveau partenaire pour l'afficher sur le défilement de la page d'accueil.",
                        )}
                    </p>
                </div>

                <PartnerForm
                    submitUrl={store.url()}
                    submitLabel={t(
                        'partners.submit_add',
                        'Ajouter le partenaire',
                    )}
                    cancelHref={index.url()}
                    errors={errors}
                />
            </div>
        </>
    );
}
