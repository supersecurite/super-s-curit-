<?php

use App\Support\LocaleTranslations;
use App\Support\LocaleUrl;
use Illuminate\Support\Facades\Route;

if (! function_exists('localized_route')) {
    /**
     * Génère une URL de route localisée (préfixe /en si besoin).
     *
     * @param  array<string, mixed>|mixed  $parameters
     */
    function localized_route(string $name, mixed $parameters = [], bool $absolute = true, ?string $locale = null): string
    {
        $routeName = LocaleUrl::routeName($name, $locale);

        if (! Route::has($routeName)) {
            $routeName = $name;
        }

        return route($routeName, $parameters, $absolute);
    }
}

if (! function_exists('bt')) {
    /**
     * Traduction backoffice (lang/{locale}/backoffice.json) pour toasts / validation PHP.
     *
     * @param  array<string, string|int|float>  $replace
     */
    function bt(string $key, array $replace = [], ?string $fallback = null): string
    {
        $segments = explode('.', $key);
        $current = LocaleTranslations::loadBackoffice();

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
}
