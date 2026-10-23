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

        $language = strtolower($request->getLanguages()[0] ?? '');
        $detected = preg_match('/^fr(?:[_-]|$)/', $language) === 1 ? 'fr' : 'en';
        $previous = $request->cookie('browser_language');
        $changed = is_string($previous) && $previous !== $language;
        $entry = in_array($request->path(), ['/', 'en'], true);

        if ($request->isMethod('GET') && ($entry || ($changed && in_array(LocaleUrl::stripLocalePrefix($request->getPathInfo()), LocaleUrl::sitemapStaticPaths(), true)))) {
            $preferred = $request->cookie('locale');
            if ($previous === null || $changed || ! is_string($preferred) || ! LocaleUrl::isSupported($preferred)) {
                $preferred = $detected;
            }

            $target = LocaleUrl::localizePath($request->getPathInfo(), $preferred);
            if ($target !== $request->getPathInfo() && ($entry || ! str_contains($request->path(), '.'))) {
                $response = redirect($target.($request->getQueryString() ? '?'.$request->getQueryString() : ''));
                $response->headers->set('Vary', 'Accept-Language, Cookie');
                $response->headers->set('Cache-Control', 'private, no-store');
                $response->headers->setCookie(cookie('browser_language', $language, 525600));
                $response->headers->setCookie(cookie('locale', $preferred, 525600, '/', null, null, false));

                return $response;
            }
        }

        $resolved = $locale ?? $this->localeFromPath($request->path());

        if (! LocaleUrl::isSupported($resolved)) {
            $resolved = LocaleUrl::defaultLocale();
        }

        app()->setLocale($resolved);
        Carbon::setLocale($resolved);

        $response = $next($request);
        if ($previous === null || $changed) {
            $response->headers->setCookie(cookie('locale', $resolved, 525600, '/', null, null, false));
        }
        $response->headers->setCookie(cookie('browser_language', $language, 525600));

        return $response;
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
