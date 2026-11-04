<?php

namespace App\Actions\JobOffers;

use App\Actions\Action;
use App\Models\JobOffer;

/**
 * Soft-delete une offre (les candidatures liées conservent la FK nullOnDelete).
 */
class DeleteJobOffer extends Action
{
    public function handle(JobOffer $offer): void
    {
        $offer->delete();
    }
}
