<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AccessLog;
use App\Models\User;
use App\Services\AccessLogs\AccessLogFilterOptions;
use App\Services\AccessLogs\BuildAccessLogQuery;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccessLogController extends Controller
{
    public function index(
        Request $request,
        BuildAccessLogQuery $buildQuery,
        AccessLogFilterOptions $filterOptions,
    ): Response {
        $this->authorize('viewAny', AccessLog::class);

        $perPage = min(max((int) $request->input('per_page', 20), 5), 50);

        $logs = $buildQuery->handle($request)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (AccessLog $log) => $log->toFeedArray());

        return Inertia::render('access-logs/index', [
            'logs' => $logs,
            'users' => $this->filterUsers(),
            'filterOptions' => $filterOptions->handle(),
            'filters' => $request->only(BuildAccessLogQuery::filterKeys()),
        ]);
    }

    /**
     * Flux JSON paginé pour l'accordéon d'historique (filtres identiques à la page complète).
     */
    public function feed(
        Request $request,
        BuildAccessLogQuery $buildQuery,
        AccessLogFilterOptions $filterOptions,
    ): JsonResponse {
        $this->authorize('viewAny', AccessLog::class);

        $contextPath = $request->string('path')->toString();
        $perPage = min(max((int) $request->input('per_page', 15), 5), 50);

        $logs = $buildQuery->handle(
            $request,
            $contextPath !== '' ? $contextPath : null,
        )
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (AccessLog $log) => $log->toFeedArray());

        return response()->json([
            'logs' => $logs,
            'users' => $this->filterUsers(),
            'filterOptions' => $filterOptions->handle(),
            'filters' => $request->only(BuildAccessLogQuery::filterKeys()),
        ]);
    }

    /**
     * @return Collection<int, User>
     */
    private function filterUsers()
    {
        return User::query()->orderBy('name')->limit(80)->get(['uuid', 'name', 'email']);
    }
}
