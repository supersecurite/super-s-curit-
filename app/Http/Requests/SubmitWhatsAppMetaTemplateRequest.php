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
            'name.required' => bt('validation.meta_name_required_alt'),
            'name.regex' => bt('validation.meta_name_format'),
            'category.required' => bt('validation.meta_category_required'),
            'category.in' => bt('validation.meta_category_in'),
            'language.required' => bt('validation.meta_language_required_alt'),
            'body_text.required' => bt('validation.meta_body_required'),
            'body_text.max' => bt('validation.meta_body_max'),
            'header_text.max' => bt('validation.meta_header_max'),
            'footer_text.max' => bt('validation.meta_footer_max'),
        ];
    }
}
