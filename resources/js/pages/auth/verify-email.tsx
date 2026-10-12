import { Form, Head, setLayoutProps } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTrans } from '@/hooks/use-trans';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    const { t } = useTrans();

    setLayoutProps({
        title: t('auth.verify_email_page_title', "Vérification de l'e-mail"),
        description: t(
            'auth.verify_email_description',
            'Veuillez vérifier votre adresse e-mail en cliquant sur le lien que nous venons de vous envoyer.',
        ),
    });

    return (
        <>
            <Head title={t('auth.verify_email_page_title', "Vérification de l'e-mail")} />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {t(
                        'auth.verify_email_link_sent',
                        "Un nouveau lien de vérification a été envoyé à l'adresse e-mail fournie lors de votre inscription.",
                    )}
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}
                            {t('auth.verify_email_resend', "Renvoyer l'e-mail de vérification")}
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm"
                        >
                            {t('auth.verify_email_logout', 'Se déconnecter')}
                        </TextLink>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: "Vérification de l'e-mail",
    description:
        'Veuillez vérifier votre adresse e-mail en cliquant sur le lien que nous venons de vous envoyer.',
};
