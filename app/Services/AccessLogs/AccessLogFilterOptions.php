<?php

namespace App\Services\AccessLogs;

use App\Models\AccessLog;

/**
 * Valeurs distinctes pour les filtres du journal d'accès (pays, navigateurs).
 */
final class AccessLogFilterOptions
{
    /**
     * @return array{
     *     countries: list<array{code: string, label: string}>,
     *     browsers: list<string>,
     *     methods: list<string>
     * }
     */
    public function handle(): array
    {
        $countries = AccessLog::query()
            ->select(['country_code', 'country'])
            ->whereNotNull('country_code')
            ->where('country_code', '!=', '')
            ->distinct()
            ->orderBy('country')
            ->get()
            ->map(fn (AccessLog $log): array => [
                'code' => (string) $log->country_code,
                'label' => (string) ($log->country ?: $log->country_code),
            ])
            ->unique('code')
            ->values()
            ->all();

        $browsers = AccessLog::query()
            ->whereNotNull('browser')
            ->where('browser', '!=', '')
            ->distinct()
            ->orderBy('browser')
            ->pluck('browser')
            ->map(fn (?string $browser): string => (string) $browser)
            ->values()
            ->all();

        return [
            'countries' => $countries,
            'browsers' => $browsers,
            'methods' => ['DELETE', 'GET', 'PATCH', 'POST', 'PUT'],
        ];
    }
}
