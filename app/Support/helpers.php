<?php

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
