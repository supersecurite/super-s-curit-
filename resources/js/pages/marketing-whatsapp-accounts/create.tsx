import { Head, usePage } from '@inertiajs/react';
import WhatsAppAccountForm from '@/components/marketing-whatsapp-accounts/whatsapp-account-form';
import { create, index, store } from '@/routes/marketing-whatsapp-accounts';

type DriverOption = { value: string; label: string };

type PageProps = {
    errors: Record<string, string>;
    drivers: DriverOption[];
};

export default function MarketingWhatsAppAccountsCreate() {
    const { errors, drivers } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Nouveau compte WhatsApp" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Nouveau compte WhatsApp
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Ajoutez les identifiants Meta Cloud API pour ce numéro.
                    </p>
                </div>

                <WhatsAppAccountForm
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

MarketingWhatsAppAccountsCreate.layout = {
    breadcrumbs: [
        { title: 'Comptes WhatsApp', href: index.url() },
        { title: 'Nouveau', href: create.url() },
    ],
};
