<?php

namespace App\Http\Requests;

use App\Models\SecurityTip;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSecurityTipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', SecurityTip::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'title_en' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'excerpt_en' => ['nullable', 'string', 'max:1000'],
            'content' => ['nullable', 'string'],
            'content_en' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:2048'],
            'category' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'featured' => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => bt('validation.title_required'),
            'image.image' => bt('validation.image_image'),
            'image.max' => bt('validation.image_max'),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'title' => bt('validation.attr_title'),
            'excerpt' => bt('validation.attr_excerpt'),
            'content' => bt('validation.attr_content'),
            'image' => bt('validation.attr_image'),
            'category' => bt('validation.attr_category'),
            'tags' => bt('validation.attr_tags'),
            'featured' => bt('validation.attr_featured'),
            'published_at' => bt('validation.attr_published_at'),
        ];
    }
}
