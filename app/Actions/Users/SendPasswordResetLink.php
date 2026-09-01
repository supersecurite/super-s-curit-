<?php

namespace App\Actions\Users;

use App\Actions\Action;
use App\Models\User;
use App\Notifications\AdminPasswordResetNotification;
use Illuminate\Support\Facades\Password;

/**
 * Envoie un lien de réinitialisation de mot de passe initié par un admin.
 */
class SendPasswordResetLink extends Action
{
    public function handle(User $user): void
    {
        $token = Password::broker()->createToken($user);
        $user->notify(new AdminPasswordResetNotification($token));
    }
}
