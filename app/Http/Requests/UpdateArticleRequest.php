<?php

namespace App\Http\Requests;

use App\Enums\ArticleStatus;
use App\Models\Article;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        $article = $this->route('article');

        return $article instanceof Article
            && ($this->user()?->can('update', $article) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Article $article */
        $article = $this->route('article');
        $user = $this->user();

        $allowedStatuses = ArticleStatus::authorEditableValues();

        if ($user !== null && ! $user->isAdmin()) {
            if ($article->status === ArticleStatus::Published) {
                $allowedStatuses[] = ArticleStatus::Published->value;
            }

            if ($article->status === ArticleStatus::Rejected) {
                $allowedStatuses[] = ArticleStatus::Rejected->value;
            }
        } else {
            $allowedStatuses = ArticleStatus::values();
        }

        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in($allowedStatuses)],
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'content' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:2048'],
            'category' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
        ];

        if ($user !== null && $user->isAdmin()) {
            $rules['featured'] = ['nullable', 'boolean'];
            $rules['published_at'] = ['nullable', 'date'];
        }

        return $rules;
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Le titre est obligatoire.',
            'status.required' => 'Le statut est obligatoire.',
            'status.in' => 'Ce statut n\'est pas autorisé.',
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
