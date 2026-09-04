<?php

namespace App\Http\Requests;

use App\Models\MarketingMessageTemplate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubmitWhatsAppMetaTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', MarketingMessageTemplate::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'account_uuid' => ['nullable', 'uuid', Rule::exists('whatsapp_accounts', 'uuid')->where('is_active', true)],
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-zA-Z0-9_]+$/',
            ],
            'title' => ['nullable', 'string', 'max:255'],
            'category' => ['required', 'string', Rule::in(['MARKETING', 'UTILITY', 'AUTHENTICATION'])],
            'language' => ['required', 'string', 'max:16'],
            'header_text' => ['nullable', 'string', 'max:60'],
            'body_text' => ['required', 'string', 'max:1024'],
            'footer_text' => ['nullable', 'string', 'max:60'],
            'example_values' => ['nullable', 'array'],
            'example_values.*' => ['string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom technique du modèle Meta est requis.',
            'name.regex' => 'Le nom Meta ne doit contenir que des lettres minuscules, chiffres et tirets du bas (_).',
            'category.required' => 'La catégorie Meta est requise.',
            'category.in' => 'La catégorie doit être MARKETING, UTILITY ou AUTHENTICATION.',
            'language.required' => 'La langue du modèle est requise.',
            'body_text.required' => 'Le texte du corps du modèle est requis.',
            'body_text.max' => 'Le texte du corps ne doit pas dépasser 1024 caractères (limite Meta).',
            'header_text.max' => 'L\'en-tête ne doit pas dépasser 60 caractères (limite Meta).',
            'footer_text.max' => 'Le pied de page ne doit pas dépasser 60 caractères (limite Meta).',
        ];
    }
}
