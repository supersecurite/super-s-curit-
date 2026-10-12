import { Head, setLayoutProps, usePage } from '@inertiajs/react';
import WhatsAppAccountForm from '@/components/marketing-whatsapp-accounts/whatsapp-account-form';
import { useTrans } from '@/hooks/use-trans';
import { create, index, store } from '@/routes/marketing-whatsapp-accounts';

type DriverOption = { value: string; label: string };

type PageProps = {
    errors: Record<string, string>;
    drivers: DriverOption[];
};

export default function MarketingWhatsAppAccountsCreate() {
    const { t } = useTrans();
    const { errors, drivers } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            {
                title: t(
                    'marketing_whatsapp_accounts.title',
                    'Comptes WhatsApp',
                ),
                href: index.url(),
            },
            {
                title: t(
                    'marketing_whatsapp_accounts.create',
                    'Nouveau compte WhatsApp',
                ),
                href: create.url(),
            },
        ],
    });

    return (
        <>
            <Head
                title={t(
                    'marketing_whatsapp_accounts.create',
                    'Nouveau compte WhatsApp',
                )}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        {t(
                            'marketing_whatsapp_accounts.create',
                            'Nouveau compte WhatsApp',
                        )}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {t(
                            'marketing_whatsapp_accounts.create_subtitle',
                            'Ajoutez les identifiants Meta Cloud API pour ce numéro.',
                        )}
                    </p>
                </div>

                <WhatsAppAccountForm
                    submitUrl={store.url()}
                    submitLabel={t(
                        'marketing_whatsapp_accounts.submit_create',
                        'Créer le compte',
                    )}
                    cancelHref={index.url()}
                    errors={errors}
                    drivers={drivers}
                />
            </div>
        </>
    );
}
