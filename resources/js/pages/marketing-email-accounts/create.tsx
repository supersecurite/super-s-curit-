import { Head, usePage } from '@inertiajs/react';
import MarketingEmailAccountForm from '@/components/marketing-email-accounts/marketing-email-account-form';
import { create, index, store } from '@/routes/marketing-email-accounts';

type DriverOption = { value: string; label: string };

type PageProps = {
    errors: Record<string, string>;
    drivers: DriverOption[];
};

export default function MarketingEmailAccountsCreate() {
    const { errors, drivers } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Nouveau compte e-mail" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Nouveau compte e-mail
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Ajoutez une boîte SMTP (ou un driver log pour les tests).
                    </p>
                </div>

                <MarketingEmailAccountForm
                    submitUrl={store.url()}
                    submitLabel="Créer le compte"
                    cancelHref={index.url()}
                    errors={errors}
                    drivers={drivers}
                />
            </div>
        </>
    );
}

MarketingEmailAccountsCreate.layout = {
    breadcrumbs: [
        { title: 'Comptes e-mail', href: index.url() },
        { title: 'Nouveau', href: create.url() },
    ],
};
