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
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le titre interne est requis.',
            'subject.required' => 'L\'objet est requis pour un modèle e-mail.',
            'body.required' => 'Le contenu du message est requis.',
        ];
    }
}
