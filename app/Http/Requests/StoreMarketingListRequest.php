<?php

namespace App\Http\Requests;

use App\Models\MarketingList;
use Illuminate\Foundation\Http\FormRequest;

class StoreMarketingListRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', MarketingList::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de la liste est obligatoire.',
        ];
    }
}
