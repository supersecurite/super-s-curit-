import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
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
import { Label } from '@/components/ui/label';

export default function DeleteUser() {
    const { t: uiText } = useUiTranslations();

    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6">
            <Heading
                variant="small"
                title={uiText(
                    'ui.components.text_d2d80f8122e6',
                    'Supprimer le compte',
                )}
                description={uiText(
                    'ui.components.text_9ed453ccae42',
                    'Supprimez définitivement votre compte et toutes vos données',
                )}
            />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4">
                <div className="relative space-y-0.5 text-red-600">
                    <p className="font-medium">
                        {uiText('ui.components.text_c2eb8cd9d956', 'Attention')}
                    </p>
                    <p className="text-sm">
                        {uiText(
                            'ui.components.text_c45386b35889',
                            'Cette action est irréversible. Procédez avec prudence.',
                        )}
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            data-test="delete-user-button"
                        >
                            {uiText(
                                'ui.components.text_d2d80f8122e6',
                                'Supprimer le compte',
                            )}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>
                            {uiText(
                                'ui.components.text_f9435d3e7239',
                                'Confirm account deletion?',
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {uiText(
                                'ui.components.text_fc3e41e0cded',
                                'Une fois votre compte supprimé, toutes vos données seront définitivement effacées. Saisissez votre mot de passe pour confirmer.',
                            )}
                        </DialogDescription>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            {uiText(
                                                'ui.components.text_ff9c8b8c0677',
                                                'Mot de passe',
                                            )}
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder={uiText(
                                                'ui.components.text_ff9c8b8c0677',
                                                'Mot de passe',
                                            )}
                                            autoComplete="current-password"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                {uiText(
                                                    'ui.components.text_46ad3916f6a0',
                                                    'Annuler',
                                                )}
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={processing}
                                            asChild
                                        >
                                            <button
                                                type="submit"
                                                data-test="confirm-delete-user-button"
                                            >
                                                {uiText(
                                                    'ui.components.text_d2d80f8122e6',
                                                    'Supprimer le compte',
                                                )}
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
