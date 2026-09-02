<?php

namespace App\Http\Requests;

use App\Enums\MarketingEmailAccountDriver;
use App\Models\MarketingEmailAccount;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMarketingEmailAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        $account = $this->route('marketing_email_account');

        return $account instanceof MarketingEmailAccount
            && ($this->user()?->can('update', $account) ?? false);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $isSmtp = $this->input('driver') === MarketingEmailAccountDriver::Smtp->value;

        return [
            'name' => ['required', 'string', 'max:255'],
            'from_address' => ['required', 'email', 'max:255'],
            'from_name' => ['nullable', 'string', 'max:255'],
            'driver' => ['required', Rule::enum(MarketingEmailAccountDriver::class)],
            'smtp_host' => [Rule::requiredIf($isSmtp), 'nullable', 'string', 'max:255'],
            'smtp_port' => [Rule::requiredIf($isSmtp), 'nullable', 'integer', 'min:1', 'max:65535'],
            'smtp_encryption' => ['nullable', 'string', Rule::in(['tls', 'ssl', ''])],
            'smtp_username' => ['nullable', 'string', 'max:255'],
            'smtp_password' => ['nullable', 'string', 'max:5000'],
            'daily_send_limit' => ['nullable', 'integer', 'min:1', 'max:1000000'],
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
        $data['smtp_encryption'] = ($data['smtp_encryption'] ?? null) ?: null;
        $data['daily_send_limit'] = $data['daily_send_limit'] ?? null;

        return $data;
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'from_address.required' => 'L\'adresse d\'expéditeur est requise.',
            'smtp_host.required' => 'Le serveur SMTP est requis.',
            'smtp_port.required' => 'Le port SMTP est requis.',
        ];
    }
}
