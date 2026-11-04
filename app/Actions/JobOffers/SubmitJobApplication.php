<?php

namespace App\Actions\JobOffers;

use App\Actions\Action;
use App\Mail\SecurityAgentApplicationReceived;
use App\Models\JobOffer;
use App\Models\SecurityAgentApplication;
use App\Support\GuineaLocationValidator;
use Illuminate\Support\Facades\Mail;

/**
 * Enregistre une candidature publique liée à une offre active.
 */
class SubmitJobApplication extends Action
{
    public function __construct(
        private GuineaLocationValidator $locationValidator,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public function handle(JobOffer $offer, array $validated): SecurityAgentApplication
    {
        $validated = $this->locationValidator->enrichFromCommune($validated);
        $labels = $this->locationValidator->resolveLabels($validated);

        unset($validated['consent'], $validated['website'], $validated['post']);

        $application = SecurityAgentApplication::query()->create([
            ...$validated,
            ...$labels,
            'job_offer_id' => $offer->id,
            'post' => null,
        ]);

        Mail::to(config('super-securite.mail_to'))->send(
            new SecurityAgentApplicationReceived($application->load('jobOffer')->toAdminArray()),
        );

        return $application;
    }
}
