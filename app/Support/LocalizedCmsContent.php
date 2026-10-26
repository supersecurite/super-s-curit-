<?php

namespace App\Support;

use App\Models\Article;
use App\Models\SecurityTip;

/**
 * Résout titre / extrait / contenu CMS pour la locale courante (fallback FR).
 *
 * @phpstan-type LocalizedFields array{
 *     title: string,
 *     excerpt: string|null,
 *     content: string|null,
 *     is_fallback: bool,
 *     has_english: bool
 * }
 */
final class LocalizedCmsContent
{
    /**
     * @return LocalizedFields
     */
    public static function for(Article|SecurityTip $model, ?string $locale = null): array
    {
        $locale ??= app()->getLocale();
        $wantsEnglish = $locale === 'en';
        $hasEnglish = filled($model->title_en);

        if ($wantsEnglish && $hasEnglish) {
            return [
                'title' => (string) $model->title_en,
                'excerpt' => $model->excerpt_en ?? $model->excerpt,
                'content' => filled($model->content_en) ? $model->content_en : $model->content,
                'is_fallback' => false,
                'has_english' => true,
            ];
        }

        return [
            'title' => (string) $model->title,
            'excerpt' => $model->excerpt,
            'content' => $model->content,
            'is_fallback' => $locale !== LocaleUrl::defaultLocale(),
            'has_english' => $hasEnglish,
        ];
    }

    public static function hasEnglishTranslation(Article|SecurityTip $model): bool
    {
        return filled($model->title_en);
    }
}
