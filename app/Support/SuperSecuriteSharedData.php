<?php

namespace App\Support;

use App\Models\User;

class SuperSecuriteSharedData
{
    /**
     * @return array<string, mixed>
     */
    public static function contact(): array
    {
        return [
            'email' => config('super-securite.email'),
            'phone' => config('super-securite.phone'),
            'phone_secondary' => config('super-securite.phone_secondary'),
            'phone_href' => config('super-securite.phone_href'),
            'address' => config('super-securite.address'),
            'rccm' => config('super-securite.rccm'),
            'social' => config('super-securite.social'),
            'map' => [
                ...BusinessLocation::coordinates(),
                'embedUrl' => BusinessLocation::embedUrl(),
                'directionsUrl' => BusinessLocation::directionsUrl(),
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function authUser(User $user): array
    {
        if (! $user->relationLoaded('backofficePermissionRecords')) {
            $user->load('backofficePermissionRecords');
        }

        return [
            'id' => $user->id,
            'uuid' => $user->uuid,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role->value,
            'role_label' => $user->role->label(),
            'is_admin' => $user->isAdmin(),
            'permissions' => $user->backofficePermissionValues(),
            'can_approve_content' => $user->canApproveContent(),
            'can_approve_articles' => $user->canApproveArticles(),
            'can_approve_conseils' => $user->canApproveConseils(),
            'email_verified_at' => $user->email_verified_at,
            'two_factor_enabled' => $user->two_factor_secret !== null,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }
}
