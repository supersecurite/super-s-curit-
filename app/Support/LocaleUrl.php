<?php

namespace App\Support;

use Illuminate\Support\Facades\Route;

/**
 * URLs localisées du site public (FR sans préfixe, EN avec /en).
 */
final class LocaleUrl
{
    public static function defaultLocale(): string
    {
        return (string) config('locales.default', 'fr');
    }

    /**
     * @return list<string>
     */
    public static function supported(): array
    {
        return array_values(config('locales.supported', ['fr']));
    }

    public static function isSupported(string $locale): bool
    {
        return in_array($locale, self::supported(), true);
    }

    public static function isDefault(?string $locale = null): bool
    {
        return ($locale ?? app()->getLocale()) === self::defaultLocale();
    }

    public static function prefixFor(string $locale): string
    {
        if ($locale === self::defaultLocale()) {
            return '';
        }

        return (string) (config('locales.url_prefixes.'.$locale) ?? $locale);
    }

    /**
     * Chemin sans préfixe de locale (/en/contact → /contact).
     */
    public static function stripLocalePrefix(string $path): string
    {
        $path = '/'.ltrim($path, '/');
        $path = $path === '/' ? '/' : rtrim($path, '/');

        foreach (self::supported() as $locale) {
            if ($locale === self::defaultLocale()) {
                continue;
            }

            $prefix = '/'.self::prefixFor($locale);

            if ($path === $prefix) {
                return '/';
            }

            if (str_starts_with($path, $prefix.'/')) {
                $stripped = substr($path, strlen($prefix));

                return $stripped === '' ? '/' : $stripped;
            }
        }

        return $path;
    }

    /**
     * Localise un chemin logique (sans préfixe) pour une locale.
     */
    public static function localizePath(string $path, ?string $locale = null): string
    {
        $locale ??= app()->getLocale();
        $path = self::stripLocalePrefix($path);
        $path = $path === '/' ? '/' : '/'.trim($path, '/');

        if (! self::isSupported($locale) || self::isDefault($locale)) {
            return $path;
        }

        $prefix = self::prefixFor($locale);

        return $path === '/' ? '/'.$prefix : '/'.$prefix.$path;
    }

    /**
     * URL absolue localisée.
     */
    public static function absolute(string $path, ?string $locale = null): string
    {
        $siteUrl = rtrim((string) config('app.url'), '/');
        $localized = self::localizePath($path, $locale);

        return $siteUrl.($localized === '/' ? '/' : $localized);
    }

    /**
     * Alternates hreflang : fr, en, x-default (→ FR).
     *
     * @return array<string, string> locale => absolute URL
     */
    public static function alternateUrls(string $path): array
    {
        $path = self::stripLocalePrefix($path);
        $urls = [];

        foreach (self::supported() as $locale) {
            $urls[$locale] = self::absolute($path, $locale);
        }

        $urls['x-default'] = self::absolute($path, self::defaultLocale());

        return $urls;
    }

    public static function ogLocale(?string $locale = null): string
    {
        $locale ??= app()->getLocale();

        return (string) config('locales.og_locales.'.$locale, config('seo.locale', 'fr_FR'));
    }

    /**
     * @return list<string>
     */
    public static function ogLocaleAlternates(?string $current = null): array
    {
        $current ??= app()->getLocale();

        return collect(self::supported())
            ->reject(fn (string $locale): bool => $locale === $current)
            ->map(fn (string $locale): string => self::ogLocale($locale))
            ->values()
            ->all();
    }

    /**
     * Pages statiques / services / légales à dupliquer dans le sitemap EN.
     *
     * @return list<string>
     */
    /**
     * Pages statiques / services / légales à dupliquer dans le sitemap EN.
     *
     * @return list<string>
     */
    public static function sitemapStaticPaths(): array
    {
        $paths = collect(config('seo.pages', []))
            ->pluck('path')
            ->merge(collect(config('seo.services', []))->pluck('path'))
            ->merge(collect(config('seo.legal_pages', []))->pluck('path'))
            ->filter()
            ->unique()
            ->values()
            ->all();

        return array_values($paths);
    }

    /**
     * Nom de route localisé (home → en.home) ou fallback FR.
     */
    public static function routeName(string $name, ?string $locale = null): string
    {
        $locale ??= app()->getLocale();

        if (! self::isDefault($locale)) {
            $localizedName = $locale.'.'.$name;

            if (Route::has($localizedName)) {
                return $localizedName;
            }
        }

        return $name;
    }
}
