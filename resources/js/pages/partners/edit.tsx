import { Head, usePage } from '@inertiajs/react';
import PartnerForm from '@/components/partners/partner-form';
import { edit, index, update } from '@/routes/partners';

type PartnerFormData = {
    id: number;
    uuid: string;
    name: string;
    logo: string;
    logo_path: string;
    sort_order: number;
    is_published: boolean;
};

type PageProps = {
    partner: PartnerFormData;
    errors: Record<string, string>;
};

export default function PartnersEdit() {
    const { partner, errors } = usePage<PageProps>().props;

    return (
        <>
            <Head title={`Modifier ${partner.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Modifier le partenaire
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Modifiez les informations du partenaire.
                    </p>
                </div>

                <PartnerForm
                    submitUrl={update.url(partner.uuid)}
                    submitLabel="Enregistrer les modifications"
                    cancelHref={index.url()}
                    errors={errors}
                    partner={partner}
                    method="put"
                />
            </div>
        </>
    );
}

PartnersEdit.layout = {
    breadcrumbs: [
        { title: 'Partenaires', href: index.url() },
        { title: 'Modifier', href: '#' },
    ],
};
