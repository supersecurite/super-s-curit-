<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/** Lien de réinitialisation envoyé par un administrateur. */
class AdminPasswordResetNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $token,
    ) {}

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $minutes = (int) config('auth.passwords.users.expire', 15);
        $app = (string) config('app.name');

        return (new MailMessage)
            ->subject($app.' — réinitialisation de votre mot de passe')
            ->view('emails.admin-password-reset', [
                'appName' => $app,
                'name' => $notifiable->name,
                'url' => $this->url($notifiable),
                'minutes' => $minutes,
            ]);
    }

    private function url(object $notifiable): string
    {
        return url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));
    }
}
