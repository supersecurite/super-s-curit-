<?php

namespace App\Http\Requests;

use App\Models\MarketingContact;
use App\Support\InternationalPhoneNumber;
use App\Support\Marketing\MarketingCompanyContactRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMarketingContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        $contact = $this->route('marketing_client');

        return $contact instanceof MarketingContact
            && ($this->user()?->can('update', $contact) ?? false);
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('tags') && is_string($this->input('tags'))) {
            $tags = array_values(array_filter(array_map('trim', explode(',', (string) $this->input('tags')))));

            $this->merge(['tags' => $tags]);
        }

        MarketingCompanyContactRules::prepareForValidation($this);
        MarketingCompanyContactRules::normalizePhoneFields($this);

        if ($this->has('phone')) {
            $this->merge([
                'phone' => InternationalPhoneNumber::normalize($this->input('phone')),
            ]);
        }

        $this->merge(['is_company' => $this->boolean('is_company')]);

        if (! $this->boolean('is_company')) {
            $this->merge([
                'company_name' => null,
                'company_role' => null,
                'company_contacts' => [],
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var MarketingContact $contact */
        $contact = $this->route('marketing_client');

        return [
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('marketing_contacts', 'email')->ignore($contact->id),
            ],
            'phone' => [
                'nullable',
                'string',
                'regex:/^\+[1-9]\d{1,14}$/',
                Rule::unique('marketing_contacts', 'phone')->ignore($contact->id),
            ],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'marketing_consent' => ['sometimes', 'boolean'],
            'is_company' => ['sometimes', 'boolean'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:5000'],
            ...MarketingCompanyContactRules::rules(),
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            if (! $this->filled('email') && ! $this->filled('phone')) {
                $validator->errors()->add('email', 'Au moins un e-mail ou un téléphone est requis.');
            }

            MarketingCompanyContactRules::validateChannelValues($validator, $this->input('company_contacts'));
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
            'phone.regex' => 'Le téléphone doit être au format international avec indicatif (ex. +1 (555) 670-8636).',
            ...MarketingCompanyContactRules::messages(),
        ];
    }
}
