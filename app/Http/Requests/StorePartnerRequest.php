<?php

namespace App\Http\Requests;

use App\Models\Partner;
use Illuminate\Foundation\Http\FormRequest;

class StorePartnerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Partner::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'logo' => ['required', 'image', 'max:5120'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:999'],
            'is_published' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom du partenaire est obligatoire.',
            'logo.required' => 'Le logo est obligatoire.',
            'logo.image' => 'Le fichier doit être une image.',
        ];
    }
}
