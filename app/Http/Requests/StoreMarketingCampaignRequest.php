<?php

namespace App\Http\Requests;

use App\Models\MarketingCampaign;
use App\Models\MarketingList;
use App\Models\MarketingMessageTemplate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMarketingCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', MarketingCampaign::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'marketing_list_id' => ['required', 'integer', Rule::exists(MarketingList::class, 'id')],
            'marketing_message_template_id' => ['nullable', 'integer', Rule::exists(MarketingMessageTemplate::class, 'id')],
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:50000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de la campagne est requis.',
            'marketing_list_id.required' => 'La liste de diffusion est requise.',
            'subject.required' => 'L\'objet est requis.',
            'body.required' => 'Le contenu du message est requis.',
        ];
    }
}
