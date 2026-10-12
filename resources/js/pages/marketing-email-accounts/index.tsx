import { Head, Link, setLayoutProps, usePage } from '@inertiajs/react';
import { Mail, Pencil, Plus } from 'lucide-react';
import { useMemo } from 'react';
import {
    BackofficeIndexPanel,
    ResponsiveDataTable,
    type ResponsiveColumn,
} from '@/components/backoffice/responsive-data-table';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTrans } from '@/hooks/use-trans';
import {
    create,
    destroy,
    edit,
    index,
} from '@/routes/marketing-email-accounts';

type AccountRow = {
    uuid: string;
    name: string;
    from_address: string;
    driver_label: string;
    daily_send_limit: number | null;
    sent_today: number;
    remaining_today: number | null;
    is_active: boolean;
    is_default: boolean;
    can_update: boolean;
    can_delete: boolean;
};

type PageProps = {
    accounts: AccountRow[];
    canCreate: boolean;
};

export default function MarketingEmailAccountsIndex() {
    const { t } = useTrans();
    const { accounts, canCreate } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            {
                title: t('marketing_email_accounts.title', 'Comptes e-mail'),
                href: index.url(),
            },
        ],
    });

    const columns = useMemo((): ResponsiveColumn<AccountRow>[] => {
        return [
            {
                id: 'name',
                header: t('common.name', 'Nom'),
                cell: (account) => (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{account.name}</span>
                        {account.is_default ? (
                            <Badge>
                                {t(
                                    'marketing_email_accounts.badge_default',
                                    'Défaut',
                                )}
                            </Badge>
                        ) : null}
                        {!account.is_active ? (
                            <Badge variant="outline">
                                {t('common.inactive', 'Inactif')}
                            </Badge>
                        ) : null}
                    </div>
                ),
            },
            {
                id: 'from_address',
                header: t(
                    'marketing_email_accounts.column_from',
                    'Expéditeur',
                ),
                cell: (account) => account.from_address,
            },
            {
                id: 'quota',
                header: t(
                    'marketing_email_accounts.column_quota',
                    'Quota / jour',
                ),
                cell: (account) =>
                    account.daily_send_limit === null
                        ? t(
                              'marketing_email_accounts.quota_unlimited',
                              'Illimité',
                          )
                        : `${account.sent_today} / ${account.daily_send_limit}`,
            },
            {
                id: 'driver',
                header: t(
                    'marketing_email_accounts.column_driver',
                    'Driver',
                ),
                cell: (account) => account.driver_label,
            },
            {
                id: 'actions',
                header: t('common.actions', 'Actions'),
                cell: (account) => (
                    <div className="flex flex-wrap gap-2">
                        {account.can_update ? (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={edit.url(account.uuid)}>
                                    <Pencil className="size-4" aria-hidden />
                                    {t('common.modify', 'Modifier')}
                                </Link>
                            </Button>
                        ) : null}
                        {account.can_delete ? (
                            <ConfirmDeleteDialog
                                title={t(
                                    'marketing_email_accounts.delete_confirm',
                                    'Supprimer ce compte ?',
                                )}
                                description={t(
                                    'marketing_email_accounts.delete_description',
                                    'Le compte « :name » sera définitivement supprimé.',
                                    { name: account.name },
                                )}
                                deleteUrl={destroy.url(account.uuid)}
                                triggerSize="sm"
                                triggerVariant="outline"
                                triggerClassName="text-destructive hover:text-destructive"
                            />
                        ) : null}
                    </div>
                ),
            },
        ];
    }, [t]);

    return (
        <>
            <Head
                title={t(
                    'marketing_email_accounts.title',
                    'Comptes e-mail',
                )}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
                            <Mail className="size-6" aria-hidden />
                            {t(
                                'marketing_email_accounts.title',
                                'Comptes e-mail',
                            )}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {t(
                                'marketing_email_accounts.subtitle',
                                'Multi-SMTP pour répartir les envois et respecter les quotas fournisseurs.',
                            )}
                        </p>
                    </div>
                    {canCreate ? (
                        <Button asChild>
                            <Link href={create.url()}>
                                <Plus className="size-4" aria-hidden />
                                {t(
                                    'marketing_email_accounts.create_button',
                                    'Nouveau compte',
                                )}
                            </Link>
                        </Button>
                    ) : null}
                </div>

                <BackofficeIndexPanel>
                    <ResponsiveDataTable
                        rows={accounts}
                        columns={columns}
                        getRowKey={(account) => account.uuid}
                        emptyMessage={t(
                            'marketing_email_accounts.empty_configured',
                            'Aucun compte e-mail configuré.',
                        )}
                        minWidth="720px"
                    />
                </BackofficeIndexPanel>
            </div>
        </>
    );
}
