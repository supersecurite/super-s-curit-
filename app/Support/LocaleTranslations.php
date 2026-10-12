<?php

namespace App\Support;

use Illuminate\Support\Facades\File;

/**
 * Charge les traductions JSON marketing pour le partage Inertia.
 */
final class LocaleTranslations
{
    /**
     * @return array<string, mixed>
     */
    public static function forLocale(?string $locale = null): array
    {
        $locale ??= app()->getLocale();
        $path = lang_path($locale.'.json');

        if (! File::exists($path)) {
            $fallback = lang_path(LocaleUrl::defaultLocale().'.json');

            if (! File::exists($fallback)) {
                return [];
            }

            $path = $fallback;
        }

        /** @var array<string, mixed> $decoded */
        $decoded = File::json($path);

        return $decoded;
    }
}
