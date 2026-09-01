<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\PasswordConfirmedResponse as PasswordConfirmedResponseContract;
use Laravel\Fortify\Fortify;

/**
 * Après confirmation du mot de passe (Fortify).
 *
 * Overlay de verrouillage inactivité (`X-Super-Securite-Lock-Unlock`) : revenir à la
 * page en cours — pas le dashboard (`fortify.home`). L'écran dédié
 * `auth/confirm-password` (2FA, etc.) continue d'utiliser `intended`.
 */
class PasswordConfirmedResponse implements PasswordConfirmedResponseContract
{
    public function toResponse($request)
    {
        if ($request->wantsJson()) {
            return new JsonResponse('', 201);
        }

        if ($request->header('X-Super-Securite-Lock-Unlock')) {
            $returnTo = $this->safeReturnTo($request);

            return $returnTo !== null
                ? redirect()->to($returnTo)
                : back();
        }

        return redirect()->intended(Fortify::redirects('password-confirmation'));
    }

    /**
     * Chemin interne uniquement (`/users?…`) — pas d'open redirect.
     */
    private function safeReturnTo(Request $request): ?string
    {
        $raw = trim((string) $request->input('return_to', ''));
        if ($raw === '' || ! str_starts_with($raw, '/') || str_starts_with($raw, '//')) {
            return null;
        }

        return $raw;
    }
}
