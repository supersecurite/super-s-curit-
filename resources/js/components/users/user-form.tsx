import { Form, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { RouteFormDefinition } from '@/wayfinder';

export type RoleOption = {
    value: string;
    label: string;
};

export type UserFormData = {
    name: string;
    email: string;
    phone: string | null;
    role: string;
};

type UserFormProps = {
    roles: RoleOption[];
    user?: UserFormData;
    formDefinition: RouteFormDefinition<'post'>;
    submitLabel: string;
    cancelHref: string;
};

export default function UserForm({
    roles,
    user,
    formDefinition,
    submitLabel,
    cancelHref,
}: UserFormProps) {
    return (
        <Form
            {...formDefinition}
            className="max-w-xl space-y-6"
            options={{ preserveScroll: true }}
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-2">
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

                    <div className="grid gap-2">
                        <Label htmlFor="role">Rôle</Label>
                        <select
                            id="role"
                            name="role"
                            defaultValue={user?.role ?? 'user'}
                            className={cn(
                                'border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                            )}
                            required
                        >
                            {roles.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.role} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">
                            Mot de passe{' '}
                            {user && (
                                <span className="text-muted-foreground font-normal">
                                    (laisser vide pour ne pas changer)
                                </span>
                            )}
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

                    <div className="flex flex-wrap items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Enregistrement...' : submitLabel}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={cancelHref}>Annuler</Link>
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
