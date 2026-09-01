<?php

namespace App\Http\Middleware;

use App\Models\AccessLog;
use App\Services\AccessLogs\ResolveAccessLogClient;
use App\Support\AccessLogs\DescribeRequestActivity;
use App\Support\VisitTracking;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Journalise consultations GET et mutations réussies pour les utilisateurs authentifiés
 * sur le backoffice uniquement (pas le site marketing public).
 *
 * L'INSERT est différé en `terminating` pour ne pas ralentir la réponse.
 */
class RecordAccessLog
{
    public function __construct(
        private readonly DescribeRequestActivity $describeRequestActivity,
        private readonly ResolveAccessLogClient $resolveAccessLogClient,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $actor = $request->user();
        $response = $next($request);
        $actor = $actor ?? $request->user();

        if ($actor === null || ! $this->shouldRecord($request, $response)) {
            return $response;
        }

        $activity = $this->describeRequestActivity;
        $clientResolver = $this->resolveAccessLogClient;

        app()->terminating(function () use ($request, $actor, $activity, $clientResolver): void {
            try {
                $described = $activity->describe($request, $actor);

                if ($described === null) {
                    return;
                }

                $client = $clientResolver->fromRequest($request);

                AccessLog::query()->create([
                    'user_id' => $actor->id,
                    'kind' => $described['kind']->value,
                    'http_method' => strtoupper($request->method()),
                    'route_name' => $request->route()?->getName(),
                    'ip' => substr((string) $request->ip(), 0, 45),
                    'user_agent' => substr((string) $request->userAgent(), 0, 512) ?: null,
                    'browser' => $client['browser'],
                    'browser_version' => $client['browser_version'],
                    'platform' => $client['platform'],
                    'country_code' => $client['country_code'],
                    'country' => $client['country'],
                    'page' => substr($request->fullUrl(), 0, 2048),
                    'description' => $described['description'] ?? null,
                    'visited_at' => now(),
                ]);
            } catch (\Throwable) {
                // Journal non bloquant.
            }
        });

        return $response;
    }

    private function shouldRecord(Request $request, Response $response): bool
    {
        if ($response->getStatusCode() >= 400) {
            return false;
        }

        if ($this->isPrefetch($request)) {
            return false;
        }

        if ($request->hasSession() && $request->session()->has('errors')) {
            return false;
        }

        $path = $request->path();

        if ($path === 'up' || str_starts_with($path, 'access-logs')) {
            return false;
        }

        if (! VisitTracking::isAccessLogPath($path) && ! $this->isAuthAuditRoute($request)) {
            return false;
        }

        if (in_array($path, ['analytics/duration'], true)) {
            return false;
        }

        if ($request->is('storage/*', 'build/*', 'vendor/*')) {
            return false;
        }

        if ($request->isMethod('GET')) {
            if ($request->header('X-Inertia-Partial-Data')) {
                return false;
            }

            if ($request->expectsJson() && ! $request->header('X-Inertia')) {
                return false;
            }

            return true;
        }

        return in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'], true);
    }

    private function isPrefetch(Request $request): bool
    {
        if ($request->prefetch()) {
            return true;
        }

        return strcasecmp((string) $request->header('X-Inertia-Prefetch'), 'true') === 0;
    }

    /** Connexion / déconnexion / profil — journalisés même hors préfixe backoffice. */
    private function isAuthAuditRoute(Request $request): bool
    {
        return in_array($request->route()?->getName(), [
            'login',
            'login.store',
            'logout',
            'profile.update',
            'profile.destroy',
            'user-password.update',
        ], true);
    }
}
