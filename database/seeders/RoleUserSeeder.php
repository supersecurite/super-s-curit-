<?php

namespace Database\Seeders;

use App\Enums\BackofficePermission;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class RoleUserSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            [
                'name' => 'Super Administrateur',
                'email' => env('SEED_SUPER_ADMIN_EMAIL', 'super_admin@supersecurite.com'),
                'password' => env('SEED_SUPER_ADMIN_PASSWORD', 'password'),
                'phone' => env('SEED_SUPER_ADMIN_PHONE'),
                'role' => UserRole::SuperAdmin,
            ],
            [
                'name' => 'Administrateur',
                'email' => env('SEED_ADMIN_EMAIL', 'admin@supersecurite.com'),
                'password' => env('SEED_ADMIN_PASSWORD', 'password'),
                'phone' => env('SEED_ADMIN_PHONE'),
                'role' => UserRole::Admin,
            ],
            [
                'name' => 'Utilisateur',
                'email' => env('SEED_USER_EMAIL', 'user@supersecurite.com'),
                'password' => env('SEED_USER_PASSWORD', 'password'),
                'phone' => env('SEED_USER_PHONE'),
                'role' => UserRole::User,
            ],
        ];

        foreach ($accounts as $account) {
            $user = User::query()->updateOrCreate(
                ['email' => $account['email']],
                [
                    'name' => $account['name'],
                    'password' => $account['password'],
                    'phone' => $account['phone'],
                    'role' => $account['role'],
                    'email_verified_at' => now(),
                ],
            );

            if ($account['role'] === UserRole::Admin) {
                $user->syncBackofficePermissions(BackofficePermission::cases());
            }

            if ($account['role'] === UserRole::User) {
                $user->syncBackofficePermissions(BackofficePermission::contributorDefaults());
            }
        }
    }
}
