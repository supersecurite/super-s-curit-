<?php

namespace App\Support;

class VisitTracking
{
    /** Technical / infrastructure paths (prefix match). */
    private const SYSTEM_EXCLUDED_PREFIXES = [
        'robots.txt',
        'sitemap.xml',
        'analytics/duration',
        '_debugbar',
        'api/',
        'up',
        'health',
        'livewire',
    ];

    /**
     * Backoffice paths — never counted in public visit analytics.
     *
     * @see routes/web.php authenticated admin routes
     * @see routes/settings.php
     */
    private const BACKOFFICE_PREFIXES = [
        'dashboard',
        'articles',
        'conseils',
        'gallery-images',
        'gallery-videos',
        'partners',
        'users',
        'candidatures-agents',
        'analytics',
        'settings',
    ];

    /** Auth pages (Fortify) — excluded from analytics. */
    private const AUTH_PATH_PREFIXES = [
        'login',
        'register',
        'forgot-password',
        'reset-password',
        'email/verify',
        'two-factor-challenge',
        'user/confirm-password',
        'passkey',
    ];

    public static function isExcludedPath(string $path): bool
    {
        $path = ltrim($path, '/');

        foreach ([...self::SYSTEM_EXCLUDED_PREFIXES, ...self::BACKOFFICE_PREFIXES] as $excluded) {
            if ($path === $excluded || str_starts_with($path, $excluded.'/')) {
                return true;
            }
        }

        foreach (self::AUTH_PATH_PREFIXES as $authPath) {
            if ($path === $authPath || str_starts_with($path, $authPath.'/')) {
                return true;
            }
        }

        return false;
    }
}
