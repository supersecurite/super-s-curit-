import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import { useMemo } from 'react';
import {
    BackofficeIndexPanel,
    IndexTablePagination,
    ResponsiveDataTable,
    type ResponsiveColumn,
} from '@/components/backoffice/responsive-data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIndexTableSort, type TableSortState } from '@/hooks/use-index-table-sort';
import { create, destroy, edit, index } from '@/routes/users';

type UserRow = {
    id: number;
    uuid: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    role_label: string;
    can_update: boolean;
    can_delete: boolean;
};

type PaginatedUsers = {
    data: UserRow[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type PageProps = {
    users: PaginatedUsers;
    filters: TableSortState;
    canCreate: boolean;
};

function roleBadgeVariant(role: string): 'default' | 'secondary' | 'outline' {
    if (role === 'super_admin') {
        return 'default';
    }

    if (role === 'admin' || role === 'commercial') {
        return 'secondary';
    }

    return 'outline';
}

export default function UsersIndex() {
    const { users, filters, canCreate } = usePage<PageProps>().props;

    const applyFilters = (updates: Partial<TableSortState & { page?: number }>) => {
        const next = { ...filters, ...updates };
        Object.keys(next).forEach((key) => {
            const value = next[key as keyof typeof next];
            if (value === undefined || value === '') {
                delete next[key as keyof typeof next];
            }
        });
        router.get(index.url(), next, { preserveState: true, replace: true });
    };

    const handleSort = useIndexTableSort(filters, applyFilters);

    const handleDelete = (user: UserRow) => {
        if (
            !window.confirm(
                `Supprimer l'utilisateur « ${user.name} » ? Cette action est irréversible.`,
            )
        ) {
            return;
        }

        router.delete(destroy.url(user.uuid));
    };

    const columns = useMemo((): ResponsiveColumn<UserRow>[] => {
        const renderActions = (user: UserRow) => (
            <>
                {user.can_update ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={edit.url(user.uuid)}>
                            <Pencil className="size-4" aria-hidden />
                            Modifier
                        </Link>
                    </Button>
                ) : null}
                {user.can_delete ? (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(user)}
                    >
                        <Trash2 className="size-4" aria-hidden />
                        Supprimer
                    </Button>
                ) : null}
            </>
        );

        return [
            {
                id: 'name',
                header: 'Nom',
                sortKey: 'name',
                sortable: true,
                mobileRole: 'title',
                cell: (user) => user.name,
            },
            {
                id: 'email',
                header: 'E-mail',
                sortKey: 'email',
                sortable: true,
                mobileRole: 'meta',
                cell: (user) => user.email,
            },
            {
                id: 'phone',
                header: 'Téléphone',
                sortKey: 'phone',
                sortable: true,
                mobileRole: 'meta',
                className: 'text-muted-foreground',
                cell: (user) => user.phone ?? '—',
            },
            {
                id: 'role',
                header: 'Rôle',
                sortKey: 'role',
                sortable: true,
                mobileRole: 'meta',
                cell: (user) => (
                    <Badge variant={roleBadgeVariant(user.role)}>
                        {user.role_label}
                    </Badge>
                ),
            },
            {
                id: 'uuid',
                header: 'UUID',
                mobileRole: 'hidden',
                className: 'text-muted-foreground max-w-[8rem] truncate font-mono text-xs',
                cell: (user) => user.uuid,
            },
            {
                id: 'actions',
                header: 'Actions',
                mobileRole: 'actions',
                headerClassName: 'text-right',
                className: 'text-right',
                cell: renderActions,
            },
        ];
    }, []);

    return (
        <>
            <Head title="Utilisateurs" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
                            <Users className="size-6" aria-hidden />
                            Utilisateurs
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Gérez les comptes et les rôles d&apos;accès.
                        </p>
                    </div>
                    {canCreate ? (
                        <Button asChild>
                            <Link href={create.url()}>
                                <Plus className="size-4" aria-hidden />
                                Nouvel utilisateur
                            </Link>
                        </Button>
                    ) : null}
                </div>

                <BackofficeIndexPanel>
                    <ResponsiveDataTable
                        rows={users.data}
                        columns={columns}
                        getRowKey={(user) => String(user.id)}
                        emptyMessage="Aucun utilisateur pour le moment."
                        minWidth="720px"
                        sort={filters}
                        onSort={handleSort}
                    />
                </BackofficeIndexPanel>

                <IndexTablePagination
                    paginated={users}
                    itemLabel="utilisateur(s)"
                    buildPageUrl={(page) => index.url({ query: { ...filters, page } })}
                />
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [{ title: 'Utilisateurs', href: index.url() }],
};
