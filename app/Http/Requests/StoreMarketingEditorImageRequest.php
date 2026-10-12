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
            'image.required' => bt('validation.image_required_alt'),
            'image.image' => bt('validation.image_image'),
            'image.max' => bt('validation.image_max_5mb'),
            'image.mimes' => bt('validation.image_mimes'),
        ];
    }
}
