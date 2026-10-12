import { Head, setLayoutProps, usePage } from '@inertiajs/react';
import MarketingContactForm from '@/components/marketing-clients/marketing-contact-form';
import { useTrans } from '@/hooks/use-trans';
import { create, index, store } from '@/routes/marketing-clients';

type ListOption = {
    uuid: string;
    name: string;
};

type PageProps = {
    errors: Record<string, string>;
    lists: ListOption[];
};

export default function MarketingClientsCreate() {
    const { t } = useTrans();
    const { errors, lists } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            {
                title: t('marketing_contacts.title', 'Contacts marketing'),
                href: index.url(),
            },
            {
                title: t('marketing_contacts.create', 'Nouveau contact'),
                href: create.url(),
            },
        ],
    });

    return (
        <>
            <Head title={t('marketing_contacts.create', 'Nouveau contact')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        {t('marketing_contacts.create', 'Nouveau contact')}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {t(
                            'marketing_contacts.create_subtitle',
                            'Ajoutez un contact à votre base marketing.',
                        )}
                    </p>
                </div>

                <MarketingContactForm
                    submitUrl={store.url()}
                    submitLabel={t(
                        'marketing_contacts.submit_add',
                        'Ajouter le contact',
                    )}
                    cancelHref={index.url()}
                    errors={errors}
                    lists={lists}
                />
            </div>
        </>
    );
}
