<?php

namespace App\Http\Controllers;

use App\Enums\BackofficePermission;
use App\Enums\UserRole;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        return Inertia::render('users/index', [
            'users' => User::query()
                ->with('backofficePermissionRecords')
                ->orderBy('name')
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

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $user = User::create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'phone' => $request->validated('phone'),
            'role' => $request->validated('role'),
            'password' => $request->validated('password'),
            'email_verified_at' => now(),
        ]);

        if ($user->role !== UserRole::SuperAdmin) {
            $user->syncBackofficePermissions($request->validated('permissions') ?? []);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Utilisateur créé avec succès.']);

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

        if ($request->filled('password')) {
            $user->password = $request->validated('password');
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        if ($user->role !== UserRole::SuperAdmin) {
            $user->syncBackofficePermissions($request->validated('permissions') ?? []);
        } else {
            $user->syncBackofficePermissions([]);
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
