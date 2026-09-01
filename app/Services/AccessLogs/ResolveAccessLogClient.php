<?php

namespace App\Services\AccessLogs;

use App\Services\GeoIpService;
use Illuminate\Http\Request;
use Jenssegers\Agent\Agent;

/**
 * Extrait navigateur et géolocalisation IP pour une entrée du journal d'accès.
 */
class ResolveAccessLogClient
{
    public function __construct(
        private GeoIpService $geoIp,
    ) {}

    /**
     * @return array{
     *     browser: string|null,
     *     browser_version: string|null,
     *     platform: string|null,
     *     country_code: string|null,
     *     country: string|null
     * }
     */
    public function fromRequest(Request $request): array
    {
        $agent = new Agent;
        $agent->setUserAgent($request->userAgent() ?? '');

        $browser = $agent->browser() ?: null;
        $browserVersion = $browser ? ($agent->version($browser) ?: null) : null;
        $platform = $agent->platform() ?: null;

        $geo = $this->geoIp->resolve(
            $request->ip(),
            $request->header('CF-IPCountry'),
            $request->header('CF-IPCity'),
        );

        return [
            'browser' => $browser,
            'browser_version' => $browserVersion,
            'platform' => $platform,
            'country_code' => $geo['country_code'] ?? null,
            'country' => $geo['country'] ?? null,
        ];
    }
}
