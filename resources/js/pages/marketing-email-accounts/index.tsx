import { Head, Link, usePage } from '@inertiajs/react';
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
    const { accounts, canCreate } = usePage<PageProps>().props;

    const columns = useMemo((): ResponsiveColumn<AccountRow>[] => {
        return [
            {
                id: 'name',
                header: 'Nom',
                cell: (account) => (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{account.name}</span>
                        {account.is_default ? <Badge>Défaut</Badge> : null}
                        {!account.is_active ? (
                            <Badge variant="outline">Inactif</Badge>
                        ) : null}
                    </div>
                ),
            },
            {
                id: 'from_address',
                header: 'Expéditeur',
                cell: (account) => account.from_address,
            },
            {
                id: 'quota',
                header: 'Quota / jour',
                cell: (account) =>
                    account.daily_send_limit === null
                        ? 'Illimité'
                        : `${account.sent_today} / ${account.daily_send_limit}`,
            },
            {
                id: 'driver',
                header: 'Driver',
                cell: (account) => account.driver_label,
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: (account) => (
                    <div className="flex flex-wrap gap-2">
                        {account.can_update ? (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={edit.url(account.uuid)}>
                                    <Pencil className="size-4" aria-hidden />
                                    Modifier
                                </Link>
                            </Button>
                        ) : null}
                        {account.can_delete ? (
                            <ConfirmDeleteDialog
                                title="Supprimer ce compte ?"
                                description={`Le compte « ${account.name} » sera définitivement supprimé.`}
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
    }, []);

    return (
        <>
            <Head title="Comptes e-mail" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
                            <Mail className="size-6" aria-hidden />
                            Comptes e-mail
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Multi-SMTP pour répartir les envois et respecter les quotas
                            fournisseurs.
                        </p>
                    </div>
                    {canCreate ? (
                        <Button asChild>
                            <Link href={create.url()}>
                                <Plus className="size-4" aria-hidden />
                                Nouveau compte
                            </Link>
                        </Button>
                    ) : null}
                </div>

                <BackofficeIndexPanel>
                    <ResponsiveDataTable
                        rows={accounts}
                        columns={columns}
                        getRowKey={(account) => account.uuid}
                        emptyMessage="Aucun compte e-mail configuré."
                        minWidth="720px"
                    />
                </BackofficeIndexPanel>
            </div>
        </>
    );
}

MarketingEmailAccountsIndex.layout = {
    breadcrumbs: [{ title: 'Comptes e-mail', href: index.url() }],
};
