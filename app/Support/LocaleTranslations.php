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
     * Résout une clé dot-notation dans lang/{locale}.json.
     *
     * @param  array<string, string|int|float>  $replace
     */
    public static function trans(string $key, array $replace = [], ?string $fallback = null, ?string $locale = null): string
    {
        $segments = explode('.', $key);
        $current = self::loadMarketing($locale);

        foreach ($segments as $segment) {
            if (! is_array($current) || ! array_key_exists($segment, $current)) {
                $current = null;
                break;
            }

            $current = $current[$segment];
        }

        $value = is_string($current) ? $current : ($fallback ?? $key);

        foreach ($replace as $search => $replacement) {
            $value = str_replace(
                [':'.$search, '{'.$search.'}'],
                [(string) $replacement, (string) $replacement],
                $value,
            );
        }

        return $value;
    }

    /**
     * Résout une clé dot-notation dans lang/{locale}/backoffice.json.
     *
     * @param  array<string, string|int|float>  $replace
     */
    public static function backoffice(string $key, array $replace = [], ?string $fallback = null): string
    {
        $segments = explode('.', $key);
        $current = self::loadBackoffice();

        foreach ($segments as $segment) {
            if (! is_array($current) || ! array_key_exists($segment, $current)) {
                $current = null;
                break;
            }

            $current = $current[$segment];
        }

        $value = is_string($current) ? $current : ($fallback ?? $key);

        foreach ($replace as $search => $replacement) {
            $value = str_replace(
                [':'.$search, '{'.$search.'}'],
                [(string) $replacement, (string) $replacement],
                $value,
            );
        }

        return $value;
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
