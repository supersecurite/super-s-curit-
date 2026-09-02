<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMarketingEditorImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canAccessFeature('marketing_campaigns') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'image' => [
                'required',
                'file',
                'image',
                'max:5120',
                'mimes:jpeg,jpg,png,gif,webp',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'image.required' => 'Une image est requise.',
            'image.image' => 'Le fichier doit être une image.',
            'image.max' => 'L\'image ne peut pas dépasser 5 Mo.',
            'image.mimes' => 'Formats acceptés : JPEG, PNG, GIF, WebP.',
        ];
    }
}
