<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use App\Support\VisitTracking;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Visit::class);

        $period = (int) $request->query('period', 30);
        $period = in_array($period, [7, 14, 30, 90], strict: true) ? $period : 30;

        $from = Carbon::now()->subDays($period)->startOfDay();
        $to = Carbon::now()->endOfDay();

        $base = Visit::query()
            ->where('is_bot', false)
            ->whereBetween('created_at', [$from, $to]);

        $kpis = $this->kpis(clone $base, $period);
        $chartData = $this->chartData(clone $base, $period, $from);
        $topPages = $this->topPages(clone $base);
        $topReferrers = $this->topReferrers(clone $base);
        $browsers = $this->groupBy(clone $base, 'browser');
        $devices = $this->groupBy(clone $base, 'device');
        $platforms = $this->groupBy(clone $base, 'platform');
        $countries = $this->topCountries(clone $base);

        return Inertia::render('analytics/index', [
            'period' => $period,
            'kpis' => $kpis,
            'chartData' => $chartData,
            'topPages' => $topPages,
            'topReferrers' => $topReferrers,
            'countries' => $countries,
            'browsers' => $browsers,
            'devices' => $devices,
            'platforms' => $platforms,
        ]);
    }

    public function updateDuration(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => ['required', 'string', 'max:128'],
            'path' => ['required', 'string', 'max:2048'],
            'duration' => ['required', 'integer', 'min:1', 'max:86400'],
        ]);

        if (VisitTracking::isExcludedPath($validated['path'])) {
            return response()->json(['ok' => true]);
        }

        Visit::query()
            ->where('session_id', $validated['session_id'])
            ->where('path', $validated['path'])
            ->latest()
            ->limit(1)
            ->update([
                'duration_seconds' => $validated['duration'],
                'is_bounce' => $validated['duration'] < 30,
            ]);

        return response()->json(['ok' => true]);
    }

    /**
     * @param  Builder<Visit>  $base
     * @return array<string, mixed>
     */
    private function kpis($base, int $period): array
    {
        $prev = Visit::query()
            ->where('is_bot', false)
            ->whereBetween('created_at', [
                Carbon::now()->subDays($period * 2)->startOfDay(),
                Carbon::now()->subDays($period)->endOfDay(),
            ]);

        $total = (clone $base)->count();
        $prevTotal = (clone $prev)->count();

        $unique = (clone $base)->distinct('visitor_uuid')->count('visitor_uuid');
        $prevUnique = (clone $prev)->distinct('visitor_uuid')->count('visitor_uuid');

        $sessions = (clone $base)->distinct('session_id')->count('session_id');
        $prevSessions = (clone $prev)->distinct('session_id')->count('session_id');

        $avgDuration = (int) ((clone $base)->whereNotNull('duration_seconds')->avg('duration_seconds') ?? 0);
        $bounceRate = $total > 0 ? round((clone $base)->where('is_bounce', true)->count() * 100 / $total, 1) : 0;

        return [
            'total_views' => $total,
            'total_views_change' => $this->percentChange($prevTotal, $total),
            'unique_visitors' => $unique,
            'unique_visitors_change' => $this->percentChange($prevUnique, $unique),
            'sessions' => $sessions,
            'sessions_change' => $this->percentChange($prevSessions, $sessions),
            'avg_duration_seconds' => $avgDuration,
            'bounce_rate' => $bounceRate,
        ];
    }

    /**
     * @param  Builder<Visit>  $base
     * @return list<array{date: string, views: int, visitors: int}>
     */
    private function chartData($base, int $period, Carbon $from): array
    {
        $grouped = (clone $base)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as views'),
                DB::raw('COUNT(DISTINCT visitor_uuid) as visitors'),
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $days = [];
        for ($i = 0; $i <= $period; $i++) {
            $date = $from->copy()->addDays($i)->toDateString();
            $row = $grouped->get($date);
            $days[] = [
                'date' => $date,
                'views' => $row?->views ?? 0,
                'visitors' => $row?->visitors ?? 0,
            ];
        }

        return $days;
    }

    /**
     * @param  Builder<Visit>  $base
     * @return list<array{path: string, views: int, visitors: int}>
     */
    private function topPages($base): array
    {
        return (clone $base)
            ->select(
                'path',
                DB::raw('COUNT(*) as views'),
                DB::raw('COUNT(DISTINCT visitor_uuid) as visitors'),
            )
            ->groupBy('path')
            ->orderByDesc('views')
            ->limit(10)
            ->get()
            ->toArray();
    }

    /**
     * @param  Builder<Visit>  $base
     * @return list<array{referrer_domain: string, count: int}>
     */
    private function topReferrers($base): array
    {
        return (clone $base)
            ->select('referrer_domain', DB::raw('COUNT(*) as count'))
            ->whereNotNull('referrer_domain')
            ->where('referrer_domain', '!=', parse_url(config('app.url'), PHP_URL_HOST))
            ->groupBy('referrer_domain')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->toArray();
    }

    /**
     * @param  Builder<Visit>  $base
     * @return list<array{country_code: string, country: string, views: int, visitors: int, percentage: float}>
     */
    private function topCountries($base): array
    {
        $rows = (clone $base)
            ->select(
                'country_code',
                'country',
                DB::raw('COUNT(*) as views'),
                DB::raw('COUNT(DISTINCT visitor_uuid) as visitors'),
            )
            ->whereNotNull('country_code')
            ->groupBy('country_code', 'country')
            ->orderByDesc('views')
            ->limit(12)
            ->get();

        $total = $rows->sum('views');

        return $rows->map(fn ($row) => [
            'country_code' => $row->country_code,
            'country' => $row->country ?? $row->country_code,
            'views' => (int) $row->views,
            'visitors' => (int) $row->visitors,
            'percentage' => $total > 0 ? round($row->views * 100 / $total, 1) : 0,
        ])->toArray();
    }

    /**
     * @param  Builder<Visit>  $base
     * @return list<array{label: string, count: int, percentage: float}>
     */
    private function groupBy($base, string $column): array
    {
        $rows = (clone $base)
            ->select($column, DB::raw('COUNT(*) as count'))
            ->whereNotNull($column)
            ->groupBy($column)
            ->orderByDesc('count')
            ->limit(8)
            ->get();

        $total = $rows->sum('count');

        return $rows->map(fn ($row) => [
            'label' => $row->{$column} ?? 'Inconnu',
            'count' => $row->count,
            'percentage' => $total > 0 ? round($row->count * 100 / $total, 1) : 0,
        ])->toArray();
    }

    private function percentChange(int $old, int $new): ?float
    {
        if ($old === 0) {
            return null;
        }

        return round(($new - $old) * 100 / $old, 1);
    }
}
