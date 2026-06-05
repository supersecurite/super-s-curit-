<?php

namespace App\Http\Requests;

use App\Enums\ArticleStatus;
use App\Models\SecurityTip;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSecurityTipRequest extends FormRequest
{
    public function authorize(): bool
    {
        $securityTip = $this->route('conseil');

        return $securityTip instanceof SecurityTip
            && ($this->user()?->can('update', $securityTip) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::enum(ArticleStatus::class)],
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'content' => ['nullable', 'string'],
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
            'title.required' => 'Le titre est obligatoire.',
            'status.required' => 'Le statut est obligatoire.',
            'image.image' => 'Le fichier doit être une image.',
            'image.max' => 'L\'image ne doit pas dépasser 2 Mo.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'title' => 'titre',
            'status' => 'statut',
            'excerpt' => 'résumé',
            'content' => 'contenu',
            'image' => 'image',
            'category' => 'catégorie',
            'tags' => 'tags',
            'featured' => 'à la une',
            'published_at' => 'date de publication',
        ];
    }
}
