<?php

namespace App\Http\Requests;

use App\Models\JobOffer;
use Illuminate\Foundation\Http\FormRequest;

class UpdateJobOfferRequest extends FormRequest
{
    public function authorize(): bool
    {
        $offer = $this->route('offres_emploi');

        return $offer instanceof JobOffer
            && ($this->user()?->can('update', $offer) ?? false);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'title_en' => ['nullable', 'string', 'max:255'],
            'title_zh' => ['nullable', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'location_en' => ['nullable', 'string', 'max:255'],
            'location_zh' => ['nullable', 'string', 'max:255'],
            'contract_type' => ['required', 'string', 'max:100'],
            'contract_type_en' => ['nullable', 'string', 'max:100'],
            'contract_type_zh' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],
            'description_zh' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
