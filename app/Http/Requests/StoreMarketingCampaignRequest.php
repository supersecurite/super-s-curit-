<?php

namespace App\Http\Requests;

use App\Enums\MarketingCampaignChannel;
use App\Models\MarketingCampaign;
use App\Models\MarketingList;
use App\Models\MarketingMessageTemplate;
use App\Models\WhatsAppAccount;
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
        $isWhatsApp = $this->input('channel') === MarketingCampaignChannel::WhatsApp->value;

        return [
            'name' => ['required', 'string', 'max:255'],
            'channel' => ['required', 'string', Rule::enum(MarketingCampaignChannel::class)],
            'marketing_list_id' => ['required', 'integer', Rule::exists(MarketingList::class, 'id')],
            'marketing_message_template_id' => [
                Rule::requiredIf($isWhatsApp),
                'nullable',
                'integer',
                Rule::exists(MarketingMessageTemplate::class, 'id'),
            ],
            'whatsapp_account_id' => [
                Rule::requiredIf($isWhatsApp),
                'nullable',
                'integer',
                Rule::exists(WhatsAppAccount::class, 'id')->where(fn ($query) => $query->where('is_active', true)),
            ],
            'subject' => [
                Rule::requiredIf(! $isWhatsApp),
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
            'name.required' => 'Le nom de la campagne est requis.',
            'marketing_list_id.required' => 'Le groupe est requis.',
            'whatsapp_account_id.required' => 'Un compte WhatsApp actif est requis.',
            'marketing_message_template_id.required' => 'Un template WhatsApp est requis.',
            'subject.required' => 'L\'objet est requis.',
            'body.required' => 'Le contenu du message est requis.',
        ];
    }
}
