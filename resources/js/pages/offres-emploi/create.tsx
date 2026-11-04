import { Head, setLayoutProps, usePage } from '@inertiajs/react';
import JobOfferForm from '@/components/job-offers/job-offer-form';
import { useTrans } from '@/hooks/use-trans';
import { create, index, store } from '@/routes/offres-emploi';

type PageProps = {
    errors: Record<string, string>;
};

export default function JobOffersCreate() {
    const { t } = useTrans();
    const { errors } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            { title: t('job_offers.title', "Offres d'emploi"), href: index.url() },
            {
                title: t('job_offers.create', 'Nouvelle offre'),
                href: create.url(),
            },
        ],
    });

    return (
        <>
            <Head title={t('job_offers.create', 'Nouvelle offre')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        {t('job_offers.create', 'Nouvelle offre')}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {t(
                            'job_offers.create_subtitle',
                            'Publiez une offre visible sur la page Carrières.',
                        )}
                    </p>
                </div>

                <JobOfferForm
                    submitUrl={store.url()}
                    submitLabel={t('job_offers.submit_add', "Créer l'offre")}
                    cancelHref={index.url()}
                    errors={errors}
                />
            </div>
        </>
    );
}
