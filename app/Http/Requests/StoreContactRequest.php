<?php

namespace App\Http\Requests;

use App\Rules\Recaptcha;
use App\Support\LocaleTranslations;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'company' => ['nullable', 'string', 'max:255'],
            'project_type' => ['nullable', 'string', 'max:100'],
            'message' => ['required', 'string', 'max:5000'],
            'g-recaptcha-response' => [
                Rule::requiredIf(fn (): bool => (bool) config('recaptcha.enabled')),
                new Recaptcha,
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => LocaleTranslations::trans('public_content.name_required'),
            'email.required' => LocaleTranslations::trans('public_content.email_required'),
            'email.email' => LocaleTranslations::trans('public_content.email_invalid'),
            'phone.required' => LocaleTranslations::trans('public_content.phone_required'),
            'message.required' => LocaleTranslations::trans('public_content.message_required'),
            'g-recaptcha-response' => LocaleTranslations::trans('public_content.captcha_required'),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nom',
            'email' => 'e-mail',
            'phone' => 'téléphone',
            'company' => 'entreprise',
            'project_type' => 'type de projet',
            'message' => 'message',
            'g-recaptcha-response' => 'vérification anti-robot',
        ];
    }
}
