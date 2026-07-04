<?php

namespace App\Http\Requests;

use App\Enums\ServiceId;
use App\Models\GalleryVideo;
use App\Support\YoutubeUrl;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGalleryVideoRequest extends FormRequest
{
    public function authorize(): bool
    {
        $galleryVideo = $this->route('gallery_video');

        return $galleryVideo instanceof GalleryVideo
            && ($this->user()?->can('update', $galleryVideo) ?? false);
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
            'youtube_url' => [
                'required',
                'string',
                'max:500',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (! YoutubeUrl::isValid(is_string($value) ? $value : null)) {
                        $fail('Le lien YouTube n’est pas valide.');
                    }
                },
            ],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
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
            'youtube_url.required' => 'Le lien YouTube est obligatoire.',
            'title.required' => 'Le titre est obligatoire.',
        ];
    }
}
