import { Head, setLayoutProps, usePage } from '@inertiajs/react';
import JobOfferForm from '@/components/job-offers/job-offer-form';
import { useTrans } from '@/hooks/use-trans';
import { edit, index, update } from '@/routes/offres-emploi';

type OfferFormData = {
    id: number;
    uuid: string;
    title: string;
    title_en?: string | null;
    title_zh?: string | null;
    location: string;
    location_en?: string | null;
    location_zh?: string | null;
    contract_type: string;
    contract_type_en?: string | null;
    contract_type_zh?: string | null;
    description: string | null;
    description_en?: string | null;
    description_zh?: string | null;
    is_active: boolean;
};

type PageProps = {
    offer: OfferFormData;
    errors: Record<string, string>;
};

export default function JobOffersEdit() {
    const { t } = useTrans();
    const { offer, errors } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            {
                title: t('job_offers.title', "Offres d'emploi"),
                href: index.url(),
            },
            { title: offer.title, href: edit.url(offer.uuid) },
        ],
    });

    return (
        <>
            <Head
                title={`${t('job_offers.edit', "Modifier l'offre")} — ${offer.title}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        {t('job_offers.edit', "Modifier l'offre")}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {t(
                            'job_offers.edit_subtitle',
                            "Modifiez les informations de l'offre d'emploi.",
                        )}
                    </p>
                </div>

                <JobOfferForm
                    submitUrl={update.url(offer.uuid)}
                    submitLabel={t(
                        'job_offers.submit_save',
                        'Enregistrer les modifications',
                    )}
                    cancelHref={index.url()}
                    errors={errors}
                    offer={offer}
                    method="put"
                />
            </div>
        </>
    );
}
