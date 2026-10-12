import { Form, Head, Link, setLayoutProps, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InternationalPhoneInput from '@/components/ui/international-phone-input';
import { Label } from '@/components/ui/label';
import { useTrans } from '@/hooks/use-trans';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

function formatDate(value: string | null, locale: string): string {
    if (!value) {
        return '—';
    }

    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'fr-FR', {
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
    const { t, locale } = useTrans();
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    setLayoutProps({
        breadcrumbs: [
            {
                title: t('settings.nav_settings', 'Paramètres'),
                href: edit(),
            },
            {
                title: t('settings.nav_profile', 'Profil'),
                href: edit(),
            },
        ],
    });

    if (!user) {
        return null;
    }

    return (
        <>
            <Head title={t('settings.profile_title', 'Mon profil')} />

            <h1 className="sr-only">{t('settings.profile_title', 'Mon profil')}</h1>

            <div className="bg-white p-5 rounded-xl mx-auto flex min-h-[calc(100svh-12rem)] w-full max-w-6xl flex-col justify-center py-8">
            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={t('settings.profile_heading', 'Informations personnelles')}
                    description={t(
                        'settings.profile_description',
                        'Mettez à jour vos coordonnées de contact',
                    )}
                />

                <div className="app-panel space-y-3 p-4 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-muted-foreground">{t('common.role', 'Rôle')}</span>
                        <Badge variant="secondary">{user.role_label}</Badge>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                            <p className="text-muted-foreground">
                                {t('settings.member_since', 'Membre depuis')}
                            </p>
                            <p className="font-medium">
                                {formatDate(user.created_at, locale)}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">
                                {t('settings.email_verified', 'E-mail vérifié')}
                            </p>
                            <p className="font-medium">
                                {user.email_verified_at
                                    ? formatDate(user.email_verified_at, locale)
                                    : t('settings.not_verified', 'Non vérifié')}
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
                                <Label htmlFor="name">
                                    {t('settings.full_name', 'Nom complet')}
                                </Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder={t(
                                        'settings.full_name_placeholder',
                                        'Votre nom complet',
                                    )}
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    {t('common.email_label', 'E-mail')}
                                </Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder={t(
                                        'auth.email_placeholder',
                                        'votre@email.com',
                                    )}
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">
                                    {t('common.phone', 'Téléphone')}
                                </Label>

                                <InternationalPhoneInput
                                    id="phone"
                                    name="phone"
                                    className="mt-1"
                                    defaultValue={user.phone ?? ''}
                                    autoComplete="tel"
                                    aria-invalid={Boolean(errors.phone)}
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
                                            {t(
                                                'settings.email_unverified_hint',
                                                "Votre adresse e-mail n'est pas vérifiée.",
                                            )}{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current!"
                                            >
                                                {t(
                                                    'settings.resend_verification',
                                                    "Cliquez ici pour renvoyer l'e-mail de vérification.",
                                                )}
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                {t(
                                                    'settings.verification_sent_profile',
                                                    'Un nouveau lien de vérification a été envoyé à votre adresse e-mail.',
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    {t('settings.save_profile', 'Enregistrer')}
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
