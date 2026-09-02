import { Head, usePage } from '@inertiajs/react';
import MarketingEmailAccountForm from '@/components/marketing-email-accounts/marketing-email-account-form';
import { edit, index, update } from '@/routes/marketing-email-accounts';

type DriverOption = { value: string; label: string };

type AccountData = {
    uuid: string;
    name: string;
    from_address: string;
    from_name: string | null;
    driver: string;
    smtp_host: string | null;
    smtp_port: number | null;
    smtp_encryption: string | null;
    smtp_username: string | null;
    daily_send_limit: number | null;
    is_active: boolean;
    is_default: boolean;
    has_smtp_password: boolean;
    sent_today: number;
    remaining_today: number | null;
};

type PageProps = {
    account: AccountData;
    errors: Record<string, string>;
    drivers: DriverOption[];
};

export default function MarketingEmailAccountsEdit() {
    const { account, errors, drivers } = usePage<PageProps>().props;

    return (
        <>
            <Head title={`Modifier — ${account.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Modifier le compte e-mail
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">{account.name}</p>
                </div>

                <MarketingEmailAccountForm
                    submitUrl={update.url(account.uuid)}
                    submitLabel="Enregistrer"
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

MarketingEmailAccountsEdit.layout = {
    breadcrumbs: [
        { title: 'Comptes e-mail', href: index.url() },
        { title: 'Modifier', href: edit.url('') },
    ],
};
