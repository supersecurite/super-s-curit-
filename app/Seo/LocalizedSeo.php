<?php

namespace App\Seo;

use App\Support\LocaleUrl;

/**
 * Résout les méta SEO selon la locale courante (FR = config/seo.php, EN = config/seo_en.php).
 */
final class LocalizedSeo
{
    /**
     * @return list<array<string, mixed>>
     */
    public static function pages(): array
    {
        return self::mergeByPath(
            config('seo.pages', []),
            self::override('pages', []),
        );
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function services(): array
    {
        return self::mergeByPath(
            config('seo.services', []),
            self::override('services', []),
        );
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function legalPages(): array
    {
        return self::mergeByPath(
            config('seo.legal_pages', []),
            self::override('legal_pages', []),
        );
    }

    /**
     * @return list<array{question: string, answer: string}>
     */
    public static function faqs(): array
    {
        $override = self::override('faqs');

        return is_array($override) ? $override : config('seo.faqs', []);
    }

    /**
     * FAQs d'un service (par path), localisées.
     *
     * @return list<array{question: string, answer: string}>
     */
    public static function serviceFaqs(string $path): array
    {
        $service = collect(self::services())->firstWhere('path', $path);

        return is_array($service['faqs'] ?? null) ? $service['faqs'] : [];
    }

    public static function defaultDescription(): string
    {
        $override = self::override('default_description');

        return is_string($override) && $override !== ''
            ? $override
            : (string) config('seo.default_description');
    }

    public static function organizationDescription(): string
    {
        $override = self::override('organization.description');

        return is_string($override) && $override !== ''
            ? $override
            : (string) config('seo.organization.description');
    }

    public static function organizationSlogan(): string
    {
        $override = self::override('organization.slogan');

        return is_string($override) && $override !== ''
            ? $override
            : (string) config('seo.organization.slogan');
    }

    public static function language(): string
    {
        return app()->getLocale();
    }

    public static function ogLocale(): string
    {
        return LocaleUrl::ogLocale();
    }

    private static function override(string $key, mixed $default = null): mixed
    {
        if (LocaleUrl::isDefault()) {
            return $default;
        }

        return config('seo_'.app()->getLocale().'.'.$key, $default);
    }

    /**
     * @param  list<array<string, mixed>>  $base
     * @param  list<array<string, mixed>>  $overrides
     * @return list<array<string, mixed>>
     */
    private static function mergeByPath(array $base, array $overrides): array
    {
        if ($overrides === []) {
            return $base;
        }

        $byPath = collect($overrides)->keyBy('path');

        return collect($base)
            ->map(function (array $item) use ($byPath): array {
                $path = $item['path'] ?? null;

                if ($path === null || ! $byPath->has($path)) {
                    return $item;
                }

                /** @var array<string, mixed> $override */
                $override = $byPath->get($path);

                return [...$item, ...$override, 'path' => $path];
            })
            ->values()
            ->all();
    }
}
