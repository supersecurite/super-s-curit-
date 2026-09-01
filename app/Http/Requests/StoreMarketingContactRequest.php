<?php

namespace App\Http\Requests;

use App\Models\MarketingContact;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMarketingContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', MarketingContact::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('tags') && is_string($this->input('tags'))) {
            $tags = array_values(array_filter(array_map('trim', explode(',', (string) $this->input('tags')))));

            $this->merge(['tags' => $tags]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('marketing_contacts', 'email'),
            ],
            'phone' => [
                'nullable',
                'string',
                'regex:/^\+[1-9]\d{1,14}$/',
                Rule::unique('marketing_contacts', 'phone'),
            ],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'marketing_consent' => ['sometimes', 'boolean'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            if (! $this->filled('email') && ! $this->filled('phone')) {
                $validator->errors()->add('email', 'Au moins un e-mail ou un téléphone est requis.');
            }
        });
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.unique' => 'Un contact avec cet e-mail existe déjà.',
            'phone.unique' => 'Un contact avec ce téléphone existe déjà.',
            'phone.regex' => 'Le téléphone doit être au format E.164 (ex. +224612345678).',
        ];
    }
}
