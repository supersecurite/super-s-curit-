<?php

namespace App\Http\Requests\Settings;

use App\Concerns\ProfileValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->profileRules($this->user()->id);
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => bt('validation.name_required'),
            'email.required' => bt('validation.email_required'),
            'email.email' => bt('validation.email_email'),
            'email.unique' => bt('validation.email_unique'),
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
        ];
    }
}
