<?php

namespace App\Http\Middleware;

use App\Support\BackofficeLocale;
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Applique la locale backoffice (session/cookie) hors site marketing public.
 */
class SetBackofficeLocale
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! BackofficeLocale::appliesToPath($request->path())) {
            return $next($request);
        }

        $locale = BackofficeLocale::resolveFromRequest($request);

        app()->setLocale($locale);
        Carbon::setLocale($locale);

        return $next($request);
    }
}
