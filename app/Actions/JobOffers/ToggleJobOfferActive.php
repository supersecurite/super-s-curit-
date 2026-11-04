<?php

namespace App\Actions\JobOffers;

use App\Actions\Action;
use App\Models\JobOffer;

/**
 * Active ou désactive une offre sans modifier le reste des champs.
 */
class ToggleJobOfferActive extends Action
{
    public function handle(JobOffer $offer, bool $active): JobOffer
    {
        $offer->is_active = $active;

        if ($active && $offer->published_at === null) {
            $offer->published_at = now();
        }

        $offer->save();

        return $offer->refresh();
    }
}
