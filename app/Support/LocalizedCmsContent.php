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
 *     has_english: bool,
 *     has_chinese: bool
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
        $hasEnglish = filled($model->title_en);
        $hasChinese = filled($model->title_zh);

        if ($locale === 'en' && $hasEnglish) {
            return [
                'title' => (string) $model->title_en,
                'excerpt' => $model->excerpt_en ?? $model->excerpt,
                'content' => filled($model->content_en) ? $model->content_en : $model->content,
                'is_fallback' => false,
                'has_english' => true,
                'has_chinese' => $hasChinese,
            ];
        }

        if ($locale === 'zh' && $hasChinese) {
            return [
                'title' => (string) $model->title_zh,
                'excerpt' => $model->excerpt_zh ?? $model->excerpt,
                'content' => filled($model->content_zh) ? $model->content_zh : $model->content,
                'is_fallback' => false,
                'has_english' => $hasEnglish,
                'has_chinese' => true,
            ];
        }

        return [
            'title' => (string) $model->title,
            'excerpt' => $model->excerpt,
            'content' => $model->content,
            'is_fallback' => $locale !== LocaleUrl::defaultLocale(),
            'has_english' => $hasEnglish,
            'has_chinese' => $hasChinese,
        ];
    }

    public static function hasEnglishTranslation(Article|SecurityTip $model): bool
    {
        return filled($model->title_en);
    }

    public static function hasChineseTranslation(Article|SecurityTip $model): bool
    {
        return filled($model->title_zh);
    }
}
