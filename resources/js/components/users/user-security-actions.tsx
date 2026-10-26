import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { router } from '@inertiajs/react';
import { KeyRound, Mail } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { sendPasswordReset, sendWelcome } from '@/routes/users';

type UserSecurityActionsProps = {
    userUuid: string;
};

export default function UserSecurityActions({
    userUuid,
}: UserSecurityActionsProps) {
    const { t: uiText } = useUiTranslations();

    const [sendingWelcome, setSendingWelcome] = useState(false);
    const [sendingReset, setSendingReset] = useState(false);

    const postAction = (url: string, setLoading: (value: boolean) => void) => {
        setLoading(true);

        router.post(
            url,
            {},
            {
                preserveScroll: true,
                onFinish: () => setLoading(false),
            },
        );
    };

    return (
        <div className="grid max-w-xl gap-4">
            <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
                <div className="flex flex-wrap items-start gap-3">
                    <div className="rounded-md bg-primary/10 p-2 text-primary">
                        <Mail className="size-4" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-sm font-medium">
                            {uiText(
                                'ui.components.text_a45e0ff4bd9e',
                                'E-mail de bienvenue',
                            )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {uiText(
                                'ui.components.text_15b9f4f4b842',
                                'Envoie un lien pour choisir un mot de passe initial. Valable 15 minutes.',
                            )}
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={sendingWelcome || sendingReset}
                        onClick={() =>
                            postAction(
                                sendWelcome.url(userUuid),
                                setSendingWelcome,
                            )
                        }
                    >
                        {sendingWelcome
                            ? uiText(
                                  'ui.components.text_1ccef8a10ca7',
                                  'Envoi…',
                              )
                            : uiText(
                                  'ui.components.text_58c0fa009a92',
                                  'Renvoyer',
                              )}
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
                <div className="flex flex-wrap items-start gap-3">
                    <div className="rounded-md bg-primary/10 p-2 text-primary">
                        <KeyRound className="size-4" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-sm font-medium">
                            {uiText(
                                'ui.components.text_909822f461c0',
                                'Réinitialisation du mot de passe',
                            )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {uiText(
                                'ui.components.text_87ab4659acc0',
                                'Envoie un lien pour définir un nouveau mot de passe. Valable 15 minutes.',
                            )}
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={sendingWelcome || sendingReset}
                        onClick={() =>
                            postAction(
                                sendPasswordReset.url(userUuid),
                                setSendingReset,
                            )
                        }
                    >
                        {sendingReset
                            ? uiText(
                                  'ui.components.text_1ccef8a10ca7',
                                  'Envoi…',
                              )
                            : uiText(
                                  'ui.components.text_d7c52473addb',
                                  'Envoyer le lien',
                              )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
