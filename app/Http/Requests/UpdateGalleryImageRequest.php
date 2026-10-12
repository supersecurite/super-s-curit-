<?php

namespace App\Http\Requests;

use App\Enums\ServiceId;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGalleryImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        $galleryImage = $this->route('gallery_image');

        return $galleryImage !== null
            && $this->user()?->can('update', $galleryImage);
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
            'service_id' => ['sometimes', 'nullable', Rule::enum(ServiceId::class)],
            'image' => ['sometimes', 'nullable', 'image', 'max:5120'],
            'alt' => ['sometimes', 'required', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:500'],
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
            'image.image' => bt('validation.image_image'),
            'alt.required' => bt('validation.alt_text_required'),
        ];
    }
}
