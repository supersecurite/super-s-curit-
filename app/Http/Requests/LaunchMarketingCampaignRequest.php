<?php

namespace App\Http\Requests;

use App\Models\MarketingCampaign;
use Illuminate\Foundation\Http\FormRequest;

class LaunchMarketingCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        $campaign = $this->route('marketing_campaign');

        return $campaign instanceof MarketingCampaign
            && ($this->user()?->can('send', $campaign) ?? false);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'scheduled_at' => ['nullable', 'date', 'after:now'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'scheduled_at.after' => 'La date de planification doit être dans le futur.',
        ];
    }
}
