import { Head, setLayoutProps, usePage } from '@inertiajs/react';
import MarketingEmailAccountForm from '@/components/marketing-email-accounts/marketing-email-account-form';
import { useTrans } from '@/hooks/use-trans';
import { create, index, store } from '@/routes/marketing-email-accounts';

type DriverOption = { value: string; label: string };

type PageProps = {
    errors: Record<string, string>;
    drivers: DriverOption[];
};

export default function MarketingEmailAccountsCreate() {
    const { t } = useTrans();
    const { errors, drivers } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            {
                title: t('marketing_email_accounts.title', 'Comptes e-mail'),
                href: index.url(),
            },
            {
                title: t(
                    'marketing_email_accounts.create',
                    'Nouveau compte e-mail',
                ),
                href: create.url(),
            },
        ],
    });

    return (
        <>
            <Head
                title={t(
                    'marketing_email_accounts.create',
                    'Nouveau compte e-mail',
                )}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        {t(
                            'marketing_email_accounts.create',
                            'Nouveau compte e-mail',
                        )}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {t(
                            'marketing_email_accounts.create_subtitle',
                            'Ajoutez une boîte SMTP (ou un driver log pour les tests).',
                        )}
                    </p>
                </div>

                <MarketingEmailAccountForm
                    submitUrl={store.url()}
                    submitLabel={t(
                        'marketing_email_accounts.submit_create',
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
