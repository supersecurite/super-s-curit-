<?php

namespace App\Http\Requests;

use App\Models\MarketingContact;
use Illuminate\Foundation\Http\FormRequest;

class ImportMarketingContactsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('import', MarketingContact::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:5120'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'file.required' => 'Veuillez sélectionner un fichier CSV.',
            'file.mimes' => 'Le fichier doit être au format CSV.',
        ];
    }
}
