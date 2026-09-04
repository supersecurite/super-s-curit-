<?php

namespace App\Http\Requests;

use App\Enums\MarketingMessageTemplateChannel;
use App\Models\MarketingMessageTemplate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMarketingMessageTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', MarketingMessageTemplate::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->input('channel') === MarketingMessageTemplateChannel::WhatsApp->value) {
            $this->merge([
                'body' => $this->input('body') ?? $this->input('body_text') ?? '',
                'subject' => $this->input('subject') ?? $this->input('header_text'),
                'meta_template_language' => $this->input('meta_template_language') ?? $this->input('language') ?? 'fr',
                'meta_template_name' => $this->input('meta_template_name') ?? $this->input('name_technical'),
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $isWhatsApp = $this->input('channel') === MarketingMessageTemplateChannel::WhatsApp->value;
        $isEmail = $this->input('channel') === MarketingMessageTemplateChannel::Email->value;

        return [
            'name' => ['required', 'string', 'max:255'],
            'channel' => ['required', 'string', Rule::enum(MarketingMessageTemplateChannel::class)],
            'subject' => [
                Rule::requiredIf($isEmail),
                'nullable',
                'string',
                'max:255',
            ],
            'body' => [
                Rule::requiredIf($isEmail),
                'nullable',
                'string',
                'max:500000',
            ],
            'meta_template_name' => [
                Rule::requiredIf($isWhatsApp),
                'nullable',
                'string',
                'max:255',
                'regex:/^[a-zA-Z0-9_]+$/',
            ],
            'meta_template_language' => [
                Rule::requiredIf($isWhatsApp),
                'nullable',
                'string',
                'max:16',
            ],
            'category' => [
                'nullable',
                'string',
                Rule::in(['MARKETING', 'UTILITY', 'AUTHENTICATION']),
            ],
            'account_uuid' => [
                'nullable',
                'uuid',
                Rule::exists('whatsapp_accounts', 'uuid')->where('is_active', true),
            ],
            'footer_text' => [
                'nullable',
                'string',
                'max:60',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le titre interne est requis.',
            'subject.required' => 'L\'objet est requis pour un template e-mail.',
            'body.required' => 'Le contenu du message est requis pour un template e-mail.',
            'meta_template_name.required' => 'Le nom du modèle Meta est requis pour WhatsApp.',
            'meta_template_language.required' => 'La langue du modèle Meta est requise.',
        ];
    }
}
