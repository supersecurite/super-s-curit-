<?php

namespace App\Actions\Users;

use App\Actions\Action;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * Crée un compte staff sans mot de passe saisi par l'admin.
 *
 * Un hash aléatoire est stocké ; l'utilisateur le remplace via l'e-mail de bienvenue.
 */
class CreateUser extends Action
{
    public function __construct(
        private SendWelcomeSetPassword $sendWelcomeSetPassword,
    ) {}

    /**
     * @param  array{name: string, email: string, phone?: string|null, role: UserRole|string}  $data
     */
    public function handle(array $data): User
    {
        $user = User::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'role' => $data['role'] instanceof UserRole ? $data['role'] : UserRole::from($data['role']),
            'password' => Str::password(32),
            'email_verified_at' => now(),
        ]);

        $this->sendWelcomeSetPassword->handle($user);

        return $user;
    }
}
