import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

function formatDate(value: string | null): string {
    if (!value) {
        return '—';
    }

    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value));
}

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    if (!user) {
        return null;
    }

    return (
        <>
            <Head title="Mon profil" />

            <h1 className="sr-only">Mon profil</h1>

            <div className="bg-white p-5 rounded-xl mx-auto flex min-h-[calc(100svh-12rem)] w-full max-w-6xl flex-col justify-center py-8">
            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Informations personnelles"
                    description="Mettez à jour vos coordonnées de contact"
                />

                <div className="app-panel space-y-3 p-4 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-muted-foreground">Rôle</span>
                        <Badge variant="secondary">{user.role_label}</Badge>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                            <p className="text-muted-foreground">Membre depuis</p>
                            <p className="font-medium">
                                {formatDate(user.created_at)}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">E-mail vérifié</p>
                            <p className="font-medium">
                                {user.email_verified_at
                                    ? formatDate(user.email_verified_at)
                                    : 'Non vérifié'}
                            </p>
                        </div>
                    </div>
                </div>

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nom complet</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Votre nom complet"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">E-mail</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="votre@email.com"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Téléphone</Label>

                                <Input
                                    id="phone"
                                    type="tel"
                                    className="mt-1 block w-full"
                                    defaultValue={user.phone ?? ''}
                                    name="phone"
                                    autoComplete="tel"
                                    placeholder="+224 ..."
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.phone}
                                />
                            </div>

                            {mustVerifyEmail &&
                                user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            Votre adresse e-mail n&apos;est pas
                                            vérifiée.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current!"
                                            >
                                                Cliquez ici pour renvoyer
                                                l&apos;e-mail de vérification.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                Un nouveau lien de vérification a
                                                été envoyé à votre adresse
                                                e-mail.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Enregistrer
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Mon profil',
            href: edit(),
        },
    ],
};
