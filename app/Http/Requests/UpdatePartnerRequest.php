<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePartnerRequest extends FormRequest
{
    public function authorize(): bool
    {
        $partner = $this->route('partner');

        return $partner !== null
            && $this->user()?->can('update', $partner);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'logo' => ['sometimes', 'nullable', 'image', 'max:5120'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:999'],
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
            'logo.image' => 'Le fichier doit être une image.',
        ];
    }
}
