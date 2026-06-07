<?php

namespace App\Http\Requests;

use App\Enums\SecurityAgentPost;
use App\Support\GuineaLocationValidator;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreSecurityAgentApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:50'],
            'availability' => ['nullable', 'string', Rule::in(['jour', 'nuit', '24h', 'evenementiel'])],
            'certifications' => ['nullable', 'string', 'max:2000'],
            'motivation' => ['nullable', 'string', 'max:5000'],
            'post' => ['required', 'string', Rule::enum(SecurityAgentPost::class)],
            'region_id' => ['required', 'string', 'max:20'],
            'prefecture_id' => ['required', 'string', 'max:20'],
            'commune_id' => ['nullable', 'string', 'max:20'],
            'address_detail' => ['nullable', 'string', 'max:500'],
            'consent' => ['accepted'],
            'website' => ['nullable', 'max:0'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        app(GuineaLocationValidator::class)->attachToValidator($validator);
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'first_name.required' => 'Le prénom est obligatoire.',
            'last_name.required' => 'Le nom est obligatoire.',
            'phone.required' => 'Le téléphone est obligatoire.',
            'email.email' => 'L\'adresse e-mail n\'est pas valide.',
            'consent.accepted' => 'Vous devez accepter le traitement de vos données.',
            'post.required' => 'Le poste est obligatoire.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'first_name' => 'prénom',
            'last_name' => 'nom',
            'phone' => 'téléphone',
            'email' => 'e-mail',
            'experience_years' => 'années d\'expérience',
            'availability' => 'disponibilité',
            'certifications' => 'certifications',
            'motivation' => 'motivation',
            'post' => 'poste',
            'region_id' => 'région',
            'prefecture_id' => 'préfecture',
            'commune_id' => 'commune',
            'address_detail' => 'adresse complémentaire',
            'consent' => 'consentement',
        ];
    }
}
