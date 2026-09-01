import { router } from '@inertiajs/react';
import { KeyRound, Mail } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    sendPasswordReset,
    sendWelcome,
} from '@/routes/users';

type UserSecurityActionsProps = {
    userUuid: string;
};

export default function UserSecurityActions({ userUuid }: UserSecurityActionsProps) {
    const [sendingWelcome, setSendingWelcome] = useState(false);
    const [sendingReset, setSendingReset] = useState(false);

    const postAction = (
        url: string,
        setLoading: (value: boolean) => void,
    ) => {
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
                            E-mail de bienvenue
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Envoie un lien pour choisir un mot de passe initial.
                            Valable 15 minutes.
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={sendingWelcome || sendingReset}
                        onClick={() =>
                            postAction(sendWelcome.url(userUuid), setSendingWelcome)
                        }
                    >
                        {sendingWelcome ? 'Envoi…' : 'Renvoyer'}
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
                            Réinitialisation du mot de passe
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Envoie un lien pour définir un nouveau mot de passe.
                            Valable 15 minutes.
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
                        {sendingReset ? 'Envoi…' : 'Envoyer le lien'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
