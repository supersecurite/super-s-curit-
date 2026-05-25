import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { create, destroy, edit, index } from '@/routes/users';

type UserRow = {
    id: number;
    uuid: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    role_label: string;
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
};

function roleBadgeVariant(role: string): 'default' | 'secondary' | 'outline' {
    if (role === 'super_admin') {
        return 'default';
    }

    if (role === 'admin') {
        return 'secondary';
    }

    return 'outline';
}

export default function UsersIndex() {
    const { users } = usePage<PageProps>().props;

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

    return (
        <>
            <Head title="Utilisateurs" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                            <Users className="size-6" aria-hidden />
                            Utilisateurs
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Gérez les comptes et les rôles d&apos;accès.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <Plus className="size-4" aria-hidden />
                            Nouvel utilisateur
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead className="bg-muted/50 border-b text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Nom</th>
                                    <th className="px-4 py-3 font-medium">E-mail</th>
                                    <th className="px-4 py-3 font-medium">Téléphone</th>
                                    <th className="px-4 py-3 font-medium">Rôle</th>
                                    <th className="px-4 py-3 font-medium">UUID</th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-muted-foreground px-4 py-8 text-center"
                                        >
                                            Aucun utilisateur pour le moment.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {user.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {user.email}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {user.phone ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={roleBadgeVariant(
                                                        user.role,
                                                    )}
                                                >
                                                    {user.role_label}
                                                </Badge>
                                            </td>
                                            <td className="text-muted-foreground max-w-[8rem] truncate px-4 py-3 font-mono text-xs">
                                                {user.uuid}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={edit.url(
                                                                user.uuid,
                                                            )}
                                                            aria-label={`Modifier ${user.name}`}
                                                        >
                                                            <Pencil
                                                                className="size-4"
                                                                aria-hidden
                                                            />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() =>
                                                            handleDelete(user)
                                                        }
                                                        aria-label={`Supprimer ${user.name}`}
                                                    >
                                                        <Trash2
                                                            className="size-4"
                                                            aria-hidden
                                                        />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {users.last_page > 1 && (
                    <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-4 text-sm">
                        <span>
                            Page {users.current_page} sur {users.last_page} (
                            {users.total} utilisateurs)
                        </span>
                        <div className="flex gap-2">
                            {users.current_page > 1 && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link
                                        href={index.url({
                                            query: {
                                                page: users.current_page - 1,
                                            },
                                        })}
                                    >
                                        Précédent
                                    </Link>
                                </Button>
                            )}
                            {users.current_page < users.last_page && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link
                                        href={index.url({
                                            query: {
                                                page: users.current_page + 1,
                                            },
                                        })}
                                    >
                                        Suivant
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Utilisateurs',
            href: index.url(),
        },
    ],
};
