import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { usePasskeyRegister } from '@laravel/passkeys/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    onSuccess: () => void;
};

export default function PasskeyRegistration({ onSuccess }: Props) {
    const { t: uiText } = useUiTranslations();

    const [name, setName] = useState(() => {
        const ua = navigator.userAgent;

        const browser = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'].find(
            (browser) => new RegExp(browser).test(ua),
        );

        const os = ['iPhone', 'iPad', 'Android', 'Mac', 'Windows'].find((os) =>
            new RegExp(os).test(ua),
        );

        return [browser, os].filter(Boolean).join(' on ') || '';
    });

    const [showForm, setShowForm] = useState(false);
    const { register, isLoading, error, isSupported } = usePasskeyRegister({
        onSuccess: () => {
            setName('');
            setShowForm(false);
            onSuccess();
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            return;
        }

        await register(name);
    };

    const handleCancel = () => {
        setShowForm(false);
        setName('');
    };

    if (!isSupported) {
        return (
            <div className="text-sm text-muted-foreground">
                {uiText(
                    'ui.components.text_820494bb9a60',
                    "Ce navigateur ne prend pas en charge les clés d'accès.",
                )}
            </div>
        );
    }

    if (!showForm) {
        return (
            <Button variant="outline" onClick={() => setShowForm(true)}>
                {uiText(
                    'ui.components.text_ffc92f64f0e4',
                    "Ajouter une clé d'accès",
                )}
            </Button>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-lg border border-border bg-muted/50 p-4"
        >
            <div className="grid gap-2">
                <Label htmlFor="passkey-name">
                    {uiText('ui.components.text_30a3a952bf7c', 'Nom de la clé')}
                </Label>
                <Input
                    id="passkey-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={uiText(
                        'ui.components.text_95b54ce65c8b',
                        'Par exemple : MacBook Pro, iPhone',
                    )}
                    className="mt-1 block w-full border-foreground/20"
                    autoFocus
                />
                <p className="text-xs text-muted-foreground">
                    {uiText(
                        'ui.components.text_33e15b41872d',
                        "Ce nom vous permettra d'identifier cette clé.",
                    )}
                </p>
            </div>

            {error && <InputError message={error} />}

            <div className="flex gap-2">
                <Button type="submit" disabled={isLoading || !name.trim()}>
                    {isLoading
                        ? uiText(
                              'ui.components.text_9ef767a32782',
                              'Enregistrement…',
                          )
                        : uiText(
                              'ui.components.text_4cc2cdac74f2',
                              "Enregistrer une clé d'accès",
                          )}
                </Button>
                <Button type="button" variant="ghost" onClick={handleCancel}>
                    {uiText('ui.components.text_19766ed6ccb2', 'Annuler')}
                </Button>
            </div>
        </form>
    );
}
