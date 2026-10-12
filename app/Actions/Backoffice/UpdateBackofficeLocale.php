<?php

namespace App\Actions\Backoffice;

use App\Actions\Action;
use App\Support\BackofficeLocale;
use App\Support\LocaleUrl;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Cookie;

/**
 * Persiste la locale UI backoffice en session + cookie.
 */
class UpdateBackofficeLocale extends Action
{
    public function handle(Request $request, string $locale): Cookie
    {
        if (! LocaleUrl::isSupported($locale)) {
            $locale = LocaleUrl::defaultLocale();
        }

        $request->session()->put(BackofficeLocale::SESSION_KEY, $locale);

        return cookie(
            BackofficeLocale::COOKIE_NAME,
            $locale,
            (int) (BackofficeLocale::COOKIE_MAX_AGE / 60),
            '/',
            null,
            null,
            false,
            false,
            'lax',
        );
    }
}
