<?php

namespace App\Support;

use Illuminate\Http\Request;

/**
 * Locale UI du backoffice / auth / settings (session + cookie, hors URL).
 *
 * @see docs/decisions/0006-backoffice-locale-session.md
 */
final class BackofficeLocale
{
    public const SESSION_KEY = 'backoffice_locale';

    public const COOKIE_NAME = 'backoffice_locale';

    public const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

    /**
     * Chemins où la locale session/cookie s'applique (pas le préfixe URL /en).
     */
    public static function appliesToPath(string $path): bool
    {
        $path = ltrim($path, '/');

        if ($path === 'settings' || str_starts_with($path, 'settings/')) {
            return true;
        }

        if ($path === 'backoffice/locale' || str_starts_with($path, 'backoffice/')) {
            return true;
        }

        return VisitTracking::isExcludedPath($path)
            && ! self::isSystemOnlyPath($path);
    }

    /**
     * Exclut robots/sitemap/webhooks/health du périmètre locale backoffice.
     */
    private static function isSystemOnlyPath(string $path): bool
    {
        $system = [
            'robots.txt',
            'sitemap.xml',
            'analytics/duration',
            '_debugbar',
            'api/',
            'up',
            'health',
            'livewire',
            'c/o/',
            'webhooks/',
        ];

        foreach ($system as $prefix) {
            if ($path === rtrim($prefix, '/') || str_starts_with($path, $prefix)) {
                return true;
            }
        }

        return false;
    }

    public static function resolveFromRequest(Request $request): string
    {
        $candidates = [];

        if ($request->hasSession()) {
            try {
                $candidates[] = $request->session()->get(self::SESSION_KEY);
            } catch (\RuntimeException) {
                // Session resolver present but store not started yet.
            }
        }

        $candidates[] = $request->cookie(self::COOKIE_NAME);

        foreach ($candidates as $candidate) {
            if (is_string($candidate) && LocaleUrl::isSupported($candidate)) {
                return $candidate;
            }
        }

        $language = strtolower($request->getLanguages()[0] ?? '');

        return preg_match('/^fr(?:[_-]|$)/', $language) === 1 ? 'fr' : 'en';
    }
}
