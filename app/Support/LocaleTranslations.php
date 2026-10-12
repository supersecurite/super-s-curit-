<?php

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

/**
 * Charge les traductions JSON pour le partage Inertia (marketing ou backoffice).
 */
final class LocaleTranslations
{
    /**
     * @return array<string, mixed>
     */
    public static function forRequest(Request $request, ?string $locale = null): array
    {
        $locale ??= app()->getLocale();

        if (BackofficeLocale::appliesToPath($request->path())) {
            return self::loadBackoffice($locale);
        }

        return self::loadMarketing($locale);
    }

    /**
     * @return array<string, mixed>
     */
    public static function forLocale(?string $locale = null): array
    {
        return self::loadMarketing($locale);
    }

    /**
     * @return array<string, mixed>
     */
    public static function loadMarketing(?string $locale = null): array
    {
        $locale ??= app()->getLocale();

        return self::loadJson(lang_path($locale.'.json'), lang_path(LocaleUrl::defaultLocale().'.json'));
    }

    /**
     * @return array<string, mixed>
     */
    public static function loadBackoffice(?string $locale = null): array
    {
        $locale ??= app()->getLocale();

        return self::loadJson(
            lang_path($locale.'/backoffice.json'),
            lang_path(LocaleUrl::defaultLocale().'/backoffice.json'),
        );
    }

    /**
     * @return array<string, mixed>
     */
    private static function loadJson(string $path, string $fallback): array
    {
        if (! File::exists($path)) {
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
