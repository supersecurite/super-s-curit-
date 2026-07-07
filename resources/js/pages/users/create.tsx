import { Head, usePage } from '@inertiajs/react';
import UserForm, {
    type PermissionGroup,
    type RoleOption,
} from '@/components/users/user-form';
import { create, index, store } from '@/routes/users';

type PageProps = {
    roles: RoleOption[];
    permissionGroups: PermissionGroup[];
};

export default function UsersCreate() {
    const { roles, permissionGroups } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Nouvel utilisateur" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Nouvel utilisateur
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Créez un compte et attribuez un rôle d&apos;accès.
                    </p>
                </div>

                <UserForm
                    roles={roles}
                    permissionGroups={permissionGroups}
                    formDefinition={store.form()}
                    submitLabel="Créer l'utilisateur"
                    cancelHref={index.url()}
                />
            </div>
        </>
    );
}

UsersCreate.layout = {
    breadcrumbs: [
        {
            title: 'Utilisateurs',
            href: index.url(),
        },
        {
            title: 'Nouveau',
            href: create.url(),
        },
    ],
};
