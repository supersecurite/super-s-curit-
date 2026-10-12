<?php

namespace App\Http\Requests;

use App\Enums\ServiceId;
use App\Models\GalleryImage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGalleryImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', GalleryImage::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->input('service_id') === '' || $this->input('service_id') === 'general') {
            $this->merge(['service_id' => null]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'service_id' => ['nullable', Rule::enum(ServiceId::class)],
            'image' => ['required', 'image', 'max:5120'],
            'alt' => ['required', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:500'],
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
            'image.required' => bt('validation.image_required'),
            'image.image' => bt('validation.image_image'),
            'alt.required' => bt('validation.alt_text_required'),
        ];
    }
}
