<?php

namespace App\Http\Requests;

use App\Rules\Recaptcha;
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
            'name.required' => 'Le nom est obligatoire.',
            'email.required' => 'L\'adresse e-mail est obligatoire.',
            'email.email' => 'L\'adresse e-mail n\'est pas valide.',
            'phone.required' => 'Le numéro de téléphone est obligatoire.',
            'message.required' => 'Veuillez décrire votre projet.',
            'g-recaptcha-response' => 'La vérification anti-robot est requise.',
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
