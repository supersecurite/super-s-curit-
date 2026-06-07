<?php

namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /** @var list<string> */
    private const SERVICES = [
        'entreprise',
        'residence',
        'chantiers',
        'zones-minieres',
    ];

    public function show(Request $request): Response
    {
        $serviceId = basename($request->path());

        abort_unless(in_array($serviceId, self::SERVICES, true), 404);

        return Inertia::render('marketing/service-page', [
            'serviceId' => $serviceId,
        ]);
    }
}
