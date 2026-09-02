<?php

namespace App\Http\Requests;

use App\Enums\WhatsAppAccountDriver;
use App\Models\WhatsAppAccount;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWhatsAppAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', WhatsAppAccount::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone_number_id' => ['required', 'string', 'max:255'],
            'business_account_id' => ['nullable', 'string', 'max:255'],
            'access_token' => ['required', 'string', 'max:5000'],
            'app_secret' => ['required', 'string', 'max:5000'],
            'verify_token' => ['required', 'string', 'max:255'],
            'driver' => ['required', Rule::enum(WhatsAppAccountDriver::class)],
            'is_active' => ['sometimes', 'boolean'],
            'is_default' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function validated($key = null, $default = null): mixed
    {
        $data = parent::validated($key, $default);

        if ($key !== null) {
            return $data;
        }

        $data['is_active'] = $this->boolean('is_active', true);
        $data['is_default'] = $this->boolean('is_default', false);

        return $data;
    }
}
