<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\BackofficePermission;
use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'phone', 'role', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    protected static function booted(): void
    {
        static::creating(function (User $user): void {
            if (empty($user->uuid)) {
                $user->uuid = (string) Str::uuid();
            }

            if (empty($user->role)) {
                $user->role = UserRole::User;
            }
        });
    }

    public function isAdmin(): bool
    {
        return $this->role->isAdmin();
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === UserRole::SuperAdmin;
    }

    /**
     * @return HasMany<UserBackofficePermission, $this>
     */
    public function backofficePermissionRecords(): HasMany
    {
        return $this->hasMany(UserBackofficePermission::class);
    }

    /**
     * @return Collection<int, BackofficePermission>
     */
    public function backofficePermissions(): Collection
    {
        if ($this->isSuperAdmin()) {
            return collect(BackofficePermission::cases());
        }

        $stored = $this->relationLoaded('backofficePermissionRecords')
            ? $this->backofficePermissionRecords
            : $this->backofficePermissionRecords()->get();

        $hasLegacyPermissions = $stored->contains(
            fn (UserBackofficePermission $record): bool => ! str_contains((string) $record->permission, '.'),
        );

        $permissions = $stored
            ->flatMap(fn (UserBackofficePermission $record): Collection => $this->resolveStoredPermission((string) $record->permission))
            ->unique()
            ->values();

        if ($hasLegacyPermissions && $permissions->isNotEmpty()) {
            $this->syncBackofficePermissions($permissions->all());
        }

        if ($permissions->isEmpty() && $this->role === UserRole::Admin) {
            return collect(BackofficePermission::cases());
        }

        return $permissions;
    }

    public function hasBackofficePermission(BackofficePermission|string $permission): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        $permission = $permission instanceof BackofficePermission
            ? $permission
            : BackofficePermission::from($permission);

        return $this->backofficePermissions()->contains($permission);
    }

    public function canAccessFeature(string $feature): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        if ($this->role === UserRole::Admin && $this->backofficePermissionRecords()->count() === 0) {
            return true;
        }

        return $this->backofficePermissions()->contains(
            fn (BackofficePermission $permission): bool => $permission->feature() === $feature,
        );
    }

    public function canApproveArticles(): bool
    {
        return $this->hasBackofficePermission(BackofficePermission::ArticlesApprove);
    }

    public function canApproveConseils(): bool
    {
        return $this->hasBackofficePermission(BackofficePermission::ConseilsApprove);
    }

    public function canApproveContent(): bool
    {
        return $this->canApproveArticles() || $this->canApproveConseils();
    }

    public function canFeatureArticles(): bool
    {
        return $this->hasBackofficePermission(BackofficePermission::ArticlesFeature);
    }

    public function canFeatureConseils(): bool
    {
        return $this->hasBackofficePermission(BackofficePermission::ConseilsFeature);
    }

    /**
     * @param  list<BackofficePermission|string>  $permissions
     */
    public function syncBackofficePermissions(array $permissions): void
    {
        if ($this->isSuperAdmin()) {
            $this->backofficePermissionRecords()->delete();

            return;
        }

        $values = collect($permissions)
            ->map(fn (BackofficePermission|string $permission): string => $permission instanceof BackofficePermission
                ? $permission->value
                : BackofficePermission::from($permission)->value)
            ->unique()
            ->values();

        $this->backofficePermissionRecords()->delete();

        foreach ($values as $permission) {
            $this->backofficePermissionRecords()->create([
                'permission' => $permission,
            ]);
        }
    }

    /**
     * @return list<string>
     */
    public function backofficePermissionValues(): array
    {
        return $this->backofficePermissions()
            ->map(fn (BackofficePermission $permission): string => $permission->value)
            ->values()
            ->all();
    }

    /**
     * @return Collection<int, BackofficePermission>
     */
    private function resolveStoredPermission(string $raw): Collection
    {
        if (str_contains($raw, '.')) {
            $permission = BackofficePermission::tryFrom($raw);

            return $permission !== null ? collect([$permission]) : collect();
        }

        return collect(BackofficePermission::expandLegacy($raw));
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
}
