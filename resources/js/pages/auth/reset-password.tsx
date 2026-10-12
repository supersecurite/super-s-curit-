import { Form, Head, setLayoutProps } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTrans } from '@/hooks/use-trans';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
    welcome?: boolean;
};

export default function ResetPassword({
    token,
    email,
    passwordRules,
    welcome = false,
}: Props) {
    const { t } = useTrans();

    const title = welcome
        ? t('auth.reset_welcome_title', 'Choisir votre mot de passe')
        : t('auth.reset_title', 'Réinitialiser le mot de passe');
    const description = welcome
        ? t(
              'auth.reset_welcome_description',
              'Bienvenue ! Définissez le mot de passe de votre compte.',
          )
        : t('auth.reset_description', 'Saisissez votre nouveau mot de passe ci-dessous');

    setLayoutProps({ title, description });

    return (
        <>
            <Head title={title} />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">{t('auth.email', 'E-mail')}</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                className="mt-1 block w-full"
                                readOnly
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">{t('auth.password', 'Mot de passe')}</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                autoFocus
                                placeholder={t('auth.password_placeholder', 'Mot de passe')}
                                passwordrules={passwordRules}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                {t('auth.password_confirm', 'Confirmer le mot de passe')}
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                placeholder={t(
                                    'auth.password_confirm_placeholder',
                                    'Confirmer le mot de passe',
                                )}
                                passwordrules={passwordRules}
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-full"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <Spinner />}
                            {welcome
                                ? t('auth.reset_welcome_submit', 'Enregistrer mon mot de passe')
                                : t('auth.reset_submit', 'Réinitialiser')}
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Réinitialiser le mot de passe',
    description: 'Saisissez votre nouveau mot de passe ci-dessous',
};
