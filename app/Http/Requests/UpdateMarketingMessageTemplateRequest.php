<?php

namespace App\Http\Requests;

use App\Enums\MarketingMessageTemplateChannel;
use App\Models\MarketingMessageTemplate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMarketingMessageTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        $template = $this->route('marketing_template');

        return $template instanceof MarketingMessageTemplate
            && ($this->user()?->can('update', $template) ?? false);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'channel' => ['required', 'string', Rule::enum(MarketingMessageTemplateChannel::class)],
            'subject' => [
                Rule::requiredIf($this->input('channel') === MarketingMessageTemplateChannel::Email->value),
                'nullable',
                'string',
                'max:255',
            ],
            'body' => ['required', 'string', 'max:50000'],
            'meta_template_name' => [
                Rule::requiredIf($this->input('channel') === MarketingMessageTemplateChannel::WhatsApp->value),
                'nullable',
                'string',
                'max:255',
            ],
            'meta_template_language' => [
                Rule::requiredIf($this->input('channel') === MarketingMessageTemplateChannel::WhatsApp->value),
                'nullable',
                'string',
                'max:16',
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
            'body.required' => 'Le contenu du message est requis.',
            'meta_template_name.required' => 'Le nom du modèle Meta est requis pour WhatsApp.',
            'meta_template_language.required' => 'La langue du modèle Meta est requise.',
        ];
    }
}
