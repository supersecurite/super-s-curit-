import { Head, setLayoutProps, usePage } from '@inertiajs/react';
import UserForm, {
    type RoleOption,
    type UserFormData,
} from '@/components/users/user-form';
import { edit, index, update } from '@/routes/users';

type PageProps = {
    user: UserFormData & { id: number; uuid: string; role_label: string };
    roles: RoleOption[];
};

export default function UsersEdit() {
    const { user, roles } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Utilisateurs',
                href: index.url(),
            },
            {
                title: user.name,
                href: edit.url(user.uuid),
            },
        ],
    });

    return (
        <>
            <Head title={`Modifier ${user.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Modifier {user.name}
                    </h1>
                    <p className="text-muted-foreground mt-1 font-mono text-xs">
                        {user.uuid}
                    </p>
                </div>

                <UserForm
                    roles={roles}
                    user={user}
                    formDefinition={update.form(user.uuid)}
                    submitLabel="Enregistrer"
                    cancelHref={index.url()}
                />
            </div>
        </>
    );
}
