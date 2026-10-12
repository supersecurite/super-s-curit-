import { Head, setLayoutProps, usePage } from '@inertiajs/react';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import WhatsAppAccountForm from '@/components/marketing-whatsapp-accounts/whatsapp-account-form';
import { useTrans } from '@/hooks/use-trans';
import { destroy, edit, index, update } from '@/routes/marketing-whatsapp-accounts';

type DriverOption = { value: string; label: string };

type AccountData = {
    uuid: string;
    name: string;
    phone_number_id: string;
    business_account_id: string | null;
    verify_token: string;
    driver: string;
    is_active: boolean;
    is_default: boolean;
    has_access_token: boolean;
    has_app_secret: boolean;
    webhook_url: string;
};

type PageProps = {
    account: AccountData;
    drivers: DriverOption[];
    errors: Record<string, string>;
    canDelete: boolean;
};

export default function MarketingWhatsAppAccountsEdit() {
    const { t } = useTrans();
    const { account, drivers, errors, canDelete } = usePage<PageProps>().props;

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
                title: account.name,
                href: edit.url(account.uuid),
            },
        ],
    });

    return (
        <>
            <Head
                title={`${t('marketing_whatsapp_accounts.edit', 'Modifier le compte')} — ${account.name}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="font-heading text-2xl font-semibold tracking-tight">
                            {t(
                                'marketing_whatsapp_accounts.edit_heading',
                                'Modifier le compte',
                            )}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">{account.name}</p>
                    </div>
                    {canDelete ? (
                        <ConfirmDeleteDialog
                            title={t(
                                'marketing_whatsapp_accounts.delete_confirm',
                                'Supprimer ce compte ?',
                            )}
                            description={t(
                                'marketing_whatsapp_accounts.delete_description',
                                'Le compte « :name » sera définitivement supprimé.',
                                { name: account.name },
                            )}
                            deleteUrl={destroy.url(account.uuid)}
                            triggerVariant="outline"
                            triggerClassName="text-destructive hover:text-destructive"
                        />
                    ) : null}
                </div>

                <WhatsAppAccountForm
                    submitUrl={update.url(account.uuid)}
                    submitLabel={t('common.save', 'Enregistrer')}
                    cancelHref={index.url()}
                    errors={errors}
                    drivers={drivers}
                    account={account}
                    method="put"
                />
            </div>
        </>
    );
}
