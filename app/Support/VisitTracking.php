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
        'marketing-clients',
        'marketing-lists',
        'marketing-templates',
        'marketing-campaigns',
        'marketing-email-accounts',
        'marketing-whatsapp-accounts',
        'access-logs',
        'marketing',
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

    /**
     * Chemins backoffice + paramètres compte — seuls éligibles au journal d'accès.
     *
     * Exclut le site marketing public (/, /actualites, /contact, …) même si l'utilisateur est connecté.
     */
    public static function isAccessLogPath(string $path): bool
    {
        $path = ltrim($path, '/');

        if ($path === 'settings' || str_starts_with($path, 'settings/')) {
            return true;
        }

        foreach (self::BACKOFFICE_PREFIXES as $prefix) {
            if ($path === $prefix || str_starts_with($path, $prefix.'/')) {
                return true;
            }
        }

        return false;
    }
}
