<?php

namespace App\Http\Middleware;

use App\Support\BackofficeLocale;
use App\Support\LocaleUrl;
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Fixe la locale applicative pour le site public à partir de l'URL (/en/… → en).
 *
 * Ignoré sur backoffice / auth / settings (gérés par SetBackofficeLocale).
 */
class SetLocaleFromUrl
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ?string $locale = null): Response
    {
        if (BackofficeLocale::appliesToPath($request->path())) {
            return $next($request);
        }

        $resolved = $locale ?? $this->localeFromPath($request->path());

        if (! LocaleUrl::isSupported($resolved)) {
            $resolved = LocaleUrl::defaultLocale();
        }

        app()->setLocale($resolved);
        Carbon::setLocale($resolved);

        return $next($request);
    }

    private function localeFromPath(string $path): string
    {
        $segment = explode('/', ltrim($path, '/'))[0] ?? '';

        if ($segment !== '' && LocaleUrl::isSupported($segment) && $segment !== LocaleUrl::defaultLocale()) {
            return $segment;
        }

        return LocaleUrl::defaultLocale();
    }
}
