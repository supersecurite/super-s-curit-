import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { KeyRound, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { Passkey } from '@/types/auth';

type Props = {
    passkey: Passkey;
    onDelete: (id: number, onError: () => void) => void;
};

export default function PasskeyItem({ passkey, onDelete }: Props) {
    const { t: uiText } = useUiTranslations();

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        onDelete(passkey.id, () => setIsDeleting(false));
    };

    return (
        <div className="flex items-center justify-between border-b p-4 last:border-b-0">
            <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <KeyRound className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                        <p className="font-medium tracking-tight">
                            {passkey.name}
                        </p>
                        {passkey.authenticator && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase ring-1 ring-border ring-inset">
                                {passkey.authenticator}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {uiText('ui.components.text_6b02e0d363a4', 'Ajoutée')}{' '}
                        {passkey.created_at_diff}
                        {passkey.last_used_at_diff && (
                            <>
                                <span className="mx-1 text-muted-foreground/50">
                                    /
                                </span>
                                {uiText(
                                    'ui.components.text_830ec7f812f9',
                                    'Dernière utilisation',
                                )}{' '}
                                {passkey.last_used_at_diff}
                            </>
                        )}
                    </p>
                </div>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">
                            {uiText(
                                'ui.components.text_c3812fc4acb8',
                                'Retirer',
                            )}
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>
                        {uiText(
                            'ui.components.text_9541dec2bd74',
                            "Supprimer la clé d'accès",
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {uiText(
                            'ui.components.text_1b8921b6ade5',
                            'Voulez-vous supprimer la clé «',
                        )}{' '}
                        {passkey.name}{' '}
                        {uiText(
                            'ui.components.text_a54a9780ea13',
                            "» ? Vous ne pourrez plus l'utiliser pour vous connecter.",
                        )}
                    </DialogDescription>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">
                                {uiText(
                                    'ui.components.text_19766ed6ccb2',
                                    'Annuler',
                                )}
                            </Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting
                                ? uiText(
                                      'ui.components.text_60d18e42fd5a',
                                      'Suppression…',
                                  )
                                : uiText(
                                      'ui.components.text_9541dec2bd74',
                                      "Supprimer la clé d'accès",
                                  )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
