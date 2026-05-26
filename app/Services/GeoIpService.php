<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GeoIpService
{
    /** @var array<string, string> */
    private const COUNTRY_NAMES = [
        'GN' => 'Guinée',
        'FR' => 'France',
        'SN' => 'Sénégal',
        'CI' => "Côte d'Ivoire",
        'ML' => 'Mali',
        'US' => 'États-Unis',
        'GB' => 'Royaume-Uni',
        'DE' => 'Allemagne',
    ];

    /**
     * @return array{country_code: string, country: string}|null
     */
    public function resolve(?string $ip, ?string $cloudflareCountry = null): ?array
    {
        if ($cloudflareCountry !== null && strlen($cloudflareCountry) === 2) {
            $code = strtoupper($cloudflareCountry);

            return [
                'country_code' => $code,
                'country' => $this->countryNameFromCode($code),
            ];
        }

        if ($ip === null || $this->isPrivateOrLocalIp($ip)) {
            return null;
        }

        return Cache::remember("geoip:{$ip}", now()->addDays(7), fn () => $this->lookup($ip));
    }

    /**
     * @return array{country_code: string, country: string}|null
     */
    private function lookup(string $ip): ?array
    {
        try {
            $response = Http::timeout(3)
                ->get("http://ip-api.com/json/{$ip}", [
                    'fields' => 'status,country,countryCode',
                ]);

            if (! $response->successful() || $response->json('status') !== 'success') {
                return null;
            }

            $code = $response->json('countryCode');

            if (! is_string($code) || strlen($code) !== 2) {
                return null;
            }

            return [
                'country_code' => strtoupper($code),
                'country' => $response->json('country') ?? $this->countryNameFromCode($code),
            ];
        } catch (\Throwable) {
            return null;
        }
    }

    private function isPrivateOrLocalIp(string $ip): bool
    {
        return filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false;
    }

    private function countryNameFromCode(string $code): string
    {
        $code = strtoupper($code);

        if (extension_loaded('intl')) {
            $name = \Locale::getDisplayRegion('-'.$code, 'fr');

            if (is_string($name) && $name !== '' && $name !== '-'.$code) {
                return $name;
            }
        }

        return self::COUNTRY_NAMES[$code] ?? $code;
    }
}
