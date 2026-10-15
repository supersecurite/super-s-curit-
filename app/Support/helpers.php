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
        return LocaleTranslations::backoffice($key, $replace, $fallback);
    }
}
