import { Form, Link } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import UserPermissionsPanel, {
    type PermissionGroup,
} from '@/components/users/user-permissions-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { RouteFormDefinition } from '@/wayfinder';

export type { PermissionGroup, PermissionOption } from '@/components/users/user-permissions-panel';

export type RoleOption = {
    value: string;
    label: string;
};

export type UserFormData = {
    name: string;
    email: string;
    phone: string | null;
    role: string;
    permissions?: string[];
    has_all_permissions?: boolean;
};

export type UserFormTab = 'profile' | 'permissions' | 'security';

type UserFormProps = {
    roles: RoleOption[];
    permissionGroups: PermissionGroup[];
    user?: UserFormData;
    formDefinition: RouteFormDefinition<'post'>;
    submitLabel: string;
    cancelHref: string;
    formId?: string;
    activeTab?: UserFormTab;
    showActions?: boolean;
};

function tabPanelClass(
    activeTab: UserFormTab | undefined,
    tab: UserFormTab,
): string {
    if (activeTab === undefined) {
        return 'space-y-6';
    }

    return cn('space-y-6', activeTab === tab ? undefined : 'hidden');
}

export default function UserForm({
    roles,
    permissionGroups,
    user,
    formDefinition,
    submitLabel,
    cancelHref,
    formId,
    activeTab,
    showActions = true,
}: UserFormProps) {
    const [selectedRole, setSelectedRole] = useState(user?.role ?? 'user');

    const showPermissions =
        selectedRole !== 'super_admin' && permissionGroups.length > 0;

    return (
        <Form
            id={formId}
            {...formDefinition}
            className="space-y-6"
            options={{ preserveScroll: true }}
        >
            {({ processing, errors }) => (
                <>
                    <div className={tabPanelClass(activeTab, 'profile')}>
                        <div className="app-panel space-y-6 p-6">
                            <div>
                                <h2 className="font-heading text-lg font-semibold">
                                    Informations du compte
                                </h2>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    Identité, coordonnées et rôle d&apos;accès.
                                </p>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="grid gap-2 sm:col-span-2">
                                    <Label htmlFor="name">Nom complet</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={user?.name ?? ''}
                                        required
                                        autoComplete="name"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        defaultValue={user?.email ?? ''}
                                        required
                                        autoComplete="email"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        defaultValue={user?.phone ?? ''}
                                        autoComplete="tel"
                                        placeholder="+224 ..."
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="grid gap-2 sm:col-span-2">
                                    <Label htmlFor="role">Rôle</Label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={selectedRole}
                                        onChange={(event) =>
                                            setSelectedRole(event.target.value)
                                        }
                                        className={cn(
                                            'border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                                        )}
                                        required
                                    >
                                        {roles.map((role) => (
                                            <option
                                                key={role.value}
                                                value={role.value}
                                            >
                                                {role.label}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.role} />
                                </div>
                            </div>

                            {selectedRole === 'super_admin' ? (
                                <p className="text-muted-foreground rounded-lg border border-dashed px-4 py-3 text-sm">
                                    Le super administrateur dispose
                                    automatiquement de toutes les permissions
                                    backoffice.
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div className={tabPanelClass(activeTab, 'permissions')}>
                        {showPermissions ? (
                            <UserPermissionsPanel
                                groups={permissionGroups}
                                initialPermissions={user?.permissions}
                                error={errors.permissions}
                            />
                        ) : (
                            <div className="app-panel p-6">
                                <p className="text-muted-foreground text-sm">
                                    {selectedRole === 'super_admin'
                                        ? 'Les super administrateurs disposent de toutes les permissions.'
                                        : 'Aucune permission configurable pour ce rôle.'}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className={tabPanelClass(activeTab, 'security')}>
                        <div className="app-panel space-y-6 p-6">
                            <div>
                                <h2 className="font-heading text-lg font-semibold">
                                    Sécurité du compte
                                </h2>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    {user
                                        ? 'Définissez un nouveau mot de passe uniquement si nécessaire.'
                                        : 'Choisissez un mot de passe initial pour ce compte.'}
                                </p>
                            </div>

                            <div className="grid max-w-xl gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="password">
                                        Mot de passe{' '}
                                        {user ? (
                                            <span className="text-muted-foreground font-normal">
                                                (laisser vide pour ne pas
                                                changer)
                                            </span>
                                        ) : null}
                                    </Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required={!user}
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirmer le mot de passe
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        autoComplete="new-password"
                                        required={!user}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {showActions ? (
                        <div className="flex flex-wrap items-center gap-3">
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Enregistrement...'
                                    : submitLabel}
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={cancelHref}>Annuler</Link>
                            </Button>
                        </div>
                    ) : null}
                </>
            )}
        </Form>
    );
}
