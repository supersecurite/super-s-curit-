import { router, useForm, usePage } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { UserInfo } from '@/components/user-info';
import { logout } from '@/routes';
import { store as confirmPassword } from '@/routes/password/confirm';

type InactivityLockScreenProps = {
    onUnlock: () => void;
};

/**
 * Overlay de session verrouillée — reste sur la page courante au déverrouillage
 * (header `X-Super-Securite-Lock-Unlock` + `return_to`, pas le dashboard Fortify).
 */
export default function InactivityLockScreen({
    onUnlock,
}: InactivityLockScreenProps) {
    const { auth } = usePage().props;
    const user = auth.user!;
    const form = useForm({
        password: '',
        return_to:
            typeof window !== 'undefined'
                ? window.location.pathname + window.location.search
                : '',
    });

    const submit = (event: FormEvent): void => {
        event.preventDefault();

        form.post(confirmPassword.url(), {
            preserveState: true,
            preserveScroll: true,
            headers: {
                'X-Super-Securite-Lock-Unlock': '1',
            },
            onSuccess: () => {
                form.reset('password');
                onUnlock();
            },
        });
    };

    const handleLogout = (): void => {
        sessionStorage.removeItem('super-securite-profile-locked');
        router.post(logout());
    };

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 p-6 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-lock-title"
        >
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background/95 to-muted/40 p-8 shadow-2xl backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
                    <div
                        className="absolute top-0 right-0 h-48 w-48 animate-pulse rounded-full bg-primary blur-3xl"
                        style={{ animationDuration: '4s' }}
                    />
                    <div
                        className="absolute bottom-0 left-0 h-48 w-48 animate-pulse rounded-full bg-muted-foreground/30 blur-3xl"
                        style={{
                            animationDuration: '6s',
                            animationDelay: '2s',
                        }}
                    />
                </div>

                <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                            <Lock className="size-7" aria-hidden />
                        </div>

                        <div className="space-y-2">
                            <h2
                                id="profile-lock-title"
                                className="text-xl font-semibold tracking-tight"
                            >
                                Session verrouillée
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Entrez votre mot de passe pour reprendre votre
                                session.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/60 px-4 py-3">
                            <UserInfo user={user} showEmail />
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="profile-lock-password">
                                Mot de passe
                            </Label>
                            <PasswordInput
                                id="profile-lock-password"
                                name="password"
                                value={form.data.password}
                                onChange={(event) =>
                                    form.setData('password', event.target.value)
                                }
                                placeholder="Mot de passe"
                                autoComplete="current-password"
                                autoFocus
                            />
                            <InputError message={form.errors.password} />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={form.processing}
                            data-test="profile-lock-unlock-button"
                        >
                            {form.processing && <Spinner />}
                            Déverrouiller
                        </Button>
                    </form>

                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={handleLogout}
                    >
                        Se déconnecter
                    </Button>
                </div>
            </div>
        </div>
    );
}
