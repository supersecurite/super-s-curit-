<?php

namespace App\Http\Exceptions;

use App\Support\SuperSecuriteSharedData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class MarketingErrorRenderer
{
    /**
     * @var list<int>
     */
    private const RENDERABLE_STATUSES = [403, 404, 500, 503];

    public function __invoke(Response $response, Throwable $exception, Request $request): Response
    {
        if (! $this->shouldRender($response, $request)) {
            return $response;
        }

        $status = $response->getStatusCode();

        $authenticatedUser = $request->hasSession() ? $request->user() : null;

        Inertia::share([
            'superSecurite' => SuperSecuriteSharedData::contact(),
            'auth' => [
                'user' => $authenticatedUser !== null
                    ? SuperSecuriteSharedData::authUser($authenticatedUser)
                    : null,
            ],
            'name' => config('app.name'),
        ]);

        return Inertia::render('errors/'.$status, [
            'status' => $status,
        ])
            ->toResponse($request)
            ->setStatusCode($status);
    }

    private function shouldRender(Response $response, Request $request): bool
    {
        if (! in_array($response->getStatusCode(), self::RENDERABLE_STATUSES, true)) {
            return false;
        }

        if ($request->expectsJson()) {
            return false;
        }

        if (str_starts_with($request->path(), 'broadcasting/')) {
            return false;
        }

        if (app()->environment('local') && $response->getStatusCode() >= 500) {
            return false;
        }

        return true;
    }
}
