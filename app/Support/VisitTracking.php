<?php

namespace App\Support;

class VisitTracking
{
    /** Paths to never track (prefix match). */
    private const EXCLUDED_PREFIXES = [
        'robots.txt',
        'sitemap.xml',
        'analytics/duration',
        '_debugbar',
        'api/',
        'up',
        'health',
        'livewire',
        'dashboard',
        'users',
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

        foreach (self::EXCLUDED_PREFIXES as $excluded) {
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
