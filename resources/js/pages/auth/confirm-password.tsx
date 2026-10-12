import { Form, Head, setLayoutProps } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTrans } from '@/hooks/use-trans';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    const { t } = useTrans();

    setLayoutProps({
        title: t('auth.confirm_password_title', 'Confirmer le mot de passe'),
        description: t(
            'auth.confirm_password_description',
            'Zone sécurisée. Veuillez confirmer votre mot de passe pour continuer.',
        ),
    });

    return (
        <>
            <Head title={t('auth.confirm_password_title', 'Confirmer le mot de passe')} />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">{t('auth.password', 'Mot de passe')}</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder={t('auth.password_placeholder', 'Mot de passe')}
                                autoComplete="current-password"
                                autoFocus
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                            <Button
                                className="w-full"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <Spinner />}
                                {t('auth.confirm_password_submit', 'Confirmer')}
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Confirmer le mot de passe',
    description:
        'Zone sécurisée. Veuillez confirmer votre mot de passe pour continuer.',
};
