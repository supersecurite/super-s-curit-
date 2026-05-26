<?php

namespace App\Http\Middleware;

use App\Models\Visit;
use App\Services\GeoIpService;
use App\Support\VisitTracking;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Jenssegers\Agent\Agent;
use Symfony\Component\HttpFoundation\Response;

class TrackVisit
{
    private const VISITOR_COOKIE = 'aristech_vid';

    private const COOKIE_TTL_DAYS = 365;

    public function __construct(private GeoIpService $geoIp) {}

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($this->shouldTrack($request, $response)) {
            $this->record($request);
        }

        return $response;
    }

    private function shouldTrack(Request $request, Response $response): bool
    {
        if (! $request->isMethod('GET')) {
            return false;
        }

        if ($response->getStatusCode() >= 400) {
            return false;
        }

        // Inertia XHR partial requests share the same visit → skip to avoid double count
        if ($request->header('X-Inertia') && $request->header('X-Inertia-Partial-Data')) {
            return false;
        }

        if (VisitTracking::isExcludedPath($request->path())) {
            return false;
        }

        return true;
    }

    private function record(Request $request): void
    {
        try {
            $agent = new Agent;
            $agent->setUserAgent($request->userAgent() ?? '');

            $isBot = $agent->isRobot();

            $visitorUuid = $request->cookie(self::VISITOR_COOKIE) ?? (string) Str::uuid();
            $sessionId = $request->session()->getId();

            $referrer = $request->headers->get('referer');
            $referrerDomain = $referrer ? parse_url($referrer, PHP_URL_HOST) : null;

            $device = match (true) {
                $isBot => 'bot',
                $agent->isTablet() => 'tablet',
                $agent->isMobile() => 'mobile',
                default => 'desktop',
            };

            $browser = $agent->browser() ?: null;
            $browserVersion = $browser ? ($agent->version($browser) ?: null) : null;
            $platform = $agent->platform() ?: null;

            $queryString = $request->getQueryString();

            $geo = $this->geoIp->resolve(
                $request->ip(),
                $request->header('CF-IPCountry'),
            );

            Visit::create([
                'visitor_uuid' => $visitorUuid,
                'session_id' => $sessionId,
                'user_id' => $request->user()?->id,
                'path' => '/'.ltrim($request->path(), '/'),
                'url' => $request->fullUrl(),
                'query_string' => $queryString,
                'referrer' => $referrer,
                'referrer_domain' => $referrerDomain,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'browser' => $browser,
                'browser_version' => $browserVersion,
                'platform' => $platform,
                'device' => $device,
                'country_code' => $geo !== null ? $geo['country_code'] : null,
                'country' => $geo !== null ? $geo['country'] : null,
                'is_bot' => $isBot,
                'is_bounce' => true,
            ]);

            // Set/refresh the visitor UUID cookie (1 year)
            cookie()->queue(
                cookie(self::VISITOR_COOKIE, $visitorUuid, 60 * 24 * self::COOKIE_TTL_DAYS, '/', null, true, false, false, 'Lax'),
            );
        } catch (\Throwable) {
            // Never break the request because of tracking
        }
    }
}
