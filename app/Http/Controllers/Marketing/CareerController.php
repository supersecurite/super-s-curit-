<?php

namespace App\Http\Controllers\Marketing;

use App\Actions\JobOffers\SubmitJobApplication;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSecurityAgentApplicationRequest;
use App\Models\JobOffer;
use App\Support\LocaleTranslations;
use App\Support\LocaleUrl;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CareerController extends Controller
{
    public function index(): Response
    {
        $offers = JobOffer::query()
            ->active()
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (JobOffer $offer) => $offer->toPublicListArray())
            ->all();

        return Inertia::render('marketing/carrieres/index', [
            'offers' => $offers,
        ]);
    }

    public function apply(JobOffer $jobOffer): Response
    {
        abort_unless($jobOffer->is_active, 404);

        return Inertia::render('marketing/carrieres/postuler', [
            'jobOffer' => $jobOffer->toPublicArray(),
            'availabilityOptions' => [
                ['value' => 'jour', 'label' => LocaleTranslations::trans('devenir_agent.availability.jour')],
                ['value' => 'nuit', 'label' => LocaleTranslations::trans('devenir_agent.availability.nuit')],
                ['value' => '24h', 'label' => LocaleTranslations::trans('devenir_agent.availability.24h')],
                ['value' => 'evenementiel', 'label' => LocaleTranslations::trans('devenir_agent.availability.evenementiel')],
            ],
        ]);
    }

    public function store(
        StoreSecurityAgentApplicationRequest $request,
        JobOffer $jobOffer,
        SubmitJobApplication $action,
    ): RedirectResponse {
        abort_unless($jobOffer->is_active, 404);

        $action->handle($jobOffer, $request->validated());

        return redirect()->route(LocaleUrl::routeName('carrieres.merci'));
    }

    public function thankYou(): Response
    {
        return Inertia::render('marketing/carrieres/merci');
    }
}
