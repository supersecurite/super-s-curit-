<?php

namespace App\Http\Controllers\Marketing;

use App\Enums\SecurityAgentPost;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSecurityAgentApplicationRequest;
use App\Mail\SecurityAgentApplicationReceived;
use App\Models\SecurityAgentApplication;
use App\Support\GuineaLocationValidator;
use App\Support\LocaleUrl;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class SecurityAgentApplicationController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('marketing/devenir-agent/index', [
            'availabilityOptions' => [
                ['value' => 'jour', 'label' => __('devenir_agent.availability.jour')],
                ['value' => 'nuit', 'label' => __('devenir_agent.availability.nuit')],
                ['value' => '24h', 'label' => __('devenir_agent.availability.24h')],
                ['value' => 'evenementiel', 'label' => __('devenir_agent.availability.evenementiel')],
            ],
            'postOptions' => SecurityAgentPost::options(),
        ]);
    }

    public function store(
        StoreSecurityAgentApplicationRequest $request,
        GuineaLocationValidator $locationValidator,
    ): RedirectResponse {
        $validated = $locationValidator->enrichFromCommune($request->validated());
        $labels = $locationValidator->resolveLabels($validated);

        unset($validated['consent'], $validated['website']);

        $application = SecurityAgentApplication::query()->create([
            ...$validated,
            ...$labels,
        ]);

        Mail::to(config('super-securite.mail_to'))->send(
            new SecurityAgentApplicationReceived($application->toAdminArray()),
        );

        return redirect()->route(LocaleUrl::routeName('devenir-agent.merci'));
    }

    public function thankYou(): Response
    {
        return Inertia::render('marketing/devenir-agent/merci');
    }
}
