<?php

namespace App\Services\AccessLogs;

use App\Enums\AccessLogKind;
use App\Models\AccessLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/**
 * Construit la requête filtrée du journal d'accès (page complète et panneau global).
 */
final class BuildAccessLogQuery
{
    /** @var list<string> */
    private const SORTABLE_COLUMNS = [
        'visited_at',
        'description',
        'ip',
        'browser',
        'country',
        'http_method',
        'user',
    ];

    /** @var list<string> */
    private const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

    public function handle(Request $request, ?string $contextPath = null): Builder
    {
        $search = trim($request->string('search')->toString());
        $from = $request->string('from')->toString();
        $to = $request->string('to')->toString();
        $userUuid = $request->string('user')->toString();
        $kind = $request->string('kind')->toString();
        $ip = trim($request->string('ip')->toString());
        $country = trim($request->string('country')->toString());
        $browser = trim($request->string('browser')->toString());
        $method = strtoupper(trim($request->string('method')->toString()));
        $sortBy = $request->string('sort_by', 'visited_at')->toString();
        $sortDirection = $request->string('sort_direction', 'desc')->toString();
        $scope = $request->string('scope', 'all')->toString();

        if (! in_array($sortBy, self::SORTABLE_COLUMNS, true)) {
            $sortBy = 'visited_at';
        }

        if (! in_array($sortDirection, ['asc', 'desc'], true)) {
            $sortDirection = 'desc';
        }

        $query = AccessLog::query()->with('user:id,uuid,name,email');

        if ($from !== '') {
            $query->whereDate('visited_at', '>=', $from);
        }

        if ($to !== '') {
            $query->whereDate('visited_at', '<=', $to);
        }

        if ($userUuid !== '') {
            $userId = User::query()->where('uuid', $userUuid)->value('id');
            if ($userId) {
                $query->where('user_id', $userId);
            }
        }

        if ($kind !== '' && AccessLogKind::tryFrom($kind) !== null) {
            $query->where('kind', $kind);
        }

        if ($ip !== '') {
            $query->where('ip', 'like', '%'.$ip.'%');
        }

        if ($country !== '') {
            $query->where(function (Builder $inner) use ($country): void {
                $inner->where('country_code', $country)
                    ->orWhere('country', 'like', '%'.$country.'%');
            });
        }

        if ($browser !== '') {
            $query->where('browser', $browser);
        }

        if ($method !== '' && in_array($method, self::HTTP_METHODS, true)) {
            $query->where('http_method', $method);
        }

        if ($search !== '') {
            $term = '%'.$search.'%';
            $query->where(function ($inner) use ($term): void {
                $inner->where('description', 'like', $term)
                    ->orWhere('page', 'like', $term)
                    ->orWhere('ip', 'like', $term)
                    ->orWhere('browser', 'like', $term)
                    ->orWhere('browser_version', 'like', $term)
                    ->orWhere('platform', 'like', $term)
                    ->orWhere('country', 'like', $term)
                    ->orWhere('country_code', 'like', $term)
                    ->orWhere('http_method', 'like', $term)
                    ->orWhere('route_name', 'like', $term)
                    ->orWhere('user_agent', 'like', $term)
                    ->orWhereHas('user', fn ($user) => $user
                        ->where('name', 'like', $term)
                        ->orWhere('email', 'like', $term));
            });
        }

        if ($scope === 'page') {
            $path = $contextPath ?? $request->string('path')->toString();
            $query->forContext($path !== '' ? $path : $request->path());
        }

        $sortColumn = match ($sortBy) {
            'country' => 'country',
            'browser' => 'browser',
            'http_method' => 'http_method',
            'user' => 'user',
            default => $sortBy,
        };

        if ($sortColumn === 'user') {
            return $query->orderBy(
                User::query()
                    ->select('name')
                    ->whereColumn('users.id', 'access_logs.user_id')
                    ->limit(1),
                $sortDirection,
            );
        }

        return $query->orderBy($sortColumn, $sortDirection);
    }

    /**
     * @return list<string>
     */
    public static function filterKeys(): array
    {
        return [
            'search',
            'from',
            'to',
            'user',
            'kind',
            'ip',
            'country',
            'browser',
            'method',
            'sort_by',
            'sort_direction',
            'scope',
            'path',
            'per_page',
        ];
    }
}
