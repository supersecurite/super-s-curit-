<?php

namespace App\Http\Middleware;

use App\Enums\BackofficePermission;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasBackofficePermission
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next, string $feature, ?string $ability = null): Response
    {
        $user = $request->user();

        if ($user === null) {
            abort(403);
        }

        if ($ability !== null) {
            if (! $user->hasBackofficePermission(BackofficePermission::from("{$feature}.{$ability}"))) {
                abort(403);
            }
        } elseif (! $user->canAccessFeature($feature)) {
            abort(403);
        }

        return $next($request);
    }
}
