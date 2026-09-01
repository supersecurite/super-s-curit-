<?php

namespace App\Http\Controllers;

use App\Actions\Users\CreateUser;
use App\Actions\Users\SendPasswordResetLink;
use App\Actions\Users\SendWelcomeSetPassword;
use App\Enums\BackofficePermission;
use App\Enums\UserRole;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Support\IndexTableSort;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $sort = IndexTableSort::resolve($request, ['name', 'email', 'phone', 'role'], 'name');

        return Inertia::render('users/index', [
            'users' => User::query()
                ->with('backofficePermissionRecords')
                ->orderBy($sort['column'], $sort['direction'])
                ->paginate(15)
                ->withQueryString()
                ->through(function (User $user) use ($request) {
                    return [
                        ...$this->formatUser($user),
                        'can_update' => $request->user()?->can('update', $user) ?? false,
                        'can_delete' => $request->user()?->can('delete', $user) ?? false,
                    ];
                }),
            'canCreate' => $request->user()?->can('create', User::class) ?? false,
            'filters' => IndexTableSort::filters($request),
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', User::class);

        return Inertia::render('users/create', [
            'roles' => $this->roleOptions($request->user()),
            'permissionGroups' => $this->permissionGroups($request->user()),
        ]);
    }

    public function store(StoreUserRequest $request, CreateUser $action): RedirectResponse
    {
        $user = $action->handle($request->safe()->only(['name', 'email', 'phone', 'role']));

        if ($user->role === UserRole::SuperAdmin) {
            // Super admin : aucune permission stockée.
        } elseif ($user->role === UserRole::Commercial) {
            $permissions = $request->validated('permissions') ?? [];
            $user->syncBackofficePermissions(
                $permissions !== []
                    ? $permissions
                    : BackofficePermission::commercialDefaults(),
            );
        } else {
            $user->syncBackofficePermissions($request->validated('permissions') ?? []);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Utilisateur créé. Un e-mail de bienvenue a été envoyé (lien valable 15 min).',
        ]);

        return to_route('users.index');
    }

    public function edit(Request $request, User $user): Response
    {
        $this->authorize('update', $user);

        $tab = $request->query('tab', 'profile');
        $allowedTabs = ['profile', 'permissions', 'security'];

        if (! in_array($tab, $allowedTabs, true)) {
            $tab = 'profile';
        }

        return Inertia::render('users/edit', [
            'user' => $this->formatUser($user),
            'roles' => $this->roleOptions($request->user(), $user),
            'permissionGroups' => $this->permissionGroups($request->user()),
            'tab' => $tab,
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $user->fill($request->safe()->only(['name', 'email', 'phone', 'role']));

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        if ($user->role === UserRole::SuperAdmin) {
            $user->syncBackofficePermissions([]);
        } elseif ($user->role === UserRole::Commercial) {
            $permissions = $request->validated('permissions') ?? [];
            $user->syncBackofficePermissions(
                $permissions !== []
                    ? $permissions
                    : BackofficePermission::commercialDefaults(),
            );
        } else {
            $user->syncBackofficePermissions($request->validated('permissions') ?? []);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Utilisateur mis à jour avec succès.']);

        return redirect()->back();
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Utilisateur supprimé avec succès.']);

        return to_route('users.index');
    }

    public function sendWelcome(User $user, SendWelcomeSetPassword $action): RedirectResponse
    {
        $this->authorize('update', $user);

        $action->handle($user);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'E-mail de bienvenue renvoyé (lien valable 15 min).',
        ]);

        return back();
    }

    public function sendPasswordReset(User $user, SendPasswordResetLink $action): RedirectResponse
    {
        $this->authorize('update', $user);

        $action->handle($user);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Lien de réinitialisation envoyé (valable 15 min).',
        ]);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function formatUser(User $user): array
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
            'permissions' => $user->backofficePermissionValues(),
            'has_all_permissions' => $user->isSuperAdmin(),
            'created_at' => $user->created_at?->toIso8601String(),
        ];
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function roleOptions(?User $actor, ?User $target = null): array
    {
        $roles = UserRole::cases();

        if ($actor?->isSuperAdmin()) {
            return $this->mapRoleOptions($roles);
        }

        if ($target?->role === UserRole::SuperAdmin) {
            return $this->mapRoleOptions([UserRole::SuperAdmin]);
        }

        return $this->mapRoleOptions(array_filter(
            $roles,
            fn (UserRole $role) => $role !== UserRole::SuperAdmin,
        ));
    }

    /**
     * @param  list<UserRole>  $roles
     * @return list<array{value: string, label: string}>
     */
    private function mapRoleOptions(array $roles): array
    {
        return array_values(array_map(
            fn (UserRole $role) => [
                'value' => $role->value,
                'label' => $role->label(),
            ],
            $roles,
        ));
    }

    /**
     * @return list<array{key: string, label: string, permissions: list<array{value: string, label: string, description: string}>}>
     */
    private function permissionGroups(?User $actor): array
    {
        $groups = BackofficePermission::groupedOptions();

        if ($actor?->isSuperAdmin()) {
            return $groups;
        }

        $allowed = $actor?->backofficePermissionValues() ?? [];

        return collect($groups)
            ->map(function (array $group) use ($allowed): array {
                $permissions = array_values(array_filter(
                    $group['permissions'],
                    fn (array $permission): bool => in_array($permission['value'], $allowed, true),
                ));

                if ($permissions === []) {
                    return [];
                }

                return [
                    ...$group,
                    'permissions' => $permissions,
                ];
            })
            ->filter()
            ->values()
            ->all();
    }
}
