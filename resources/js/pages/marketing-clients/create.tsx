import { Head, usePage } from '@inertiajs/react';
import MarketingContactForm from '@/components/marketing-clients/marketing-contact-form';
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
    const { errors, lists } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Nouveau contact" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Nouveau contact
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Ajoutez un contact à votre base marketing.
                    </p>
                </div>

                <MarketingContactForm
                    submitUrl={store.url()}
                    submitLabel="Ajouter le contact"
                    cancelHref={index.url()}
                    errors={errors}
                    lists={lists}
                />
            </div>
        </>
    );
}

MarketingClientsCreate.layout = {
    breadcrumbs: [
        { title: 'Contacts marketing', href: index.url() },
        { title: 'Nouveau contact', href: create.url() },
    ],
};
