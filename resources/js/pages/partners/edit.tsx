import { Head, setLayoutProps, usePage } from '@inertiajs/react';
import PartnerForm from '@/components/partners/partner-form';
import { useTrans } from '@/hooks/use-trans';
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
    const { t } = useTrans();
    const { partner, errors } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            {
                title: t('partners.title', 'Partenaires'),
                href: index.url(),
            },
            { title: partner.name, href: edit.url(partner.uuid) },
        ],
    });

    return (
        <>
            <Head
                title={`${t('partners.edit', 'Modifier le partenaire')} — ${partner.name}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        {t('partners.edit', 'Modifier le partenaire')}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {t(
                            'partners.edit_subtitle',
                            'Modifiez les informations du partenaire.',
                        )}
                    </p>
                </div>

                <PartnerForm
                    submitUrl={update.url(partner.uuid)}
                    submitLabel={t(
                        'partners.submit_save',
                        'Enregistrer les modifications',
                    )}
                    cancelHref={index.url()}
                    errors={errors}
                    partner={partner}
                    method="put"
                />
            </div>
        </>
    );
}
