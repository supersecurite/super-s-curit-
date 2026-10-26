import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { router } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';
import Heading from '@/components/heading';
import PasskeyItem from '@/components/passkey-item';
import PasskeyRegistration from '@/components/passkey-register';
import type { Passkey } from '@/types/auth';

export type Props = {
    canManagePasskeys?: boolean;
    passkeys?: Passkey[];
};

const EmptyState = () => {
    const { t: uiText } = useUiTranslations();

    return (
        <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <KeyRound className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-medium">
                {uiText(
                    'ui.components.text_58af3c8d7048',
                    "Aucune clé d'accès",
                )}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
                {uiText(
                    'ui.components.text_6dba379b1a84',
                    "Ajoutez une clé d'accès pour vous connecter sans mot de passe",
                )}
            </p>
        </div>
    );
};

export default function ManagePasskeys(props: Props) {
    const { t: uiText } = useUiTranslations();

    const passkeys = props.passkeys ?? [];

    const handleDelete = (id: number, onError: () => void) => {
        router.delete(`/user/passkeys/${id}`, {
            preserveScroll: true,
            onError,
        });
    };

    const handleRegisterSuccess = () => {
        router.reload();
    };

    if (!(props.canManagePasskeys ?? false)) {
        return null;
    }

    return (
        <div className="mx-auto space-y-6 rounded-xl bg-white p-5">
            <Heading
                variant="small"
                title={uiText(
                    'ui.components.text_c87ccdb428e6',
                    "Clés d'accès",
                )}
                description={uiText(
                    'ui.components.text_77f4a36551f0',
                    "Gérez vos clés d'accès pour la connexion sans mot de passe",
                )}
            />

            <div className="overflow-hidden rounded-lg border border-border">
                {passkeys.length > 0 ? (
                    passkeys.map((passkey) => (
                        <PasskeyItem
                            key={passkey.id}
                            passkey={passkey}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <EmptyState />
                )}
            </div>

            <PasskeyRegistration onSuccess={handleRegisterSuccess} />
        </div>
    );
}
