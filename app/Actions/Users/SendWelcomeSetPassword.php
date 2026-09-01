<?php

namespace App\Actions\Users;

use App\Actions\Action;
use App\Models\User;
use App\Notifications\WelcomeSetPasswordNotification;
use Illuminate\Support\Facades\Password;

/**
 * Envoie (ou renvoie) l'e-mail de bienvenue pour définir le mot de passe.
 *
 * Un nouvel envoi remplace le jeton précédent (lien valable 15 minutes).
 */
class SendWelcomeSetPassword extends Action
{
    public function handle(User $user): void
    {
        $token = Password::broker()->createToken($user);
        $user->notify(new WelcomeSetPasswordNotification($token));
    }
}
