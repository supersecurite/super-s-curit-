<?php

namespace App\Http\Requests;

use App\Enums\MarketingCampaignChannel;
use App\Enums\MarketingMessageTemplateChannel;
use App\Models\MarketingCampaign;
use App\Models\MarketingContact;
use App\Models\MarketingEmailAccount;
use App\Models\MarketingList;
use App\Models\MarketingMessageTemplate;
use App\Models\WhatsAppAccount;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateMarketingCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        $campaign = $this->route('marketing_campaign');

        return $campaign instanceof MarketingCampaign
            && ($this->user()?->can('update', $campaign) ?? false);
    }

    protected function prepareForValidation(): void
    {
        if ($this->input('channel') === MarketingCampaignChannel::WhatsApp->value) {
            $this->merge([
                'subject' => null,
                'body' => '',
            ]);
        }

        $this->merge([
            'list_uuids' => array_values(array_filter((array) $this->input('list_uuids', []))),
            'contact_uuids' => array_values(array_filter((array) $this->input('contact_uuids', []))),
        ]);
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
            'list_uuids' => ['nullable', 'array'],
            'list_uuids.*' => ['uuid', Rule::exists(MarketingList::class, 'uuid')],
            'contact_uuids' => ['nullable', 'array'],
            'contact_uuids.*' => ['uuid', Rule::exists(MarketingContact::class, 'uuid')],
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
            'marketing_email_account_id' => [
                Rule::requiredIf(! $isWhatsApp),
                'nullable',
                'integer',
                Rule::exists(MarketingEmailAccount::class, 'id')->where(fn ($query) => $query->where('is_active', true)),
            ],
            'subject' => [
                Rule::requiredIf(! $isWhatsApp),
                'nullable',
                'string',
                'max:255',
            ],
            'body' => [
                Rule::requiredIf(! $isWhatsApp),
                'nullable',
                'string',
                'max:50000',
            ],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $lists = (array) $this->input('list_uuids', []);
            $contacts = (array) $this->input('contact_uuids', []);

            if ($lists === [] && $contacts === []) {
                $validator->errors()->add(
                    'list_uuids',
                    'Sélectionnez au moins un groupe ou un contact.',
                );
            }

            if ($this->input('channel') !== MarketingCampaignChannel::WhatsApp->value) {
                return;
            }

            $templateId = $this->input('marketing_message_template_id');

            if (! filled($templateId)) {
                return;
            }

            $template = MarketingMessageTemplate::query()->find($templateId);

            if ($template === null) {
                return;
            }

            if ($template->channel !== MarketingMessageTemplateChannel::WhatsApp) {
                $validator->errors()->add(
                    'marketing_message_template_id',
                    'Le template doit être un template WhatsApp.',
                );
            }

            if (blank($template->meta_template_name)) {
                $validator->errors()->add(
                    'marketing_message_template_id',
                    'Le template sélectionné doit référencer un modèle Meta approuvé.',
                );
            }
        });
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de la campagne est requis.',
            'whatsapp_account_id.required' => 'Un compte WhatsApp actif est requis.',
            'marketing_email_account_id.required' => 'Un compte e-mail actif est requis.',
            'marketing_message_template_id.required' => 'Un template Meta WhatsApp est requis.',
            'subject.required' => 'L\'objet est requis.',
            'body.required' => 'Le contenu du message est requis.',
        ];
    }
}
