<?php

namespace App\Http\Controllers\Marketing;

use App\Enums\SecurityAgentPost;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSecurityAgentApplicationRequest;
use App\Mail\SecurityAgentApplicationReceived;
use App\Models\SecurityAgentApplication;
use App\Support\GuineaLocationValidator;
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
                ['value' => 'jour', 'label' => 'Jour'],
                ['value' => 'nuit', 'label' => 'Nuit'],
                ['value' => '24h', 'label' => '24h/24'],
                ['value' => 'evenementiel', 'label' => 'Événementiel'],
            ],
            'postOptions' => SecurityAgentPost::options(),
        ]);
    }

    public function store(
        StoreSecurityAgentApplicationRequest $request,
        GuineaLocationValidator $locationValidator,
    ): RedirectResponse {
        $validated = $request->validated();
        $labels = $locationValidator->resolveLabels($validated);

        unset($validated['consent'], $validated['website']);

        $application = SecurityAgentApplication::query()->create([
            ...$validated,
            ...$labels,
        ]);

        Mail::to(config('super-securite.mail_to'))->send(
            new SecurityAgentApplicationReceived($application->toAdminArray()),
        );

        return redirect()->route('devenir-agent.merci');
    }

    public function thankYou(): Response
    {
        return Inertia::render('marketing/devenir-agent/merci');
    }
}
