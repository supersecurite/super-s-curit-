<?php

namespace App\Http\Requests;

use App\Enums\BackofficePermission;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', User::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $allowedRoles = $this->allowedRoles();

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'role' => ['required', Rule::in($allowedRoles)],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['required', 'string', Rule::enum(BackofficePermission::class), Rule::in($this->allowedPermissionValues())],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => bt('validation.name_required'),
            'email.required' => bt('validation.email_required'),
            'email.unique' => bt('validation.email_unique'),
            'role.required' => bt('validation.role_required'),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => bt('validation.attr_name'),
            'email' => bt('validation.attr_email'),
            'phone' => bt('validation.attr_phone'),
            'role' => bt('validation.attr_role'),
        ];
    }

    /**
     * @return list<string>
     */
    private function allowedRoles(): array
    {
        if ($this->user()?->isSuperAdmin()) {
            return UserRole::values();
        }

        return [UserRole::Admin->value, UserRole::Commercial->value, UserRole::User->value];
    }

    /**
     * @return list<string>
     */
    private function allowedPermissionValues(): array
    {
        $actor = $this->user();

        if ($actor?->isSuperAdmin()) {
            return BackofficePermission::values();
        }

        return $actor?->backofficePermissionValues() ?? [];
    }
}
