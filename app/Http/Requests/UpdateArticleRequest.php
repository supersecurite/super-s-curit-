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
            'title_en' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in($allowedStatuses)],
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'excerpt_en' => ['nullable', 'string', 'max:1000'],
            'content' => ['nullable', 'string'],
            'content_en' => ['nullable', 'string'],
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
            'title.required' => bt('validation.title_required'),
            'status.required' => bt('validation.status_required'),
            'status.in' => bt('validation.status_in'),
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
            'status' => bt('validation.attr_status'),
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
